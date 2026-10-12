#include <Arduino.h>
#include <Adafruit_NeoPixel.h>
#include <config.h>
#include <LEDS.h>

// Shared NeoPixel object
Adafruit_NeoPixel statusPixel(RGB_LED_COUNT, RGB_LED_PIN, NEO_GRB + NEO_KHZ800);

void ledsSetup() {
    // 1. Regular headlights and reverse lights
    pinMode(FRONT_LEDS_PIN, OUTPUT);
    pinMode(REAR_LEDS_PIN, OUTPUT);

    digitalWrite(FRONT_LEDS_PIN, HIGH); // Front headlights ALWAYS ON
    digitalWrite(REAR_LEDS_PIN, LOW);   // Rear reverse lights OFF

    // 2. Adafruit NeoPixel RGB Status LED
    statusPixel.begin();
    statusPixel.setBrightness(RGB_BRIGHTNESS);
    statusPixel.setPixelColor(0, statusPixel.Color(255, 0, 0)); // Start RED
    statusPixel.show();

    Serial.println("[LEDs] Lights & Adafruit NeoPixel initialized!");
}
