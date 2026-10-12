#pragma once

#include <Arduino.h>

// Drive modes
#define MODE_GYRO   1
#define MODE_BUTTON 2

// Live data received from phone:
extern int carMode;   // 1 = Gyro, 2 = Buttons
extern int carSpeed;  // -100 (Full Reverse) to +100 (Full Forward)
extern int carTurn;   // -100 (Full Left) to +100 (Full Right)

extern bool phoneConnected;
extern unsigned long lastMessageTime;

// Functions you can use:
void bleSetup();
bool isPhoneConnected();
void processBlePacket(const std::string& rawData);