#pragma once

#include <Arduino.h>

void ledsSetup();

void updateLeds(int speed);

void updateStatusLed(bool connected, int mode);
