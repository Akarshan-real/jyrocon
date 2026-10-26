import {
  BleManager,
  Device,
  ConnectionPriority,
  State,
} from 'react-native-ble-plx';
import { PermissionsAndroid, Platform } from 'react-native';
import { Buffer } from 'buffer';
import { BLE_CONFIG } from '../config/bleConfig';

class BleService {
  private manager: BleManager;
  private connectedDevice: Device | null = null;
  private isWriting: boolean = false;

  constructor() {
    this.manager = new BleManager();
  }

  public async requestPermissions(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return true;
    }

    if (Platform.Version >= 31) {
      const results = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);

      const scanGranted =
        results[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] ===
        PermissionsAndroid.RESULTS.GRANTED;
      const connectGranted =
        results[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] ===
        PermissionsAndroid.RESULTS.GRANTED;

      return scanGranted && connectGranted;
    }

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  public async isBluetoothEnabled(): Promise<boolean> {
    const state = await this.manager.state();
    return state === State.PoweredOn;
  }

  public startScan(
    onDeviceFound: (device: Device) => void,
    onError: (error: any) => void,
  ): void {
    this.manager.stopDeviceScan();

    this.manager.startDeviceScan(
      null,
      { allowDuplicates: true },
      (error, device) => {
        if (error) {
          onError(error);
          return;
        }

        if (device && (device.name || device.localName)) {
          onDeviceFound(device);
        }
      },
    );
  }

  public stopScan(): void {
    this.manager.stopDeviceScan();
  }

  public async connect(
    device: Device,
    onDisconnected: () => void,
  ): Promise<boolean> {
    try {
      this.manager.stopDeviceScan();

      const connectedDevice = await device.connect();
      this.connectedDevice = connectedDevice;

      await connectedDevice.discoverAllServicesAndCharacteristics();

      if (Platform.OS === 'android') {
        await connectedDevice.requestConnectionPriority(
          ConnectionPriority.High,
        );
      }

      connectedDevice.onDisconnected((error, disconnectedDev) => {
        console.log('[BLE] Device disconnected:', disconnectedDev?.id, error);
        this.connectedDevice = null;
        onDisconnected();
      });

      console.log('[BLE] Successfully connected to ESP32-S3 in High-Priority mode!');
      return true;
    } catch (error) {
      console.error('[BLE] Connection error:', error);
      this.connectedDevice = null;
      return false;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.connectedDevice) {
      try {
        await this.connectedDevice.cancelConnection();
      } catch (e) {
        console.log('[BLE] Disconnect error (ignored):', e);
      }
      this.connectedDevice = null;
    }
  }

  public isConnected(): boolean {
    return this.connectedDevice !== null;
  }

  public async sendCarPacket(
    mode: number,
    speed: number,
    turn: number,
    brake: number = 0,
  ): Promise<void> {
    if (!this.connectedDevice || this.isWriting) {
      return;
    }

    const safeMode = mode === 1 ? 1 : 2;
    const safeSpeed = Math.max(-100, Math.min(100, Math.round(speed)));
    const safeTurn = Math.max(-100, Math.min(100, Math.round(turn)));
    const safeBrake = brake === 1 ? 1 : 0;

    const buffer = Buffer.alloc(4);
    buffer.writeUInt8(safeMode, 0);
    buffer.writeInt8(safeSpeed, 1);
    buffer.writeInt8(safeTurn, 2);
    buffer.writeUInt8(safeBrake, 3);

    const base64Data = buffer.toString('base64');

    this.isWriting = true;
    try {
      await this.connectedDevice.writeCharacteristicWithoutResponseForService(
        BLE_CONFIG.SERVICE_UUID,
        BLE_CONFIG.CHARACTERISTIC_UUID,
        base64Data,
      );
    } catch (error) {
    } finally {
      this.isWriting = false;
    }
  }
}

export const bleService = new BleService();
