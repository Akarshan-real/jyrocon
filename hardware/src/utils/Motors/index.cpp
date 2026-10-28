#include <Arduino.h>
#include <config.h>
#include <BLE.h>
#include <Motors.h>

void stopMotors() {
    ledcWrite(LEFT_MOTOR_PWM_CHANNEL, 0);
    ledcWrite(RIGHT_MOTOR_PWM_CHANNEL, 0);

    digitalWrite(LEFT_MOTOR_FORWARD_PIN, LOW);
    digitalWrite(LEFT_MOTOR_BACKWARD_PIN, LOW);
    digitalWrite(RIGHT_MOTOR_FORWARD_PIN, LOW);
    digitalWrite(RIGHT_MOTOR_BACKWARD_PIN, LOW);
}

void brakeMotors() {
    ledcWrite(LEFT_MOTOR_PWM_CHANNEL, 255);
    ledcWrite(RIGHT_MOTOR_PWM_CHANNEL, 255);

    digitalWrite(LEFT_MOTOR_FORWARD_PIN, HIGH);
    digitalWrite(LEFT_MOTOR_BACKWARD_PIN, HIGH);
    digitalWrite(RIGHT_MOTOR_FORWARD_PIN, HIGH);
    digitalWrite(RIGHT_MOTOR_BACKWARD_PIN, HIGH);
}

void runMotors(int leftSpeed, int rightSpeed) {
    leftSpeed  = constrain(leftSpeed, -100, 100);
    rightSpeed = constrain(rightSpeed, -100, 100);

    if (leftSpeed > 0) {
        digitalWrite(LEFT_MOTOR_FORWARD_PIN, HIGH);
        digitalWrite(LEFT_MOTOR_BACKWARD_PIN, LOW);

        int leftPwm = map(abs(leftSpeed), 0, 100, 0, 255);
        ledcWrite(LEFT_MOTOR_PWM_CHANNEL, leftPwm);
    } else if (leftSpeed < 0) {
        digitalWrite(LEFT_MOTOR_FORWARD_PIN, LOW);
        digitalWrite(LEFT_MOTOR_BACKWARD_PIN, HIGH);

        int leftPwm = map(abs(leftSpeed), 0, 100, 0, 255);
        ledcWrite(LEFT_MOTOR_PWM_CHANNEL, leftPwm);
    } else {
        digitalWrite(LEFT_MOTOR_FORWARD_PIN, LOW);
        digitalWrite(LEFT_MOTOR_BACKWARD_PIN, LOW);
        ledcWrite(LEFT_MOTOR_PWM_CHANNEL, 0);
    }

    if (rightSpeed > 0) {
        digitalWrite(RIGHT_MOTOR_FORWARD_PIN, HIGH);
        digitalWrite(RIGHT_MOTOR_BACKWARD_PIN, LOW);

        int rightPwm = map(abs(rightSpeed), 0, 100, 0, 255);
        ledcWrite(RIGHT_MOTOR_PWM_CHANNEL, rightPwm);
    } else if (rightSpeed < 0) {
        digitalWrite(RIGHT_MOTOR_FORWARD_PIN, LOW);
        digitalWrite(RIGHT_MOTOR_BACKWARD_PIN, HIGH);
        
        int rightPwm = map(abs(rightSpeed), 0, 100, 0, 255);
        ledcWrite(RIGHT_MOTOR_PWM_CHANNEL, rightPwm);
    } else {
        digitalWrite(RIGHT_MOTOR_FORWARD_PIN, LOW);
        digitalWrite(RIGHT_MOTOR_BACKWARD_PIN, LOW);
        ledcWrite(RIGHT_MOTOR_PWM_CHANNEL, 0);
    }
}

void driveCar(int mode, int speed, int turn, bool brake) {
    if (brake) {
        brakeMotors();
        return;
    }

    if (mode != MODE_GYRO && mode != MODE_BUTTON) {
        mode = MODE_BUTTON;
    }

    speed = constrain(speed, -100, 100);
    turn  = constrain(turn, -100, 100);

    if (mode == MODE_BUTTON && speed == 0 && turn != 0) {
        if (turn < 0) {
            runMotors(-abs(turn), abs(turn));
        } else {
            runMotors(abs(turn), -abs(turn));
        }
        return;
    }

    runMotors(speed, speed);
}

