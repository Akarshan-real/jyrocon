#include <Arduino.h>
#include <ESP32Servo.h>
#include <config.h>
#include <Steering.h>

extern Servo myServo;

// -----------------------------------------------------------------------------
// turnWheels: Steers the front axle with SG90 servo
// Expected Input Range:
//   turnAmount: -100 (Full Left) to +100 (Full Right), 0 = Center
// -----------------------------------------------------------------------------
void turnWheels(int turnAmount) {
    // Range guard: make sure turnAmount is strictly between -100 and +100
    if (turnAmount < -100) {
        turnAmount = -100; // Cap at full left
    } else if (turnAmount > 100) {
        turnAmount = 100;  // Cap at full right
    } else {
        // Within valid range (-100 to +100)
    }

    // Map -100..+100 to angle limits (45 deg to 135 deg)
    int targetAngle = map(turnAmount, -100, 100, SERVO_MAX_LEFT, SERVO_MAX_RIGHT);

    // Safety check so servo never goes past physical limits
    targetAngle = constrain(targetAngle, SERVO_MAX_LEFT, SERVO_MAX_RIGHT);

    myServo.write(targetAngle);
}


void centerWheels() {
    myServo.write(SERVO_CENTER);
}
