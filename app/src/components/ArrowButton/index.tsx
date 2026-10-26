import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { feedbackArrowPress } from '../../utils/feedback';

type DirectionType = 'top' | 'left' | 'bottom' | 'right';

interface ArrowButtonProps {
  direction: DirectionType;
  onPressIn?: () => void;
  onPressOut?: () => void;
  size?: number;
  color?: string;
  stretched?: boolean;
  tall?: boolean;
}

const ICON_MAP: Record<DirectionType, string> = {
  top: 'chevron-up',
  left: 'chevron-left',
  bottom: 'chevron-down',
  right: 'chevron-right',
};

const ArrowButton: React.FC<ArrowButtonProps> = ({
  direction,
  onPressIn,
  onPressOut,
  size = 40,
  color = '#00e5ff',
  stretched = false,
  tall = false,
}) => {
  const handlePressIn = () => {
    feedbackArrowPress();
    onPressIn?.();
  };

  return (
    <View style={[styles.shadowBase, stretched && styles.shadowBaseStretched]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={onPressOut}
        style={({ pressed }) => [
          styles.button,
          stretched && styles.buttonStretched,
          tall && styles.buttonTall,
          pressed && styles.buttonPressed,
        ]}
      >
        <Icon name={ICON_MAP[direction]} size={size} color={color} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowBase: {
    borderRadius: 9,
    backgroundColor: '#0e0c0a',
    paddingBottom: 5,
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  button: {
    paddingVertical: 13,
    paddingHorizontal: 26,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#1a1d22',
    backgroundColor: '#0e0c0a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    transform: [{ translateY: 4 }],
    backgroundColor: '#070507',
  },
  
  shadowBaseStretched: {
    alignSelf: 'stretch',
  },
  buttonStretched: {
    alignSelf: 'stretch',
  },
  
  buttonTall: {
    paddingVertical: 26,
  },
});

export default ArrowButton;
