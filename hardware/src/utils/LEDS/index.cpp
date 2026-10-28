#include <Arduino.h>
#include <config.h>
#include <BLE.h>
#include <LEDS.h>

void updateLeds(int speed) {
    speed = constrain(speed, -100, 100);

    digitalWrite(FRONT_LEDS_PIN, HIGH);

    if (speed < 0) {
        digitalWrite(REAR_LEDS_PIN, HIGH);
    } else {
        digitalWrite(REAR_LEDS_PIN, LOW);
    }
}

