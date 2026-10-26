import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Device } from 'react-native-ble-plx';
import { FONTS } from '../styles/typography';
import { useCar } from '../hooks/useCarControl';
import { feedbackArrowPress, feedbackModeChange } from '../utils/feedback';

export const SearchingBLE: React.FC = () => {
  const {
    scannedDevices,
    startScan,
    stopScan,
    connectToDevice,
    connectionStatus,
    statusMessage,
  } = useCar();

  const [connectingId, setConnectingId] = useState<string | null>(null);

  useEffect(() => {
    startScan();
    return () => {
      stopScan();
    };
  }, []);

  const handleDevicePress = async (device: Device) => {
    feedbackArrowPress();
    setConnectingId(device.id);
    const success = await connectToDevice(device);
    if (!success) {
      setConnectingId(null);
    } else {
      feedbackModeChange();
    }
  };

  const getRssiIcon = (rssi?: number | null) => {
    if (rssi == null) return 'wifi';
    if (rssi > -60) return 'wifi-strength-4';
    if (rssi > -70) return 'wifi-strength-3';
    if (rssi > -80) return 'wifi-strength-2';
    return 'wifi-strength-1';
  };

  const renderDeviceItem = ({ item }: { item: Device }) => {
    const isESP = item.name === 'ESP32-S3' || item.localName === 'ESP32-S3';
    const isConnecting = connectingId === item.id;

    return (
      <View style={[styles.cardShadow, isESP && styles.cardShadowHighlighted]}>
        <Pressable
          onPress={() => handleDevicePress(item)}
          disabled={isConnecting || connectionStatus === 'connecting'}
          style={({ pressed }) => [
            styles.deviceCard,
            isESP && styles.deviceCardHighlighted,
            pressed && styles.deviceCardPressed,
          ]}
        >
          <View style={styles.deviceInfo}>
            <View style={styles.nameRow}>
              <Icon
                name={isESP ? 'car-sports' : 'bluetooth'}
                size={22}
                color={isESP ? '#00e5ff' : '#94a3b8'}
                style={styles.deviceIcon}
              />
              <Text style={[styles.deviceName, isESP && styles.deviceNameHighlighted]}>
                {item.name || item.localName || 'Unknown Device'}
              </Text>
              {isESP && (
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedText}>JYROCON</Text>
                </View>
              )}
            </View>
            <Text style={styles.deviceMac}>{item.id}</Text>
          </View>

          <View style={styles.signalWrapper}>
            {isConnecting ? (
              <ActivityIndicator size="small" color="#00e5ff" />
            ) : (
              <>
                <Icon
                  name={getRssiIcon(item.rssi)}
                  size={20}
                  color={item.rssi && item.rssi > -70 ? '#22c55e' : '#94a3b8'}
                />
                <Text style={styles.rssiText}>
                  {item.rssi != null ? `${item.rssi} dBm` : '--'}
                </Text>
              </>
            )}
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Jyrocon</Text>
      <Text style={styles.subtitle}>DEVICE LIST</Text>

      {}
      <View style={styles.statusBox}>
        <View style={styles.statusIndicator}>
          {connectionStatus === 'scanning' ? (
            <ActivityIndicator size="small" color="#00e5ff" style={styles.spinner} />
          ) : (
            <Icon name="radar" size={20} color="#00e5ff" style={styles.spinner} />
          )}
          <Text style={styles.statusText}>{statusMessage}</Text>
        </View>

        <Pressable
          onPress={() => {
            feedbackArrowPress();
            if (connectionStatus === 'scanning') {
              stopScan();
            } else {
              startScan();
            }
          }}
          style={({ pressed }) => [
            styles.scanButton,
            pressed && styles.scanButtonPressed,
          ]}
        >
          <Icon
            name={connectionStatus === 'scanning' ? 'stop' : 'refresh'}
            size={18}
            color="#00e5ff"
          />
          <Text style={styles.scanButtonText}>
            {connectionStatus === 'scanning' ? 'STOP' : 'RESCAN'}
          </Text>
        </Pressable>
      </View>

      {}
      <FlatList
        data={scannedDevices}
        keyExtractor={(item) => item.id}
        renderItem={renderDeviceItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="radar" size={56} color="rgba(0, 229, 255, 0.25)" />
            <Text style={styles.emptyText}>
              {connectionStatus === 'scanning'
                ? 'Scanning for nearby device...'
                : 'No devices found. Tap RESCAN.'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 30,
  },
  title: {
    fontSize: 54,
    color: '#ffffff',
    fontFamily: FONTS.rubikFade,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(0, 229, 255, 0.8)',
    fontFamily: FONTS.anta,
    letterSpacing: 3,
    marginTop: 20,
    marginBottom: 24,
  },
  statusBox: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(14, 12, 10, 0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 24,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  spinner: {
    marginRight: 10,
  },
  statusText: {
    color: '#e2e8f0',
    fontFamily: FONTS.anta,
    fontSize: 13,
    flexShrink: 1,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 229, 255, 0.12)',
    borderWidth: 1,
    borderColor: '#00e5ff',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 6,
  },
  scanButtonPressed: {
    backgroundColor: 'rgba(0, 229, 255, 0.25)',
    transform: [{ translateY: 2 }],
  },
  scanButtonText: {
    color: '#00e5ff',
    fontFamily: FONTS.anta,
    fontSize: 12,
    letterSpacing: 1,
    fontWeight: '600',
  },
  listContent: {
    width: '100%',
    paddingBottom: 24,
    flexGrow: 1,
  },
  cardShadow: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#0e0c0a',
    borderRadius: 14,
    paddingBottom: 4,
    marginBottom: 12,
  },
  cardShadowHighlighted: {
    backgroundColor: 'rgba(0, 229, 255, 0.3)',
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(20, 18, 16, 0.95)',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  deviceCardHighlighted: {
    borderColor: '#00e5ff',
    backgroundColor: 'rgba(0, 229, 255, 0.08)',
  },
  deviceCardPressed: {
    transform: [{ translateY: 3 }],
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
  },
  deviceInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  deviceIcon: {
    marginRight: 8,
  },
  deviceName: {
    color: '#ffffff',
    fontFamily: FONTS.anta,
    fontSize: 16,
    letterSpacing: 1,
  },
  deviceNameHighlighted: {
    color: '#00e5ff',
    fontWeight: 'bold',
  },
  recommendedBadge: {
    marginLeft: 10,
    backgroundColor: 'rgba(0, 229, 255, 0.2)',
    borderWidth: 1,
    borderColor: '#00e5ff',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  recommendedText: {
    color: '#00e5ff',
    fontSize: 9,
    fontFamily: FONTS.anta,
    letterSpacing: 1,
  },
  deviceMac: {
    color: '#64748b',
    fontSize: 11,
    fontFamily: 'monospace',
    marginLeft: 30,
  },
  signalWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
  },
  rssiText: {
    color: '#94a3b8',
    fontSize: 10,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  emptyText: {
    color: '#64748b',
    fontFamily: FONTS.anta,
    fontSize: 14,
    marginTop: 16,
  },
});

export default SearchingBLE;
