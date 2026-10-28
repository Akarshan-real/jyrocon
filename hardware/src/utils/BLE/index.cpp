#include <Arduino.h>
#include <config.h>
#include <BLE.h>

bool isPhoneConnected() {
    if (!phoneConnected) {
        return false;
    }

    if ((millis() - lastMessageTime) > SAFETY_TIMEOUT_MS) {
        return false;
    }

    return true;
}

void processBlePacket(const uint8_t* data, size_t length) {
    if (data == nullptr || length < 3) {
        return;
    }

    // Byte 0: Drive Mode Selection (1 = MODE_BUTTON, 2 = MODE_GYRO)
    int rawMode  = (uint8_t)data[0];

    // Byte 1: Throttle / Speed (-100 to +100)
    int rawSpeed = (int8_t)data[1];

    // Byte 2: Steering Angle (-100 to +100)
    int rawTurn  = (int8_t)data[2];

    // Byte 3: Emergency Brake flag (0 or 1, optional 4th byte for backwards compatibility)
    int rawBrake = length >= 4 ? (uint8_t)data[3] : 0;

    // Validate mode: 2 = Gyro Tilt, fallback to 1 = Virtual Buttons
    if (rawMode == MODE_GYRO) {
        carMode = MODE_GYRO;
    } else {
        carMode = MODE_BUTTON;
    }

    // Clamp speed: [-100 (Reverse) ... 0 (Idle) ... +100 (Forward)]
    carSpeed = constrain(rawSpeed, -100, 100);

    // Clamp turn: [-100 (Full Left) ... 0 (Center) ... +100 (Full Right)]
    carTurn  = constrain(rawTurn, -100, 100);

    // Boolean Brake flag: true = Hard Brake active, false = Normal drive
    carBrake = (rawBrake == 1);

    // Update timestamp to refresh the 200ms safety watchdog
    lastMessageTime = millis();
}