import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FONTS } from '../../styles/typography';
import { useCar } from '../../hooks/useCarControl';
import { feedbackModeChange } from '../../utils/feedback';

interface CalibrateButtonProps {
  onCalibrate?: () => void;
}

const CalibrateButton: React.FC<CalibrateButtonProps> = ({ onCalibrate }) => {
  const { calibrateGyro } = useCar();
  const [calibrated, setCalibrated] = useState(false);

  const handlePress = () => {
    feedbackModeChange();
    calibrateGyro();
    onCalibrate?.();

    setCalibrated(true);
    setTimeout(() => {
      setCalibrated(false);
    }, 1200);
  };

  return (
    <View style={styles.shadowBase}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          calibrated && styles.buttonCalibrated,
        ]}
      >
        <Icon
          name={calibrated ? 'check-circle' : 'compass-outline'}
          size={24}
          color={calibrated ? '#22c55e' : '#00e5ff'}
          style={styles.icon}
        />
        <Text style={[styles.text, calibrated && styles.textCalibrated]}>
          {calibrated ? 'CALIBRATED' : 'SET NEUTRAL'}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowBase: {
    borderRadius: 14,
    backgroundColor: '#0e0c0a',
    paddingBottom: 5,
    width: '100%',
    alignSelf: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 229, 255, 0.35)',
    backgroundColor: 'rgba(14, 12, 10, 0.95)',
    boxShadow: '0 4px 12px rgba(0, 229, 255, 0.1)',
  },
  buttonPressed: {
    transform: [{ translateY: 4 }],
    backgroundColor: 'rgba(0, 229, 255, 0.12)',
    borderColor: '#00e5ff',
  },
  buttonCalibrated: {
    borderColor: '#22c55e',
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
  },
  icon: {
    marginRight: 10,
  },
  text: {
    color: '#ffffff',
    fontFamily: FONTS.anta,
    fontSize: 16,
    letterSpacing: 2,
    fontWeight: '600',
  },
  textCalibrated: {
    color: '#22c55e',
  },
});

export default CalibrateButton;
