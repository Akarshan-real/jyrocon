#include <Arduino.h>
#include <ESP32Servo.h>
#include <config.h>
#include <Steering.h>

Servo myServo;

void steeringSetup() {
    myServo.setPeriodHertz(50);
    myServo.attach(SERVO_PIN, 500, 2400);

    centerWheels();
    Serial.println("[Servo] Steering initialized on GPIO " + String(SERVO_PIN));
}