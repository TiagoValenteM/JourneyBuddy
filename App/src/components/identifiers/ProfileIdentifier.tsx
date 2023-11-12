import React from "react";
import { Pressable, Text, View } from "react-native";
import CachedImage from "../images/CachedImage";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "../../../styles/colorScheme";
import UserProfile from "../../models/userProfiles";

interface ProfileIdentifierProps {
  user: UserProfile;
  setFollowBtmSheetVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setDataIDs: React.Dispatch<React.SetStateAction<string[]>>;
  setIsFollowers: React.Dispatch<React.SetStateAction<boolean>>;
}
const ProfileIdentifier: React.FC<ProfileIdentifierProps> = ({
  user,
  setFollowBtmSheetVisible,
  setDataIDs,
  setIsFollowers,
}) => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20,
      }}
    >
      <View style={{ flexDirection: "column", alignItems: "center" }}>
        <LinearGradient
          colors={[Colors.blue, Colors.lightBlue, Colors.lightGray]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.75, y: 1 }}
          style={{
            width: 105,
            height: 105,
            borderRadius: 55,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CachedImage
            source={{
              uri: user?.profilePicturePath,
            }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              borderWidth: 2,
              borderColor: Colors.white,
            }}
          ></CachedImage>
        </LinearGradient>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 15,
            color: Colors.darkGray,
            marginVertical: 10,
          }}
        >
          {user?.fullName}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginVertical: 15,
          }}
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              {user?.guides?.length || "0"}
            </Text>
            <Text
              style={{ fontWeight: "normal", fontSize: 13, color: Colors.gray }}
            >
              Guides
            </Text>
          </View>
          <Pressable
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              setIsFollowers(true);
              setDataIDs(user?.followers);
              setFollowBtmSheetVisible(true);
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              {user?.followers?.length || "0"}
            </Text>
            <Text
              style={{ fontWeight: "normal", fontSize: 13, color: Colors.gray }}
            >
              Followers
            </Text>
          </Pressable>
          <Pressable
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              setIsFollowers(false);
              setDataIDs(user?.following);
              setFollowBtmSheetVisible(true);
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              {user?.following?.length || "0"}{" "}
            </Text>
            <Text
              style={{ fontWeight: "normal", fontSize: 13, color: Colors.gray }}
            >
              Following
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ProfileIdentifier;
