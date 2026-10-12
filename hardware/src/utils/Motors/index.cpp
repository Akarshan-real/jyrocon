#include <Arduino.h>
#include <config.h>
#include <BLE.h>
#include <Motors.h>

void stopMotors() {
    ledcWrite(LEFT_MOTOR_SPEED_PIN, 0);
    ledcWrite(RIGHT_MOTOR_SPEED_PIN, 0);

    digitalWrite(LEFT_MOTOR_FORWARD_PIN, LOW);
    digitalWrite(LEFT_MOTOR_BACKWARD_PIN, LOW);
    digitalWrite(RIGHT_MOTOR_FORWARD_PIN, LOW);
    digitalWrite(RIGHT_MOTOR_BACKWARD_PIN, LOW);
}

// -----------------------------------------------------------------------------
// runMotors: Direct control of rear motors
// Expected Input Ranges:
//   leftSpeed:  -100 (Full Reverse) to +100 (Full Forward), 0 = Stop
//   rightSpeed: -100 (Full Reverse) to +100 (Full Forward), 0 = Stop
// -----------------------------------------------------------------------------
void runMotors(int leftSpeed, int rightSpeed) {
    // Range guard for leftSpeed: -100 to +100
    if (leftSpeed < -100) {
        leftSpeed = -100;
    } else if (leftSpeed > 100) {
        leftSpeed = 100;
    } else {
        // Within valid range
    }

    // Range guard for rightSpeed: -100 to +100
    if (rightSpeed < -100) {
        rightSpeed = -100;
    } else if (rightSpeed > 100) {
        rightSpeed = 100;
    } else {
        // Within valid range
    }

    // 1. Rear-Left Motor
    if (leftSpeed > 0) {
        // Drive Forward (speed: 1 to 100)
        digitalWrite(LEFT_MOTOR_FORWARD_PIN, HIGH);
        digitalWrite(LEFT_MOTOR_BACKWARD_PIN, LOW);
    } else if (leftSpeed < 0) {
        // Drive Backward (speed: -100 to -1)
        digitalWrite(LEFT_MOTOR_FORWARD_PIN, LOW);
        digitalWrite(LEFT_MOTOR_BACKWARD_PIN, HIGH);
    } else {
        // Stop (speed: 0)
        digitalWrite(LEFT_MOTOR_FORWARD_PIN, LOW);
        digitalWrite(LEFT_MOTOR_BACKWARD_PIN, LOW);
    }
    int leftPwm = map(abs(leftSpeed), 0, 100, 0, 255);
    ledcWrite(LEFT_MOTOR_SPEED_PIN, leftPwm);

    // 2. Rear-Right Motor
    if (rightSpeed > 0) {
        // Drive Forward (speed: 1 to 100)
        digitalWrite(RIGHT_MOTOR_FORWARD_PIN, HIGH);
        digitalWrite(RIGHT_MOTOR_BACKWARD_PIN, LOW);
    } else if (rightSpeed < 0) {
        // Drive Backward (speed: -100 to -1)
        digitalWrite(RIGHT_MOTOR_FORWARD_PIN, LOW);
        digitalWrite(RIGHT_MOTOR_BACKWARD_PIN, HIGH);
    } else {
        // Stop (speed: 0)
        digitalWrite(RIGHT_MOTOR_FORWARD_PIN, LOW);
        digitalWrite(RIGHT_MOTOR_BACKWARD_PIN, LOW);
    }
    int rightPwm = map(abs(rightSpeed), 0, 100, 0, 255);
    ledcWrite(RIGHT_MOTOR_SPEED_PIN, rightPwm);
}

// -----------------------------------------------------------------------------
// driveCar: Smart car driver handling both drive modes
// Expected Input Ranges:
//   mode:  1 (MODE_GYRO) or 2 (MODE_BUTTON)
//   speed: -100 (Full Reverse) to +100 (Full Forward), 0 = Neutral
//   turn:  -100 (Full Left) to +100 (Full Right), 0 = Straight
// -----------------------------------------------------------------------------
void driveCar(int mode, int speed, int turn) {
    // Range guard for mode: must be 1 (MODE_GYRO) or 2 (MODE_BUTTON)
    if (mode != MODE_GYRO && mode != MODE_BUTTON) {
        mode = MODE_BUTTON; // Default fallback
    }

    // Range guard for speed: -100 to +100
    if (speed < -100) {
        speed = -100;
    } else if (speed > 100) {
        speed = 100;
    } else {
        // Valid speed range
    }

    // Range guard for turn: -100 to +100
    if (turn < -100) {
        turn = -100;
    } else if (turn > 100) {
        turn = 100;
    } else {
        // Valid turn range
    }

    // Tank Turn: in Button mode, if NOT driving forward/back (speed == 0) but pressing turn:
    if (mode == MODE_BUTTON && speed == 0 && turn != 0) {
        if (turn < 0) {
            // Spin Left: left wheels reverse, right wheels forward
            runMotors(-abs(turn), abs(turn));
        } else {
            // Spin Right: left wheels forward, right wheels reverse
            runMotors(abs(turn), -abs(turn));
        }
        return;
    }

    // Normal driving (Gyro mode OR button driving with forward/back):
    // Both sides drive at the same speed (steering is done by the servo)
    runMotors(speed, speed);
}

