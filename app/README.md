# Jyrocon - Mobile Controller App

Mobile controller application for the Jyrocon RC car. Built with **React Native (Bare CLI)** and **TypeScript** targeting Android.

---

## Key Features

- **Mode 1: Free Hand (Gyroscope/Accelerometer Tilt)**:
  - Phone forward / backward tilt controls speed (-100 to +100).
  - Phone left / right tilt controls steering angle (-100 to +100).
- **Mode 2: Virtual Buttons & Tank Turn**:
  - Directional buttons for forward and reverse with servo steering.
  - Pressing Left or Right alone triggers an in-place **Tank Turn** (wheels spin in opposite directions to rotate in place).
- **Ultra-Low Latency Transmission**:
  - Uses `react-native-ble-plx` with `writeWithoutResponse`.
  - Streams compact 3-byte packets at ~30ms intervals.
  - Requests high-speed BLE connection priority (7.5ms - 15ms interval).

---

## App Folder Structure

```text
app/
├── App.tsx                    # Root component (renders ControllerScreen)
├── android/                   # Android native project and manifest
│
└── src/
    ├── config/
    │   └── bleConfig.ts       # UUIDs and transmission constants
    ├── services/
    │   ├── bleService.ts      # BLE scanning, connection, and transmission
    │   └── sensorService.ts   # Gyro/accelerometer streaming
    ├── hooks/
    │   └── useCarControl.ts   # Custom hook connecting sensors, UI, and BLE loop
    └── screens/
        └── ControllerScreen.tsx # Dual-mode controller UI
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
npx react-native start

# 3. Run on connected Android device
npx react-native run-android
```
