# Jyrocon

**Jyrocon** is an ultra-low-latency, dual-mode remote-controlled (RC) car system controlled directly from an Android smartphone over **Bluetooth Low Energy (BLE)**.

The project features:
- **Mode 1 (Free-Hand Gyro Tilt)**: Drive and steer naturally by tilting your smartphone in real-time.
- **Mode 2 (Virtual Buttons & Tank Turn)**: Traditional directional controls with in-place zero-radius spin (Tank Turn) and servo-assisted steering.

---

## Project Structure

```text
Jyrocon/
├── hardware/   # ESP32-S3 Firmware (PlatformIO + C++ + Arduino)
├── app/        # React Native Mobile Controller (Bare React Native CLI)
└── README.md   # This root documentation
```

---

## Architecture Overview

```text
[ React Native Android App ]
     |
     | (3-Byte Binary Stream: [mode, speed, turn] every ~30ms)
     | BLE: writeWithoutResponse (7.5ms - 15ms connection interval)
     v
[ ESP32-S3 Peripheral ]
     |
     +---> [ SG90 Servo ]              Front Axle Steering (45° - 135°)
     +---> [ L298N Dual Motor Driver ] 2x N20 Rear Drive Motors (Forward/Reverse/PWM)
     +---> [ Front White LEDs ]        Headlights (Always ON)
     +---> [ Rear Red LEDs ]           Reverse Lights (Active on reverse)
     +---> [ Adafruit NeoPixel RGB ]   Status Indicator (Red Blink / Green / Blue)
```

---

## 3-Byte BLE Communication Protocol

To ensure instant responsiveness without serial overhead, data is sent as raw 3-byte packets:

| Byte Index | Field | Data Type | Range | Description |
| :--- | :--- | :--- | :--- | :--- |
| `0` | `mode` | `uint8_t` | `1` or `2` | `1` = Gyro Tilt Mode, `2` = Button Mode |
| `1` | `speed` | `int8_t` | `-100` to `+100` | `-100` (Full Reverse), `0` (Stop), `+100` (Full Forward) |
| `2` | `turn` | `int8_t` | `-100` to `+100` | `-100` (Full Left), `0` (Straight), `+100` (Full Right) |

---

## Sub-Project Guides

- **Firmware Setup & Wiring**: See [hardware/README.md](hardware/README.md)
- **Mobile App Setup & Development**: See [app/README.md](app/README.md)
