# Jyrocon - Hardware Firmware

Firmware for the **ESP32-S3** microcontroller powering the Jyrocon RC car. Built with **C++** using the **Arduino framework** in **PlatformIO**.

---

## Hardware Specifications

- **Microcontroller**: ESP32-S3-DevKitC-1 (Dual-Core Xtensa LX7, 240 MHz, 16MB Flash, 8MB PSRAM)
- **Bluetooth Stack**: NimBLE-Arduino (BLE 5.0, low memory footprint, high throughput)
- **Steering**: SG90 Micro Servo (50Hz PWM, 45° to 135° travel limit, centered at 90°)
- **Drive Motors**: 2x N20 Micro Gear Motors (Rear-Wheel Drive)
- **Motor Driver**: L298N Dual H-Bridge Driver Module
- **Lighting**:
  - 2x White Front LEDs (Headlights, always ON)
  - 2x Red Rear LEDs (Reverse lights, active only when speed < 0)

---

## Pinout Map (`include/config.h`)

| Component | Function | ESP32-S3 Pin | Notes |
| :--- | :--- | :--- | :--- |
| **Front Servo** | PWM Signal | `GPIO 4` | 50Hz, 500–2400µs pulse range |
| **Left Rear Motor** | Speed (`ENA`) | `GPIO 5` | Hardware PWM Channel 0 (5 kHz, 8-bit) |
| **Left Rear Motor** | Forward (`IN1`) | `GPIO 6` | Direction pin |
| **Left Rear Motor** | Backward (`IN2`) | `GPIO 7` | Direction pin |
| **Right Rear Motor** | Speed (`ENB`) | `GPIO 8` | Hardware PWM Channel 1 (5 kHz, 8-bit) |
| **Right Rear Motor** | Forward (`IN3`) | `GPIO 9` | Direction pin |
| **Right Rear Motor** | Backward (`IN4`) | `GPIO 10` | Direction pin |
| **Headlights** | 2x White LEDs | `GPIO 11` | Always ON |
| **Reverse Lights** | 2x Red LEDs | `GPIO 12` | Active on Reverse (`speed < 0`) |

---

## Firmware Architecture

```text
hardware/
├── include/
│   ├── config.h             # All GPIO pins, limits, PWM channels, and UUIDs
│   ├── BLE.h                # Bluetooth interface declarations & mode definitions
│   ├── Steering.h           # Servo steering interface (setServoAngle, turnWheels, centerWheels)
│   ├── Motors.h             # L298N motor interface (runMotors, driveCar, stopMotors, brakeMotors)
│   └── LEDS.h               # Headlights and reverse lights interface
│
├── src/
│   ├── main.cpp             # Main loop with failsafe check, Ackermann steering, and drive orchestration
│   ├── setup/               # INITIALIZATION ONLY (runs once in setup())
│   │   ├── BLE/index.cpp     # NimBLE server, characteristic & callback setup
│   │   ├── Steering/index.cpp# Servo attachment and center calibration
│   │   ├── Motors/index.cpp  # Direction pinModes & LEDC PWM channel attachment (5 kHz, 8-bit)
│   │   └── LEDS/index.cpp    # Headlight & reverse light pin configuration
│   └── utils/               # RUNTIME ACTIONS (runs continuously in loop())
│       ├── BLE/index.cpp     # isPhoneConnected() watchdog check, processBlePacket() with constrain()
│       ├── Steering/index.cpp# turnWheels() with map() and constrain(), centerWheels()
│       ├── Motors/index.cpp  # runMotors(), driveCar() (tank turn, braking, driving), stopMotors()
│       └── LEDS/index.cpp    # updateLeds() based on speed
```

---

## Driving Behaviors

1. **Emergency Brake**:
   When `carBrake` is `true`, both motor channels enter active brake mode (`PWM = 255`, both direction pins `HIGH`), arresting motion via counter-EMF.
2. **Mode 1 Tank Turn**:
   When `carMode == MODE_BUTTON`, `carSpeed == 0`, and `carTurn != 0`, the rear motors counter-rotate (`-abs(turn)` vs `+abs(turn)`) to spin the car 360° in place while front wheels remain centered.
3. **Ackermann Steering**:
   During forward or backward motion (and in Mode 2 Tilt), steering is handled smoothly by the front servo (`45°` to `135°`) while rear motors provide equal driving thrust.
4. **Safety Watchdog**:
   If no BLE packet is received for > 200ms (`SAFETY_TIMEOUT_MS`), `isPhoneConnected()` returns `false`, immediately stopping motors, centering wheels, and shutting off reverse lights.

---

## Build and Flash

From the `hardware/` directory:

```bash
# Build firmware
pio run

# Upload to ESP32-S3 and open serial monitor
pio run -t upload -t monitor
```
