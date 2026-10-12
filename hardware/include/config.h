#pragma once

// ==========================================
// Bluetooth Configuration
// ==========================================
#define DEVICE_NAME         "ESP32-S3"
#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

// Safety timeout: stop car if no data received for 200 milliseconds
#define SAFETY_TIMEOUT_MS   200

// ==========================================
// Front Steering Servo (SG90)
// ==========================================
#define SERVO_PIN           4
#define SERVO_CENTER        90   // Straight ahead
#define SERVO_MAX_LEFT      45   // Turn left limit
#define SERVO_MAX_RIGHT     135  // Turn right limit

// ==========================================
// L298N Motor Driver Pins (2x N20 Rear Motors)
// ==========================================
// Rear-Left Motor
#define LEFT_MOTOR_SPEED_PIN    5   // ENA (Speed: PWM)
#define LEFT_MOTOR_FORWARD_PIN  6   // IN1: HIGH = Drive Forward
#define LEFT_MOTOR_BACKWARD_PIN 7   // IN2: HIGH = Drive Reverse

// Rear-Right Motor
#define RIGHT_MOTOR_SPEED_PIN    8  // ENB (Speed: PWM)
#define RIGHT_MOTOR_FORWARD_PIN  9  // IN3: HIGH = Drive Forward
#define RIGHT_MOTOR_BACKWARD_PIN 10 // IN4: HIGH = Drive Reverse

// ==========================================
// Car Lights (LEDs)
// ==========================================
// 2x White Front LEDs (Headlights, always ON)
#define FRONT_LEDS_PIN           11

// 2x Red Rear LEDs (Reverse Lights, ON only in reverse)
#define REAR_LEDS_PIN            12

// ==========================================
// Adafruit NeoPixel RGB Status LED
// (ESP32-S3 DevKit onboard RGB is usually GPIO 48 or 38)
// ==========================================
#define RGB_LED_PIN              48   // GPIO for WS2812 / NeoPixel
#define RGB_LED_COUNT            1    // 1 onboard status LED
#define RGB_BRIGHTNESS           50   // 0 to 255 (moderate brightness)