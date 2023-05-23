import React from "react";
import { Image, Text, View } from "react-native";
import MenuModal from "../components/MenuModal";

function ProfileScreen({
  navigation,
  screenProps,
}: {
  navigation: any;
  screenProps: { modalVisible: boolean; setModalVisible: any };
}) {
  const { modalVisible, setModalVisible } = screenProps;

  return (
    <View>
      <View className={"flex h-full w-full"}>
        <View
          className={
            " h-1/4 w-full flex-row justify-around items-center font-semibold"
          }
        >
          <Image
            source={{ uri: "https://i.imgur.com/9eURkZxl.jpg" }}
            className={"h-28 w-28 rounded-full border-4 border-white"}
          ></Image>
          <View className={"flex justify-center items-center space-y-1"}>
            <Text className={"font-bold"}>9</Text>
            <Text>Guides</Text>
          </View>
          <View className={"flex justify-center items-center space-y-1"}>
            <Text className={"font-bold"}>2</Text>
            <Text>Followers</Text>
          </View>
          <View className={"flex justify-center items-center space-y-1"}>
            <Text className={"font-bold"}>4</Text>
            <Text>Following</Text>
          </View>
        </View>
      </View>
      <MenuModal screenProps={screenProps} />
    </View>
  );
}

export default ProfileScreen;
