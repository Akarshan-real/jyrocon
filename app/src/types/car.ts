import { Device } from 'react-native-ble-plx';

export type ModeType = '1' | '2';

export type ConnectionStatus =
  | 'disconnected'
  | 'scanning'
  | 'connecting'
  | 'connected'
  | 'error';

export interface CarDrivingState {
  speed: number;
  turn: number;
  brake: boolean;
}

export interface CarContextType {
  mode: ModeType;
  setMode: (mode: ModeType) => void;

  drivingState: CarDrivingState;
  setThrottle: (speed: number) => void;
  setSteering: (turn: number) => void;
  setBrake: (active: boolean) => void;
  calibrateGyro: () => void;

  connectionStatus: ConnectionStatus;
  statusMessage: string;
  connectedDevice: Device | null;
  scannedDevices: Device[];
  startScan: () => Promise<void>;
  stopScan: () => void;
  connectToDevice: (device: Device) => Promise<boolean>;
  disconnect: () => Promise<void>;
}
