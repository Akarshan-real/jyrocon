#include <Arduino.h>
#include <config.h>
#include <BLE.h>
#include <Steering.h>
#include <Motors.h>
#include <LEDS.h>

void setup() {
    Serial.begin(115200);

    bleSetup();
    steeringSetup();
    motorsSetup();
    ledsSetup();
}

void loop() {
    bool connected = isPhoneConnected();

    updateStatusLed(connected, carMode);

    if (!connected) {
        stopMotors();
        centerWheels();
        updateLeds(0);
        delay(10);
        return;
    }

    if (carMode == MODE_BUTTON && carSpeed == 0 && carTurn != 0) {
        centerWheels();
    } else {
        turnWheels(carTurn);
    }

    driveCar(carMode, carSpeed, carTurn, carBrake);

    updateLeds(carSpeed);

    delay(10);
}

