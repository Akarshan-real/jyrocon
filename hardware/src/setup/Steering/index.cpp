#include <Arduino.h>
#include <ESP32Servo.h>
#include <config.h>
#include <Steering.h>

// Shared servo object
Servo myServo;

void steeringSetup() {
    // 50Hz standard PWM for SG90 servo
    myServo.setPeriodHertz(50);
    myServo.attach(SERVO_PIN, 500, 2400);

    centerWheels();
    Serial.println("[Servo] Steering initialized on GPIO " + String(SERVO_PIN));
}