#pragma once

#include <Arduino.h>

void motorsSetup();
void stopMotors();
void brakeMotors();

void runMotors(int leftSpeed, int rightSpeed);

void driveCar(int mode, int speed, int turn, int brake);

