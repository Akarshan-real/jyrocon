import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { Device } from 'react-native-ble-plx';
import {
  CarContextType,
  CarDrivingState,
  ConnectionStatus,
  ModeType,
} from '../types/car';
import { bleService } from '../services/bleService';
import { sensorService, TiltData } from '../services/sensorService';
import { BLE_CONFIG } from '../config/bleConfig';

const CarContext = createContext<CarContextType | undefined>(undefined);

interface CarProviderProps {
  children: ReactNode;
}

export const CarProvider: React.FC<CarProviderProps> = ({ children }) => {
  const [mode, setModeState] = useState<ModeType>('1');

  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('disconnected');
  const [statusMessage, setStatusMessage] = useState<string>('Disconnected');
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [scannedDevices, setScannedDevices] = useState<Device[]>([]);

  const [drivingState, setDrivingState] = useState<CarDrivingState>({
    speed: 0,
    turn: 0,
    brake: false,
  });

  const speedRef = useRef<number>(0);
  const turnRef = useRef<number>(0);
  const brakeRef = useRef<number>(0);
  const modeRef = useRef<number>(1);

  const rampTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const setMode = useCallback((newMode: ModeType) => {
    if (rampTimerRef.current) {
      clearInterval(rampTimerRef.current);
      rampTimerRef.current = null;
    }
    setModeState(newMode);
    modeRef.current = newMode === '1' ? 1 : 2;
  }, []);

  const setThrottle = useCallback((targetSpeed: number) => {
    if (modeRef.current === 2) {
      speedRef.current = targetSpeed;
      setDrivingState((prev) => ({ ...prev, speed: targetSpeed }));
      return;
    }

    if (rampTimerRef.current) {
      clearInterval(rampTimerRef.current);
      rampTimerRef.current = null;
    }

    const STEP_INTERVAL_MS = 25;
    const isStopping = targetSpeed === 0;
    const stepSize = isStopping ? 10 : 7;

    rampTimerRef.current = setInterval(() => {
      const current = speedRef.current;
      let next: number;

      if (current < targetSpeed) {
        next = Math.min(current + stepSize, targetSpeed);
      } else if (current > targetSpeed) {
        next = Math.max(current - stepSize, targetSpeed);
      } else {
        next = targetSpeed;
      }

      speedRef.current = next;
      setDrivingState((prev) => ({ ...prev, speed: next }));

      if (next === targetSpeed) {
        if (rampTimerRef.current) {
          clearInterval(rampTimerRef.current);
          rampTimerRef.current = null;
        }
      }
    }, STEP_INTERVAL_MS);
  }, []);

  const setSteering = useCallback((turnValue: number) => {
    turnRef.current = turnValue;
    setDrivingState((prev) => ({ ...prev, turn: turnValue }));
  }, []);

  const setBrake = useCallback((active: boolean) => {
    brakeRef.current = active ? 1 : 0;
    if (active) {
      if (rampTimerRef.current) {
        clearInterval(rampTimerRef.current);
        rampTimerRef.current = null;
      }
      speedRef.current = 0;
      setDrivingState((prev) => ({ ...prev, speed: 0, brake: true }));
    } else {
      setDrivingState((prev) => ({ ...prev, brake: false }));
    }
  }, []);

  const calibrateGyro = useCallback(() => {
    sensorService.calibrateNeutral();
  }, []);

  useEffect(() => {
    const isConnected = connectionStatus === 'connected';

    if (mode === '2' && isConnected) {
      sensorService.startListening((data: TiltData) => {
        speedRef.current = data.speed;
        turnRef.current = data.turn;
        setDrivingState((prev) => ({
          ...prev,
          speed: data.speed,
          turn: data.turn,
        }));
      });
    } else {
      sensorService.stopListening();
      if (mode === '1') {
        speedRef.current = 0;
        turnRef.current = 0;
        brakeRef.current = 0;
        setDrivingState({ speed: 0, turn: 0, brake: false });
      }
    }

    return () => {
      sensorService.stopListening();
    };
  }, [mode, connectionStatus]);

  const startScan = useCallback(async () => {
    const hasPerms = await bleService.requestPermissions();
    if (!hasPerms) {
      setConnectionStatus('error');
      setStatusMessage('Bluetooth permissions denied');
      return;
    }

    const isBtOn = await bleService.isBluetoothEnabled();
    if (!isBtOn) {
      setConnectionStatus('error');
      setStatusMessage('Bluetooth is turned OFF');
      return;
    }

    setScannedDevices([]);
    setConnectionStatus('scanning');
    setStatusMessage('Scanning for nearby BLE devices...');

    bleService.startScan(
      (device) => {
        setScannedDevices((prev) => {
          const index = prev.findIndex((d) => d.id === device.id);
          if (index >= 0) {
            const updated = [...prev];
            updated[index] = device;
            return updated;
          }
          return [...prev, device];
        });
      },
      (error) => {
        setConnectionStatus('error');
        setStatusMessage(`Scan failed: ${error?.message || 'Unknown'}`);
      },
    );
  }, []);

  const stopScan = useCallback(() => {
    bleService.stopScan();
    setConnectionStatus((prev) => {
      if (prev === 'scanning') {
        setStatusMessage('Scan stopped');
        return 'disconnected';
      }
      return prev;
    });
  }, []);

  const connectToDevice = useCallback(
    async (device: Device): Promise<boolean> => {
      stopScan();
      setConnectionStatus('connecting');
      setStatusMessage(`Connecting to ${device.name || 'ESP32-S3'}...`);

      const success = await bleService.connect(device, () => {
        setConnectionStatus('disconnected');
        setStatusMessage('Car disconnected');
        setConnectedDevice(null);
        speedRef.current = 0;
        turnRef.current = 0;
        brakeRef.current = 0;
        setDrivingState({ speed: 0, turn: 0, brake: false });
      });

      if (success) {
        setConnectionStatus('connected');
        setStatusMessage('Connected & Ready!');
        setConnectedDevice(device);
        return true;
      } else {
        setConnectionStatus('error');
        setStatusMessage('Failed to connect');
        setConnectedDevice(null);
        return false;
      }
    },
    [stopScan],
  );

  const disconnect = useCallback(async () => {
    await bleService.disconnect();
    setConnectionStatus('disconnected');
    setStatusMessage('Disconnected');
    setConnectedDevice(null);
    speedRef.current = 0;
    turnRef.current = 0;
    brakeRef.current = 0;
    setDrivingState({ speed: 0, turn: 0, brake: false });
  }, []);

  useEffect(() => {
    if (connectionStatus !== 'connected') {
      return;
    }

    const timer = setInterval(() => {
      bleService.sendCarPacket(
        modeRef.current,
        speedRef.current,
        turnRef.current,
        brakeRef.current,
      );
    }, BLE_CONFIG.TRANSMIT_INTERVAL_MS);

    return () => {
      clearInterval(timer);
    };
  }, [connectionStatus]);

  const value: CarContextType = {
    mode,
    setMode,
    drivingState,
    setThrottle,
    setSteering,
    setBrake,
    calibrateGyro,
    connectionStatus,
    statusMessage,
    connectedDevice,
    scannedDevices,
    startScan,
    stopScan,
    connectToDevice,
    disconnect,
  };

  return <CarContext.Provider value={value}>{children}</CarContext.Provider>;
};

export const useCar = (): CarContextType => {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error('useCar must be used within a <CarProvider>');
  }
  return context;
};

