#pragma once

#include <Arduino.h>

void motorsSetup();
void stopMotors();

// Direct motor control (-100 to +100)
void runMotors(int leftSpeed, int rightSpeed);

// Smart drive: handles normal forward/back driving AND tank turns
void driveCar(int mode, int speed, int turn);
