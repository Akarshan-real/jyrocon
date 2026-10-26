#pragma once

#define DEVICE_NAME         "ESP32-S3"
#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

#define SAFETY_TIMEOUT_MS   200

#define SERVO_PIN           4
#define SERVO_CENTER        90
#define SERVO_MAX_LEFT      45
#define SERVO_MAX_RIGHT     135

#define LEFT_MOTOR_SPEED_PIN    5
#define LEFT_MOTOR_FORWARD_PIN  6
#define LEFT_MOTOR_BACKWARD_PIN 7

#define RIGHT_MOTOR_SPEED_PIN    8
#define RIGHT_MOTOR_FORWARD_PIN  9
#define RIGHT_MOTOR_BACKWARD_PIN 10

#define FRONT_LEDS_PIN           11

#define REAR_LEDS_PIN            12

#define RGB_LED_PIN              48
#define RGB_LED_COUNT            1
#define RGB_BRIGHTNESS           50