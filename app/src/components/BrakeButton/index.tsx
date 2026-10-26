import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { FONTS } from "../../styles/typography";
import { useCar } from "../../hooks/useCarControl";
import { feedbackBrakePress, feedbackBrakeRelease } from "../../utils/feedback";

interface BrakeButtonProps {
  onPressIn?: () => void;
  onPressOut?: () => void;
  stretched?: boolean;
}

const BrakeButton: React.FC<BrakeButtonProps> = ({
  onPressIn,
  onPressOut,
  stretched = false,
}) => {
  const { setBrake } = useCar();

  const handlePressIn = () => {
    feedbackBrakePress();
    setBrake(true);
    onPressIn?.();
  };

  const handlePressOut = () => {
    feedbackBrakeRelease();
    setBrake(false);
    onPressOut?.();
  };

  return (
    <View style={[styles.shadowContainer, stretched && styles.shadowContainerStretched]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          styles.button,
          stretched && styles.buttonStretched,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.text}>BRAKE</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    backgroundColor: "#1c1917",
    borderRadius: 14,
    paddingBottom: 6,
    alignSelf: "center",
  },
  shadowContainerStretched: {
    width: "100%",
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderWidth: 3,
    borderColor: "#1c1917",
    borderRadius: 14,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonStretched: {
    width: "100%",
    paddingVertical: 18,
  },
  buttonPressed: {
    backgroundColor: "#dc2626",
    transform: [{ translateY: 5 }],
  },
  text: {
    color: "#ffffff",
    fontFamily: FONTS.anta,
    fontSize: 18,
    letterSpacing: 2.5,
  },
});

export default BrakeButton;
