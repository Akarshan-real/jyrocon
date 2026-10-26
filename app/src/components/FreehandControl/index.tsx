import React from 'react';
import { StyleSheet, View } from 'react-native';
import CalibrateButton from '../CalibrateButton';
import BrakeButton from '../BrakeButton';

const FreehandControl: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonWrapper}>
        <CalibrateButton />
      </View>
      <View style={styles.buttonWrapper}>
        <BrakeButton stretched />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingVertical: 12,
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
  },
});

export default FreehandControl;
