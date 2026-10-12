#include <Arduino.h>
#include <config.h>
#include <Motors.h>

void motorsSetup() {
    // Set direction pins as outputs
    pinMode(LEFT_MOTOR_FORWARD_PIN, OUTPUT);
    pinMode(LEFT_MOTOR_BACKWARD_PIN, OUTPUT);
    pinMode(RIGHT_MOTOR_FORWARD_PIN, OUTPUT);
    pinMode(RIGHT_MOTOR_BACKWARD_PIN, OUTPUT);

    // Standard ESP32 PWM for motor speed pins (5kHz frequency, 8-bit resolution: 0-255)
    ledcAttach(LEFT_MOTOR_SPEED_PIN, 5000, 8);
    ledcAttach(RIGHT_MOTOR_SPEED_PIN, 5000, 8);

    stopMotors();
    Serial.println("[Motors] L298N motors initialized and stopped");
}
