#include <Arduino.h>
#include <config.h>
#include <Steering.h>

void turnWheels(int turnAmount) {
    turnAmount = constrain(turnAmount, -100, 100);

    int targetAngle = map(
        turnAmount, 
        -100, 
        100,
        SERVO_MAX_LEFT, 
        SERVO_MAX_RIGHT
    );

    targetAngle = constrain(
        targetAngle, 
        SERVO_MAX_LEFT, 
        SERVO_MAX_RIGHT
    );

    setServoAngle(targetAngle);
} 

void centerWheels() {
    setServoAngle(SERVO_CENTER);
}
