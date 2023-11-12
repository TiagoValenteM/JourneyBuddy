import React from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import Colors from "../../../styles/colorScheme";
import { ArrowLeft, Menu } from "react-native-feather";

interface ProfileHeaderProps {
  title: string;
  setModalVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  options?: boolean;
  backButton?: boolean;
  navigation?: any;
}

const Header = ({
  title,
  setModalVisible,
  options = false,
  backButton,
  navigation,
}: ProfileHeaderProps) => {
  return (
    <View
      style={{
        backgroundColor: Colors.white,
        justifyContent: "space-between",
        paddingHorizontal: 15,
        padding: 10,
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {backButton && navigation && (
          <Pressable
            onPress={() => navigation.goBack()}
            style={{
              marginRight: 10,
            }}
          >
            <ArrowLeft width={26} height={26} color={Colors.blue} />
          </Pressable>
        )}
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: Colors.black,
          }}
        >
          {title}
        </Text>
      </View>

      {options && setModalVisible && (
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Menu width={24} height={24} color={Colors.blue} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;
