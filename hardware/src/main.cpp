#include <Arduino.h>
#include <config.h>
#include <BLE.h>
#include <Steering.h>
#include <Motors.h>
#include <LEDS.h>

void setup() {
    Serial.begin(115200);

    bleSetup();       // 1. Start Bluetooth
    steeringSetup();  // 2. Start and center steering servo
    motorsSetup();    // 3. Start motor driver
    ledsSetup();      // 4. Start headlights (Front ON, Rear OFF)
}

void loop() {
    bool connected = isPhoneConnected();

    // 1. Status Indicator LED (Adafruit NeoPixel)
    // Red blinking = Not connected | Solid Green = Mode 1 (Gyro) | Solid Blue = Mode 2 (Buttons)
    updateStatusLed(connected, carMode);

    // 2. Safety check: if phone is disconnected or silent, stop everything!
    if (!connected) {
        stopMotors();
        centerWheels();
        updateLeds(0); // Rear lights OFF, Front ON
        delay(10);
        return;
    }

    // 3. Steering:
    // In Tank Turn (Button mode with speed == 0), keep wheels straight so tires don't drag
    if (carMode == MODE_BUTTON && carSpeed == 0 && carTurn != 0) {
        centerWheels();
    } else {
        turnWheels(carTurn);
    }

    // 4. Motors:
    driveCar(carMode, carSpeed, carTurn);

    // 5. Headlights & Reverse lights:
    updateLeds(carSpeed);

    delay(10); // Smooth 10ms loop cadence (~100 updates/second)
}


