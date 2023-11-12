import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Animated } from "react-native";
import { ArrowLeft, Menu } from "react-native-feather";
import Colors from "../../../styles/colorScheme";

interface DynamicHeaderProps {
  scrollY: Animated.ValueXY;
  navigation: any;
  authUserId: string;
  guideAuthId: string;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  screenWidth: number;
}
const DynamicHeader = ({
  scrollY,
  navigation,
  authUserId,
  guideAuthId,
  setModalVisible,
  screenWidth,
}: DynamicHeaderProps) => {
  return (
    <Animated.View
      style={{
        ...headerStyles.header,
        backgroundColor: scrollY.y.interpolate({
          inputRange: [100, screenWidth - 50],
          outputRange: ["rgba(255, 255, 255,0)", Colors.white],
          extrapolate: "clamp",
        }),
      }}
    >
      <Animated.View
        style={{
          ...headerStyles.buttonsContainer,
          opacity: scrollY.y.interpolate({
            inputRange: [0, 100],
            outputRange: [1, 0],
            extrapolate: "clamp",
          }),
          top: scrollY.y.interpolate({
            inputRange: [100, 100],
            outputRange: [60, -20],
            extrapolate: "clamp",
          }),
        }}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          style={headerStyles.button}
        >
          <ArrowLeft width={22} height={22} color={Colors.white} />
        </Pressable>
        {authUserId === guideAuthId && (
          <Pressable
            onPress={() => setModalVisible(true)}
            style={headerStyles.button}
          >
            <Menu width={22} height={22} color={Colors.white} />
          </Pressable>
        )}
      </Animated.View>
    </Animated.View>
  );
};

const headerStyles = StyleSheet.create({
  header: {
    position: "absolute",
    zIndex: 1,
    top: 0,
    width: "100%",
    height: 60,
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: "row",
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
  button: {
    backgroundColor: "rgba(31,31,31,0.8)",
    borderRadius: 50,
    padding: 10,
    elevation: 1,
  },
});

export default DynamicHeader;
