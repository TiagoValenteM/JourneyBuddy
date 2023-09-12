import React from "react";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

interface DynamicHeaderProps {
  scrollY: Animated.Value<number>;
}
const DynamicHeader = ({ scrollY }: DynamicHeaderProps) => {
  const backgroundColor = Animated.interpolateColors(scrollY, {
    inputRange: [0, 100],
    outputColorRange: ["rgba(255, 255, 255, 0)", "rgba(242,243,243,1)"],
  });

  return (
    <Animated.View
      style={
        {
          backgroundColor: backgroundColor,
          ...headerStyles.header,
        } as any
      }
    />
  );
};

const headerStyles = StyleSheet.create({
  header: {
    position: "absolute",
    zIndex: 1,
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "flex-end",
  },
});

export default DynamicHeader;
