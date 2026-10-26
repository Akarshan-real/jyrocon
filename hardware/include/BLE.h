#pragma once

#include <Arduino.h>

#define MODE_GYRO   1
#define MODE_BUTTON 2

extern int carMode;
extern int carSpeed;
extern int carTurn;
extern int carBrake;

extern bool phoneConnected;
extern unsigned long lastMessageTime;

void bleSetup();
bool isPhoneConnected();
void processBlePacket(const std::string& rawData);