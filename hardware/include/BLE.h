#pragma once

#include <Arduino.h>

#define MODE_BUTTON 1
#define MODE_GYRO   2

extern int carMode;
extern int carSpeed;
extern int carTurn;
extern bool carBrake;

extern bool phoneConnected;
extern unsigned long lastMessageTime;

void bleSetup();
bool isPhoneConnected();
void processBlePacket(const uint8_t* data, size_t length);