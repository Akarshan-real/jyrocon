# Jyrocon

**Jyrocon** is an ultra-low-latency, dual-mode remote-controlled (RC) car system controlled directly from an Android smartphone over **Bluetooth Low Energy (BLE)**.

The project features:
- **Mode 1 (Virtual Buttons & Tank Turn)**: Directional D-Pad controls with smooth throttle ramping, active emergency braking, and in-place zero-radius spin (Tank Turn).
- **Mode 2 (Free-Hand Gyro Tilt)**: Drive and steer naturally by tilting your smartphone in real-time, complete with on-the-fly neutral position calibration.

---

## Project Structure

```text
Jyrocon/
├── hardware/   # ESP32-S3 Firmware (PlatformIO + C++ + Arduino)
├── app/        # React Native Mobile Controller (Bare React Native CLI)
├── 3d-models/  # 3D printable chassis and mounting components
└── README.md   # This root documentation
```

---

## Architecture Overview

```text
[ React Native Android App ]
     |
     | (4-Byte Binary Stream: [mode, speed, turn, brake] every ~30ms)
     | BLE: writeWithoutResponse (7.5ms - 15ms connection interval)
     v
[ ESP32-S3 Peripheral ]
     |
     +---> [ SG90 Servo ]              Front Axle Steering (45° - 135°)
     +---> [ L298N Dual Motor Driver ] 2x N20 Rear Drive Motors (Forward / Reverse / 5kHz PWM)
     +---> [ Front White LEDs ]        Headlights (Always ON)
     +---> [ Rear Red LEDs ]           Reverse Lights (Active on reverse)
```

---

## 4-Byte BLE Communication Protocol

To ensure instant responsiveness without serial overhead, data is sent as raw 4-byte packets:

| Byte Index | Field | Data Type | Range | Description |
| :--- | :--- | :--- | :--- | :--- |
| `0` | `mode` | `uint8_t` | `1` or `2` | `1` = Virtual Buttons (D-Pad), `2` = Freehand Gyro Tilt |
| `1` | `speed` | `int8_t` | `-100` to `+100` | `-100` (Full Reverse), `0` (Idle), `+100` (Full Forward) |
| `2` | `turn` | `int8_t` | `-100` to `+100` | `-100` (Full Left), `0` (Center), `+100` (Full Right) |
| `3` | `brake` | `uint8_t` | `0` or `1` | `0` = Normal Driving, `1` = Active Electronic Brake |

---

## Safety Features

- **Watchdog Timeout**: The ESP32 firmware monitors packet timestamps. If connection drops or no packet arrives for > 200ms (`SAFETY_TIMEOUT_MS`), motors stop immediately and wheels center.
- **Fail-Safe Disconnect**: Automatically resets speed to 0, turn to 0, and releases brake on BLE disconnect.
- **Hardware-Level Active Brake**: Setting `brake` activates H-Bridge regenerative brake clamping (`PWM = 255`, both inputs `HIGH`) on both motor coils.

---

## Sub-Project Guides

- **Firmware Setup & Wiring**: See [hardware/README.md](hardware/README.md)
- **Mobile App Setup & Development**: See [app/README.md](app/README.md)
