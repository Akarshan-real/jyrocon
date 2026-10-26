import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FONTS } from "../../styles/typography";
import { feedbackModeChange } from "../../utils/feedback";

export type ModeType = "1" | "2";

interface ModeToggleProps {
  selectedMode: ModeType;
  onSelectMode: (mode: ModeType) => void;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({
  selectedMode,
  onSelectMode,
}) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const onLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: selectedMode === "1" ? 0 : 1,
      useNativeDriver: true,
      bounciness: 8,
      speed: 12,
    }).start();
  }, [selectedMode, slideAnim]);

  const tabWidth = containerWidth > 0 ? (containerWidth - 8) / 2 : 0;

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, tabWidth],
  });

  return (
    <View style={styles.container} onLayout={onLayout}>
      {}
      {tabWidth > 0 && (
        <Animated.View
          style={[
            styles.sliderPill,
            {
              width: tabWidth,
              transform: [{ translateX }],
            },
          ]}
        />
      )}

      {}
      <Pressable style={styles.tab} onPress={() => { feedbackModeChange(); onSelectMode("1"); }}>
        <Text
          style={[
            styles.bigText,
            selectedMode === "1" ? styles.textActive : styles.textInactive,
          ]}
        >
          Mode 1
        </Text>
        <Text
          style={[
            styles.smallText,
            selectedMode === "1" ? styles.subtextActive : styles.subtextInactive,
          ]}
        >
          Arrow Control
        </Text>
      </Pressable>

      {}
      <Pressable style={styles.tab} onPress={() => { feedbackModeChange(); onSelectMode("2"); }}>
        <Text
          style={[
            styles.bigText,
            selectedMode === "2" ? styles.textActive : styles.textInactive,
          ]}
        >
          Mode 2
        </Text>
        <Text
          style={[
            styles.smallText,
            selectedMode === "2" ? styles.subtextActive : styles.subtextInactive,
          ]}
        >
          Freehand Tilt
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flexDirection: "row",
    width: "90%",
    height: 74,
    borderRadius: 28,
    backgroundColor: "rgba(14, 12, 10, 0.85)",
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1.5,
    padding: 4,
    alignItems: "center",
  },
  sliderPill: {
    position: "absolute",
    left: 4,
    top: 4,
    bottom: 4,
    borderRadius: 24,
    backgroundColor: "rgba(0, 229, 255, 0.15)",
    borderColor: "#00e5ff",
    borderWidth: 1.5,
  },
  tab: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  bigText: {
    fontSize: 16,
    fontFamily: FONTS.anta,
    letterSpacing: 1.5,
  },
  smallText: {
    fontSize: 11,
    fontFamily: FONTS.anta,
    marginTop: 3,
  },
  textActive: {
    color: "#00e5ff",
  },
  textInactive: {
    color: "#777777",
  },
  subtextActive: {
    color: "#b2f5ea",
  },
  subtextInactive: {
    color: "#555555",
  },
});

export default ModeToggle;