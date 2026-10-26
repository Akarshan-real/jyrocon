import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import { Subscription } from 'rxjs';

export const SENSOR_CONFIG = {
  UPDATE_INTERVAL_MS: 30,
  
  DEADZONE_SPEED: 8,
  DEADZONE_TURN: 8,

  MAX_TILT_DEGREES: 30,
};

export interface TiltData {
  speed: number;
  turn: number;
}

class SensorService {
  private subscription: Subscription | null = null;
  private isListening: boolean = false;

  private neutralPitchOffset: number = 0;

  public calibrateNeutral(currentPitch: number = 0): void {
    this.neutralPitchOffset = currentPitch;
    console.log('[Sensor] Calibrated neutral pitch offset:', this.neutralPitchOffset);
  }

  public startListening(onTiltUpdate: (data: TiltData) => void): void {
    if (this.isListening) {
      return;
    }

    setUpdateIntervalForType(
      SensorTypes.accelerometer,
      SENSOR_CONFIG.UPDATE_INTERVAL_MS,
    );

    this.subscription = accelerometer.subscribe(({ x, y, z }) => {

      const rawTurnDegrees = Math.atan2(x, Math.sqrt(y * y + z * z)) * (180 / Math.PI);
      const rawPitchDegrees = Math.atan2(-y, Math.sqrt(x * x + z * z)) * (180 / Math.PI);

      const adjustedPitchDegrees = rawPitchDegrees - this.neutralPitchOffset;

      let calculatedTurn = (rawTurnDegrees / SENSOR_CONFIG.MAX_TILT_DEGREES) * 100;
      let calculatedSpeed = (adjustedPitchDegrees / SENSOR_CONFIG.MAX_TILT_DEGREES) * 100;

      calculatedTurn = Math.max(-100, Math.min(100, calculatedTurn));
      calculatedSpeed = Math.max(-100, Math.min(100, calculatedSpeed));

      if (Math.abs(calculatedTurn) < SENSOR_CONFIG.DEADZONE_TURN) {
        calculatedTurn = 0;
      }
      if (Math.abs(calculatedSpeed) < SENSOR_CONFIG.DEADZONE_SPEED) {
        calculatedSpeed = 0;
      }

      onTiltUpdate({
        speed: Math.round(calculatedSpeed),
        turn: Math.round(calculatedTurn),
      });
    });

    this.isListening = true;
    console.log('[Sensor] Started accelerometer tilt streaming at 30ms interval');
  }

  public stopListening(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    this.isListening = false;
    console.log('[Sensor] Stopped accelerometer streaming');
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

export const sensorService = new SensorService();
