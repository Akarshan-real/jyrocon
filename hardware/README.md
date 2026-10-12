# Jyrocon - Hardware Firmware

Firmware for the **ESP32-S3** microcontroller powering the Jyrocon RC car. Built with **C++** using the **Arduino framework** in **PlatformIO**.

---

## Hardware Specifications

- **Microcontroller**: ESP32-S3-N16R8 (Dual-Core Xtensa LX7, 240 MHz, 16MB Flash, 8MB PSRAM)
- **Bluetooth Stack**: NimBLE-Arduino (BLE 5.0, low memory footprint, high throughput)
- **Steering**: SG90 Micro Servo (50Hz PWM, 45° to 135° travel limit)
- **Drive Motors**: 2x N20 Micro Gear Motors (Rear-Wheel Drive)
- **Motor Driver**: L298N Dual H-Bridge Driver Module
- **Lighting**:
  - 2x White Front LEDs (Headlights, always ON)
  - 2x Red Rear LEDs (Reverse lights, ON only when speed < 0)
  - 1x Adafruit NeoPixel WS2812 RGB (Status indicator)

---

## Pinout Map (`include/config.h`)

| Component | Function | ESP32-S3 Pin | Notes |
| :--- | :--- | :--- | :--- |
| **Front Servo** | PWM Signal | `GPIO 4` | 50Hz, 500-2400µs pulse |
| **Left Rear Motor** | Speed (`ENA`) | `GPIO 5` | Hardware PWM (5 kHz, 8-bit) |
| **Left Rear Motor** | Forward (`IN1`) | `GPIO 6` | Direction pin |
| **Left Rear Motor** | Backward (`IN2`) | `GPIO 7` | Direction pin |
| **Right Rear Motor** | Speed (`ENB`) | `GPIO 8` | Hardware PWM (5 kHz, 8-bit) |
| **Right Rear Motor** | Forward (`IN3`) | `GPIO 9` | Direction pin |
| **Right Rear Motor** | Backward (`IN4`) | `GPIO 10` | Direction pin |
| **Headlights** | 2x White LEDs | `GPIO 11` | Always ON |
| **Reverse Lights** | 2x Red LEDs | `GPIO 12` | Active on Reverse |
| **RGB Status LED** | WS2812 Data | `GPIO 48` | Onboard DevKit NeoPixel |

---

## Firmware Architecture

```text
hardware/
├── include/
│   ├── config.h             # All GPIO pins, limits, and UUIDs
│   ├── BLE.h                # Bluetooth interface declarations
│   ├── Steering.h           # Servo steering interface
│   ├── Motors.h             # L298N motor interface
│   └── LEDS.h               # Headlights, reverse lights & NeoPixel interface
│
├── src/
│   ├── main.cpp             # Main loop with failsafe check and orchestration
│   ├── setup/               # INITIALIZATION ONLY (runs once in setup())
│   │   ├── BLE/index.cpp
│   │   ├── Steering/index.cpp
│   │   ├── Motors/index.cpp
│   │   └── LEDS/index.cpp
│   └── utils/               # RUNTIME ACTIONS (runs continuously in loop())
│       ├── BLE/index.cpp     # isPhoneConnected(), processBlePacket() with range guards
│       ├── Steering/index.cpp# turnWheels(), centerWheels() with range guards
│       ├── Motors/index.cpp  # runMotors(), driveCar(), stopMotors() with range guards
│       └── LEDS/index.cpp    # updateLeds(), updateStatusLed() with range guards
```

---

## Status LED Behavior

- **Blinking Red** (500ms): Disconnected / searching for phone.
- **Solid Green**: Connected in **Mode 1** (Gyro tilt mode).
- **Solid Blue**: Connected in **Mode 2** (Button mode).

---

## Build and Flash

From the `hardware/` directory:

```bash
# Build firmware
pio run

# Upload to ESP32-S3 and open serial monitor
pio run -t upload -t monitor
```
