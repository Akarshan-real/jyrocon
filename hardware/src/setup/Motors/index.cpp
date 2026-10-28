#include <Arduino.h>
#include <config.h>
#include <Motors.h>

void motorsSetup() {
    pinMode(LEFT_MOTOR_FORWARD_PIN, OUTPUT);
    pinMode(LEFT_MOTOR_BACKWARD_PIN, OUTPUT);
    pinMode(RIGHT_MOTOR_FORWARD_PIN, OUTPUT);
    pinMode(RIGHT_MOTOR_BACKWARD_PIN, OUTPUT);

    ledcSetup(LEFT_MOTOR_PWM_CHANNEL, 5000, 8);
    ledcAttachPin(LEFT_MOTOR_SPEED_PIN, LEFT_MOTOR_PWM_CHANNEL);
    ledcSetup(RIGHT_MOTOR_PWM_CHANNEL, 5000, 8);
    ledcAttachPin(RIGHT_MOTOR_SPEED_PIN, RIGHT_MOTOR_PWM_CHANNEL);

    stopMotors();
    Serial.println("[Motors] L298N motors initialized and stopped");
}
