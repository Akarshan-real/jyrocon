#include <Arduino.h>
#include <config.h>
#include <BLE.h>

// -----------------------------------------------------------------------------
// isPhoneConnected: Checks if phone is actively connected and streaming data
// Returns:
//   true  = Connected and sent data within the last SAFETY_TIMEOUT_MS (200ms)
//   false = Disconnected or silent for too long (safety trigger)
// -----------------------------------------------------------------------------
bool isPhoneConnected() {
    if (!phoneConnected) {
        return false;
    }

    if (millis() - lastMessageTime > SAFETY_TIMEOUT_MS) {
        return false; // Connection dropped or phone app paused
    }

    return true;
}

// -----------------------------------------------------------------------------
// processBlePacket: Validates and unpacks the 3-byte command from phone
// Expected Input Ranges:
//   rawData[0] (mode):  1 (MODE_GYRO) or 2 (MODE_BUTTON)
//   rawData[1] (speed): -100 (Full Reverse) to +100 (Full Forward), 0 = Stop
//   rawData[2] (turn):  -100 (Full Left) to +100 (Full Right), 0 = Straight
// -----------------------------------------------------------------------------
void processBlePacket(const std::string& rawData) {
    // Only accept exact 3-byte packets: [mode, speed, turn]
    if (rawData.length() != 3) {
        return;
    }

    int rawMode  = (uint8_t)rawData[0];
    int rawSpeed = (int8_t)rawData[1];
    int rawTurn  = (int8_t)rawData[2];

    // Range guard for mode: must be 1 (MODE_GYRO) or 2 (MODE_BUTTON)
    if (rawMode == MODE_GYRO) {
        carMode = MODE_GYRO;
    } else if (rawMode == MODE_BUTTON) {
        carMode = MODE_BUTTON;
    } else {
        carMode = MODE_BUTTON; // Fallback
    }

    // Range guard for speed: -100 to +100
    if (rawSpeed < -100) {
        carSpeed = -100;
    } else if (rawSpeed > 100) {
        carSpeed = 100;
    } else {
        carSpeed = rawSpeed;
    }

    // Range guard for turn: -100 to +100
    if (rawTurn < -100) {
        carTurn = -100;
    } else if (rawTurn > 100) {
        carTurn = 100;
    } else {
        carTurn = rawTurn;
    }

    // Update timestamp of last valid message
    lastMessageTime = millis();
}
