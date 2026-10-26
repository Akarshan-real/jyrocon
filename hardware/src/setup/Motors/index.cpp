#include <Arduino.h>
#include <config.h>
#include <Motors.h>

void motorsSetup() {
    pinMode(LEFT_MOTOR_FORWARD_PIN, OUTPUT);
    pinMode(LEFT_MOTOR_BACKWARD_PIN, OUTPUT);
    pinMode(RIGHT_MOTOR_FORWARD_PIN, OUTPUT);
    pinMode(RIGHT_MOTOR_BACKWARD_PIN, OUTPUT);

    ledcAttach(LEFT_MOTOR_SPEED_PIN, 5000, 8);
    ledcAttach(RIGHT_MOTOR_SPEED_PIN, 5000, 8);

    stopMotors();
    Serial.println("[Motors] L298N motors initialized and stopped");
}
