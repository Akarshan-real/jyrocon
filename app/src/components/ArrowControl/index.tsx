import React from 'react';
import { StyleSheet, View } from 'react-native';
import ArrowButton from '../ArrowButton';
import BrakeButton from '../BrakeButton';
import { useCar } from '../../hooks/useCarControl';

const ArrowControl: React.FC = () => {
  const { setThrottle, setSteering } = useCar();

  return (
    <View style={styles.container}>
      {}
      <View style={styles.row}>
        <ArrowButton
          direction="top"
          stretched
          onPressIn={() => setThrottle(100)}
          onPressOut={() => setThrottle(0)}
        />
      </View>

      {}
      <View style={styles.middleRow}>
        <ArrowButton
          direction="left"
          tall
          onPressIn={() => setSteering(-100)}
          onPressOut={() => setSteering(0)}
        />
        <View style={styles.centerSlot}>
          <BrakeButton />
        </View>
        <ArrowButton
          direction="right"
          tall
          onPressIn={() => setSteering(100)}
          onPressOut={() => setSteering(0)}
        />
      </View>

      {}
      <View style={styles.row}>
        <ArrowButton
          direction="bottom"
          stretched
          onPressIn={() => setThrottle(-100)}
          onPressOut={() => setThrottle(0)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  row: {
    width: '100%',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  middleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  centerSlot: {
    marginHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ArrowControl;
