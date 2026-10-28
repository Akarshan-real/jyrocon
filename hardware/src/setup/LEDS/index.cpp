#include <Arduino.h>
#include <config.h>
#include <LEDS.h>

void ledsSetup() {
    pinMode(FRONT_LEDS_PIN, OUTPUT);
    pinMode(REAR_LEDS_PIN, OUTPUT);

    digitalWrite(FRONT_LEDS_PIN, HIGH);
    digitalWrite(REAR_LEDS_PIN, LOW);

    Serial.println("[LEDs] Headlights and Reverse LEDs initialized!");
}
