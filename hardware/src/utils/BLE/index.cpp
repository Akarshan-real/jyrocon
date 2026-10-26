#include <Arduino.h>
#include <config.h>
#include <BLE.h>

bool isPhoneConnected() {
    if (!phoneConnected) {
        return false;
    }

    if (millis() - lastMessageTime > SAFETY_TIMEOUT_MS) {
        return false;
    }

    return true;
}

void processBlePacket(const std::string& rawData) {
    if (rawData.length() < 3) {
        return;
    }

    int rawMode  = (uint8_t)rawData[0];
    int rawSpeed = (int8_t)rawData[1];
    int rawTurn  = (int8_t)rawData[2];
    int rawBrake = rawData.length() >= 4 ? (uint8_t)rawData[3] : 0;

    if (rawMode == MODE_GYRO) {
        carMode = MODE_GYRO;
    } else if (rawMode == MODE_BUTTON) {
        carMode = MODE_BUTTON;
    } else {
        carMode = MODE_BUTTON;
    }

    if (rawSpeed < -100) {
        carSpeed = -100;
    } else if (rawSpeed > 100) {
        carSpeed = 100;
    } else {
        carSpeed = rawSpeed;
    }

    if (rawTurn < -100) {
        carTurn = -100;
    } else if (rawTurn > 100) {
        carTurn = 100;
    } else {
        carTurn = rawTurn;
    }

    carBrake = (rawBrake == 1) ? 1 : 0;

    lastMessageTime = millis();
}

