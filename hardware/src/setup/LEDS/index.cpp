#include <Arduino.h>
#include <Adafruit_NeoPixel.h>
#include <config.h>
#include <LEDS.h>

Adafruit_NeoPixel statusPixel(RGB_LED_COUNT, RGB_LED_PIN, NEO_GRB + NEO_KHZ800);

void ledsSetup() {
    pinMode(FRONT_LEDS_PIN, OUTPUT);
    pinMode(REAR_LEDS_PIN, OUTPUT);

    digitalWrite(FRONT_LEDS_PIN, HIGH);
    digitalWrite(REAR_LEDS_PIN, LOW);

    statusPixel.begin();
    statusPixel.setBrightness(RGB_BRIGHTNESS);
    statusPixel.setPixelColor(0, statusPixel.Color(255, 0, 0));
    statusPixel.show();

    Serial.println("[LEDs] Lights & Adafruit NeoPixel initialized!");
}
