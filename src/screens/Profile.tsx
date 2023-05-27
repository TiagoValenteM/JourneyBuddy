import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import MenuModal from "../components/MenuModal";
import { auth } from "../config/firebase";
import { defaultProfilePicture } from "../services/ImageUpload";
function ProfileScreen({
  navigation,
  screenProps,
  currentUser,
}: {
  navigation: any;
  screenProps: { modalVisible: boolean; setModalVisible: any };
  currentUser?: UserProfile;
}) {
  return currentUser ? (
    <View>
      <View className={"flex h-full w-full"}>
        <View
          className={
            " h-1/4 w-full flex-row justify-around items-center font-semibold"
          }
        >
          <Image
            source={{
              uri: currentUser?.profilePicturePath || defaultProfilePicture,
            }}
            className={"h-28 w-28 rounded-full aspect-square"}
          ></Image>
          <View className={"flex justify-center items-center space-y-1"}>
            <Text className={"font-bold"}>
              {currentUser?.guides?.length || "0"}
            </Text>
            <Text>Guides</Text>
          </View>
          <Pressable
            className={"flex justify-center items-center space-y-1"}
            onPress={() => {
              navigation.navigate("Followers");
            }}
          >
            <Text className={"font-bold"}>
              {currentUser?.followers?.length || "0"}
            </Text>
            <Text>Followers</Text>
          </Pressable>
          <Pressable
            className={"flex justify-center items-center space-y-1"}
            onPress={() => {
              navigation.navigate("Following");
            }}
          >
            <Text className={"font-bold"}>
              {currentUser?.following?.length || "0"}{" "}
            </Text>
            <Text>Following</Text>
          </Pressable>
        </View>
        <View className={"h-16 border-b border-b-gray-300 space-y-3"}>
          <Text className={"font-semibold ml-5"}>
            {currentUser.fullName || currentUser.email}
          </Text>
          <View className={"flex flex-row justify-center items-center w-full"}>
            {currentUser.uid === auth.currentUser?.uid ? (
              <Pressable
                className={
                  "bg-gray-300 h-7 justify-center text-sm w-[90%] rounded-lg focus:bg-amber-600"
                }
                onPress={() => {
                  navigation.navigate("Edit Profile");
                }}
              >
                <Text className={"text-center font-semibold"}>
                  Edit Profile
                </Text>
              </Pressable>
            ) : (
              <>
                <Pressable
                  className={
                    "bg-gray-300 h-7 justify-center text-sm w-[90%] rounded-lg"
                  }
                >
                  <Text className={"text-center font-semibold"}>Follow</Text>
                </Pressable>
                <Pressable
                  className={
                    "bg-gray-300 h-7 justify-center text-sm w-[90%] rounded-lg"
                  }
                >
                  <Text className={"text-center font-semibold"}>Unfollow</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </View>
      <MenuModal screenProps={screenProps} />
    </View>
  ) : (
    <View />
  );
}

export default ProfileScreen;
