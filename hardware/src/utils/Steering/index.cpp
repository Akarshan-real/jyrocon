#include <Arduino.h>
#include <ESP32Servo.h>
#include <config.h>
#include <Steering.h>

extern Servo myServo;

void turnWheels(int turnAmount) {
    if (turnAmount < -100) {
        turnAmount = -100;
    } else if (turnAmount > 100) {
        turnAmount = 100;
    } else {
    }

    int targetAngle = map(turnAmount, -100, 100, SERVO_MAX_LEFT, SERVO_MAX_RIGHT);

    targetAngle = constrain(targetAngle, SERVO_MAX_LEFT, SERVO_MAX_RIGHT);

    myServo.write(targetAngle);
}

void centerWheels() {
    myServo.write(SERVO_CENTER);
}
