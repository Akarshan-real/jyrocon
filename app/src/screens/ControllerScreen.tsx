import React from 'react';
import { Text, StyleSheet, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LoaderKitProgress } from 'react-native-loader-kit';
import { FONTS } from '../styles/typography';
import ModeButton from '../components/ModeButton';
import ArrowControl from '../components/ArrowControl';
import FreehandControl from '../components/FreehandControl';
import { useCar } from '../hooks/useCarControl';
import { feedbackArrowPress } from '../utils/feedback';

export const ControllerScreen: React.FC = () => {
  const { mode, setMode, drivingState, connectedDevice, disconnect } = useCar();

  const gaugeValue = Math.abs(drivingState.speed) / 100;
  const isReverse = drivingState.speed < 0;
  const isBraking = drivingState.brake;

  const gaugeColor = isBraking ? '#ef4444' : isReverse ? '#f97316' : '#00e5ff';

  const handleDisconnect = () => {
    feedbackArrowPress();
    disconnect();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <View style={styles.connectedBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.connectedText}>
            {connectedDevice?.name || connectedDevice?.localName || 'ESP32-S3'}
          </Text>
        </View>

        <Pressable
          onPress={handleDisconnect}
          style={({ pressed }) => [
            styles.disconnectBtn,
            pressed && styles.disconnectBtnPressed,
          ]}
        >
          <Icon name="bluetooth-off" size={16} color="#ef4444" />
          <Text style={styles.disconnectText}>DISCONNECT</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>Jyrocon</Text>

      <View style={styles.modeWrapper}>
        <ModeButton
          selectedMode={mode}
          onSelectMode={setMode}
        />
      </View>

      <View style={styles.gaugeWrapper}>
        <LoaderKitProgress
          value={gaugeValue}
          type="gauge"
          variant="needle"
          thickness={3}
          size={96}
          color={gaugeColor}
        />
        <Text style={[styles.speedText, { color: gaugeColor }]}>
          {Math.round(Math.abs(drivingState.speed))}
        </Text>
      </View>

      <View style={styles.controlsWrapper}>
        {mode === '1' && <ArrowControl />}
        {mode === '2' && <FreehandControl />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
  },
  headerBar: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.4)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#22c55e',
    marginRight: 6,
  },
  connectedText: {
    color: '#22c55e',
    fontFamily: FONTS.anta,
    fontSize: 12,
    letterSpacing: 1,
  },
  disconnectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
  },
  disconnectBtnPressed: {
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    transform: [{ translateY: 2 }],
  },
  disconnectText: {
    color: '#ef4444',
    fontFamily: FONTS.anta,
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '600',
  },
  title: {
    fontSize: 64,
    color: '#ffffff',
    fontFamily: FONTS.rubikFade,
  },
  modeWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  gaugeWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedText: {
    marginTop: 6,
    fontSize: 22,
    fontFamily: FONTS.wallpoet,
    letterSpacing: 1.5,
  },
  controlsWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});