#include <Arduino.h>
#include <NimBLEDevice.h>
#include <config.h>
#include <BLE.h>

// Shared state variables
int carMode  = MODE_BUTTON;
int carSpeed = 0;
int carTurn  = 0;

bool phoneConnected = false;
unsigned long lastMessageTime = 0;

// When phone connects or disconnects
class MyServerCallbacks : public NimBLEServerCallbacks {
    void onConnect(NimBLEServer* pServer, NimBLEConnInfo& connInfo) override {
        phoneConnected = true;
        Serial.println("[BLE] Phone connected!");
        
        // Ask phone for fastest speed (7.5ms to 15ms connection interval)
        pServer->updateConnParams(connInfo.getConnHandle(), 6, 12, 0, 200);
    }

    void onDisconnect(NimBLEServer* pServer, NimBLEConnInfo& connInfo, int reason) override {
        phoneConnected = false;
        carSpeed = 0;
        carTurn = 0;
        Serial.println("[BLE] Phone disconnected, waiting for reconnection...");
        NimBLEDevice::startAdvertising();
    }
};

// When phone writes new 3-byte command
class MyDataCallbacks : public NimBLECharacteristicCallbacks {
    void onWrite(NimBLECharacteristic* pCharacteristic, NimBLEConnInfo& connInfo) override {
        std::string rawData = pCharacteristic->getValue();

        // Process incoming packet with range guards in utils
        processBlePacket(rawData);
    }
};

static MyServerCallbacks serverCallbacks;
static MyDataCallbacks dataCallbacks;

void bleSetup() {
    NimBLEDevice::init(DEVICE_NAME);

    NimBLEServer* pServer = NimBLEDevice::createServer();
    pServer->setCallbacks(&serverCallbacks);

    NimBLEService* pService = pServer->createService(SERVICE_UUID);

    NimBLECharacteristic* pChar = pService->createCharacteristic(
        CHARACTERISTIC_UUID,
        NIMBLE_PROPERTY::READ |
        NIMBLE_PROPERTY::WRITE |
        NIMBLE_PROPERTY::WRITE_NR
    );
    pChar->setCallbacks(&dataCallbacks);

    pService->start();

    NimBLEAdvertising* pAdvertising = NimBLEDevice::getAdvertising();
    pAdvertising->addServiceUUID(SERVICE_UUID);
    pAdvertising->start();

    Serial.println("[BLE] Ready and waiting for phone!");
}
