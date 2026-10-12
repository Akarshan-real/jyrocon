#pragma once

#include <Arduino.h>

void steeringSetup();

// Turn front wheels: -100 (Full Left) to +100 (Full Right), 0 is straight
void turnWheels(int turnAmount);

// Straighten front wheels (90 degrees)
void centerWheels();
