# Jyrocon - Mobile Controller App

Mobile controller application for the Jyrocon RC car. Built with **React Native (Bare CLI)** and **TypeScript** targeting Android.

---

## Key Features

- **Mode 1: Virtual Buttons (D-Pad) & Tank Turn**:
  - Tactile directional buttons for forward, reverse, left, and right.
  - Smooth acceleration/deceleration ramping for precise throttle control.
  - Pressing Left or Right alone at zero speed triggers an in-place **Tank Turn** (rear wheels counter-rotate to spin on the spot).
- **Mode 2: Free Hand (Gyroscope/Accelerometer Tilt)**:
  - Phone forward / backward pitch controls throttle (-100 to +100).
  - Phone left / right roll controls steering angle (-100 to +100).
  - **Set Neutral Calibration**: One-tap zeroing to calibrate your holding position as neutral.
- **Instrument Gauge & Dynamic Readout**:
  - Horizontally centered speed gauge with needle display.
  - Dynamic digital speed readout colored by state (Cyan = Forward, Orange = Reverse, Red = Braking).
- **Tactile Emergency Brake**:
  - Dedicated full-width brake control with instant throttle cut and active H-Bridge braking.
- **Scanning & Auto-Reconnect**:
  - Scanning screen (`SearchingBLE`) showing nearby devices with live RSSI signal bars and connection status.
  - Connected device badge with one-tap disconnect button.
- **Ultra-Low Latency Transmission**:
  - Uses `react-native-ble-plx` with `writeWithoutResponse`.
  - Compact 4-byte stream: `[mode, speed, turn, brake]` sent at ~30ms intervals.
  - High-speed BLE connection priority (7.5ms – 15ms connection interval).

---

## App Folder Structure

```text
app/
├── App.tsx                        # Root navigator (SearchingBLE <-> ControllerScreen)
├── android/                       # Android native project and manifest
│
└── src/
    ├── components/
    │   ├── ArrowButton/           # Directional button with haptic feedback
    │   ├── ArrowControl/          # Mode 1 D-Pad and central brake button
    │   ├── BrakeButton/           # Emergency brake button
    │   ├── CalibrateButton/       # Mode 2 neutral angle calibration button
    │   ├── FreehandControl/       # Mode 2 UI (Calibrate + Brake)
    │   └── ModeButton/            # Mode switcher toggle (Mode 1 / Mode 2)
    ├── config/
    │   └── bleConfig.ts           # Service/characteristic UUIDs, drive modes, and timing
    ├── context/
    │   └── CarContext.tsx         # Centralized state (BLE lifecycle, throttle ramping, sensor stream)
    ├── hooks/
    │   └── useCarControl.ts       # Hook for easy access to CarContext
    ├── screens/
    │   ├── ControllerScreen.tsx   # Primary control cockpit with gauge & dynamic controls
    │   └── SearchingBLE.tsx       # BLE device discovery & RSSI signal strength screen
    ├── services/
    │   ├── bleService.ts          # BLE scanning, connection, and transmission
    │   └── sensorService.ts       # Gyroscope & accelerometer sensor listener
    ├── styles/
    │   └── typography.ts          # Custom fonts (Anta-Regular, Wallpoet-Regular)
    ├── types/
    │   └── car.ts                 # TypeScript interfaces and packet definitions
    └── utils/
        └── feedback.ts            # Haptic vibration triggers
```

---

## Prerequisites

- **Node.js** (v18 or v20 LTS)
- **JDK 17**
- **Android SDK** with `ANDROID_HOME` configured
- Android phone with Bluetooth 5.0+

---

## Getting Started

From the `app/` directory:

```bash
# 1. Install dependencies
npm install

# 2. Start Metro bundler
npm run start

# 3. Run on connected Android device
npm run android
```
