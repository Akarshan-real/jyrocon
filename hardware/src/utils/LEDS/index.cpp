#include <Arduino.h>
#include <Adafruit_NeoPixel.h>
#include <config.h>
#include <BLE.h>
#include <LEDS.h>

extern Adafruit_NeoPixel statusPixel;

static unsigned long lastBlinkTime = 0;
static bool blinkState = false;

void updateLeds(int speed) {
    if (speed < -100) {
        speed = -100;
    } else if (speed > 100) {
        speed = 100;
    } else {
    }

    digitalWrite(FRONT_LEDS_PIN, HIGH);

    if (speed < 0) {
        digitalWrite(REAR_LEDS_PIN, HIGH);
    } else {
        digitalWrite(REAR_LEDS_PIN, LOW);
    }
}

void updateStatusLed(bool connected, int mode) {
    if (!connected) {
        if (millis() - lastBlinkTime >= 500) {
            lastBlinkTime = millis();
            blinkState = !blinkState;

            if (blinkState) {
                statusPixel.setPixelColor(0, statusPixel.Color(255, 0, 0));
            } else {
                statusPixel.setPixelColor(0, statusPixel.Color(0, 0, 0));
            }
            statusPixel.show();
        }
        return;
    }

    if (mode == MODE_GYRO) {
        statusPixel.setPixelColor(0, statusPixel.Color(0, 255, 0));
    } else if (mode == MODE_BUTTON) {
        statusPixel.setPixelColor(0, statusPixel.Color(0, 0, 255));
    } else {
        statusPixel.setPixelColor(0, statusPixel.Color(100, 100, 100));
    }
    statusPixel.show();
}

