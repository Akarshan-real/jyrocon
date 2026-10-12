#pragma once

#include <Arduino.h>

/**
 * Initialize all car lighting:
 * - Front White LEDs (Headlights: Always ON)
 * - Rear Red LEDs (Reverse lights: OFF by default)
 * - Adafruit NeoPixel RGB Status LED
 */
void ledsSetup();

// -----------------------------------------------------------------------------
// updateLeds: Controls headlights & reverse lights based on speed
// Inputs:
//   speed: -100 (Full Reverse) to +100 (Full Forward), 0 = Stopped
// -----------------------------------------------------------------------------
void updateLeds(int speed);

// -----------------------------------------------------------------------------
// updateStatusLed: Controls Adafruit RGB NeoPixel status indicator
// Inputs:
//   connected: true if phone is connected and sending data, false otherwise
//   mode:      1 (MODE_GYRO) or 2 (MODE_BUTTON)
// Behavior:
//   - Not Connected:  Blinks RED smoothly (every 500ms)
//   - Connected Mode 1: Solid GREEN
//   - Connected Mode 2: Solid BLUE
// -----------------------------------------------------------------------------
void updateStatusLed(bool connected, int mode);
