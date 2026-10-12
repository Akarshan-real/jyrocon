#include <Arduino.h>
#include <Adafruit_NeoPixel.h>
#include <config.h>
#include <BLE.h>
#include <LEDS.h>

extern Adafruit_NeoPixel statusPixel;

static unsigned long lastBlinkTime = 0;
static bool blinkState = false;

// -----------------------------------------------------------------------------
// updateLeds: Controls car lighting based on driving speed
// Expected Input Range:
//   speed: -100 (Full Reverse) to +100 (Full Forward), 0 = Stopped
// Behavior:
//   - Front White LEDs: Always ON
//   - Rear Red LEDs:    ON when in reverse (speed < 0), OFF otherwise
// -----------------------------------------------------------------------------
void updateLeds(int speed) {
    // Range guard for speed: -100 to +100
    if (speed < -100) {
        speed = -100;
    } else if (speed > 100) {
        speed = 100;
    } else {
        // Valid range
    }

    // Front white headlights stay on all the time
    digitalWrite(FRONT_LEDS_PIN, HIGH);

    // Rear red lights turn ON only when moving in reverse (speed < 0)
    if (speed < 0) {
        // In Reverse: Turn red lights ON
        digitalWrite(REAR_LEDS_PIN, HIGH);
    } else {
        // Forward or Stopped: Turn red lights OFF
        digitalWrite(REAR_LEDS_PIN, LOW);
    }
}

// -----------------------------------------------------------------------------
// updateStatusLed: Controls Adafruit RGB NeoPixel status indicator
// Expected Input Ranges:
//   connected: true (Phone connected & alive) or false (Disconnected / silent)
//   mode:      1 (MODE_GYRO) or 2 (MODE_BUTTON)
// Behavior:
//   - Not Connected:    Blinks RED every 500ms
//   - Connected Mode 1: Solid GREEN (Gyro mode)
//   - Connected Mode 2: Solid BLUE (Button mode)
// -----------------------------------------------------------------------------
void updateStatusLed(bool connected, int mode) {
    if (!connected) {
        // Red Blinking when disconnected (every 500ms without blocking delay!)
        if (millis() - lastBlinkTime >= 500) {
            lastBlinkTime = millis();
            blinkState = !blinkState;

            if (blinkState) {
                statusPixel.setPixelColor(0, statusPixel.Color(255, 0, 0)); // RED
            } else {
                statusPixel.setPixelColor(0, statusPixel.Color(0, 0, 0));   // OFF
            }
            statusPixel.show();
        }
        return;
    }

    // Range guard for mode: must be 1 (MODE_GYRO) or 2 (MODE_BUTTON)
    if (mode == MODE_GYRO) {
        // Mode 1: Solid GREEN (Gyro tilt active)
        statusPixel.setPixelColor(0, statusPixel.Color(0, 255, 0));
    } else if (mode == MODE_BUTTON) {
        // Mode 2: Solid BLUE (Button pad active)
        statusPixel.setPixelColor(0, statusPixel.Color(0, 0, 255));
    } else {
        // Unknown mode fallback: Solid White
        statusPixel.setPixelColor(0, statusPixel.Color(100, 100, 100));
    }
    statusPixel.show();
}

