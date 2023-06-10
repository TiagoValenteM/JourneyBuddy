import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useCurrentUser } from "../../context/currentUserContext";
import { useAuthenticatedUser } from "../../context/authenticatedUserContext";
import { followUser, unfollowUser } from "../../database/userRepository";
import CachedImage from "../images/CachedImage";

interface ProfileIdentifierProps {
  navigation: any;
  isAuthUser: boolean;
}
const ProfileIdentifier: React.FC<ProfileIdentifierProps> = ({
  navigation,
  isAuthUser,
}) => {
  const { currentUser, setCurrentUser } = useCurrentUser();
  const { authenticatedUser, setAuthenticatedUser } = useAuthenticatedUser();

  const handleFollow = async () => {
    try {
      await followUser(
        currentUser?.uid,
        authenticatedUser!,
        currentUser!,
        setAuthenticatedUser,
        setCurrentUser
      );
    } catch (error) {
      console.error("Error handling follow:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowUser(
        currentUser?.uid,
        authenticatedUser!,
        currentUser!,
        setAuthenticatedUser,
        setCurrentUser
      );
    } catch (error) {
      console.error("Error handling follow:", error);
    }
  };

  return isAuthUser ? (
    <View style={identifierStyles.container}>
      <View style={identifierStyles.photoDetailsContainer}>
        <CachedImage
          source={{
            uri: authenticatedUser!.profilePicturePath,
          }}
          style={identifierStyles.profilePicture}
        ></CachedImage>
        <View style={identifierStyles.indicatorContainer}>
          <Text style={identifierStyles.indicatorNumber}>
            {authenticatedUser?.guides?.length || "0"}
          </Text>
          <Text style={identifierStyles.indicatorCategory}>Guides</Text>
        </View>
        <Pressable
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            setCurrentUser(authenticatedUser);
            navigation.navigate("FollowInteraction", { screen: "Followers" });
          }}
        >
          <Text style={identifierStyles.indicatorNumber}>
            {authenticatedUser?.followers?.length || "0"}
          </Text>
          <Text style={identifierStyles.indicatorCategory}>Followers</Text>
        </Pressable>
        <Pressable
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            setCurrentUser(authenticatedUser);
            navigation.navigate("FollowInteraction", { screen: "Following" });
          }}
        >
          <Text style={identifierStyles.indicatorNumber}>
            {authenticatedUser?.following?.length || "0"}{" "}
          </Text>
          <Text style={identifierStyles.indicatorCategory}>Following</Text>
        </Pressable>
      </View>
      <View style={identifierStyles.nameActionContainer}>
        <Text style={identifierStyles.username}>
          {authenticatedUser?.fullName}
        </Text>
        <Pressable
          style={[identifierStyles.button, { backgroundColor: "#dfe0e3" }]}
          onPress={() => {
            navigation.navigate("Edit Profile");
          }}
        >
          <Text style={identifierStyles.buttonText}>Edit Profile</Text>
        </Pressable>
      </View>
    </View>
  ) : (
    <View style={identifierStyles.container}>
      <View style={identifierStyles.photoDetailsContainer}>
        <CachedImage
          source={{
            uri: currentUser!.profilePicturePath,
          }}
          style={identifierStyles.profilePicture}
        ></CachedImage>
        <View style={identifierStyles.indicatorContainer}>
          <Text style={identifierStyles.indicatorNumber}>
            {currentUser?.guides?.length || "0"}
          </Text>
          <Text style={identifierStyles.indicatorCategory}>Guides</Text>
        </View>
        <Pressable
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            navigation.navigate("FollowInteraction", { screen: "Followers" });
          }}
        >
          <Text style={identifierStyles.indicatorNumber}>
            {currentUser?.followers?.length || "0"}
          </Text>
          <Text style={identifierStyles.indicatorCategory}>Followers</Text>
        </Pressable>
        <Pressable
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            navigation.navigate("FollowInteraction", { screen: "Following" });
          }}
        >
          <Text style={identifierStyles.indicatorNumber}>
            {currentUser?.following?.length || "0"}{" "}
          </Text>
          <Text style={identifierStyles.indicatorCategory}>Following</Text>
        </Pressable>
      </View>
      {currentUser?.uid === authenticatedUser?.uid ? (
        <View style={identifierStyles.nameActionContainer}>
          <Text style={identifierStyles.username}>{currentUser?.fullName}</Text>
          <Pressable
            style={[identifierStyles.button, { backgroundColor: "#dfe0e3" }]}
            onPress={() => {
              navigation.navigate("Edit Profile");
            }}
          >
            <Text style={identifierStyles.buttonText}>Edit Profile</Text>
          </Pressable>
        </View>
      ) : Array.isArray(authenticatedUser?.following) &&
        authenticatedUser?.following?.includes(currentUser!!.uid) ? (
        <View style={identifierStyles.nameActionContainer}>
          <Text style={identifierStyles.username}>{currentUser?.fullName}</Text>
          <Pressable
            style={[identifierStyles.button, { backgroundColor: "#dfe0e3" }]}
            onPress={handleUnfollow}
          >
            <Text style={identifierStyles.buttonText}>Unfollow</Text>
          </Pressable>
        </View>
      ) : (
        <View style={identifierStyles.nameActionContainer}>
          <Text style={identifierStyles.username}>{currentUser?.fullName}</Text>
          <Pressable
            style={[identifierStyles.button, { backgroundColor: "#007AFF" }]}
            onPress={handleFollow}
          >
            <Text style={[identifierStyles.buttonText, { color: "white" }]}>
              Follow
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default ProfileIdentifier;

const identifierStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  photoDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    borderRadius: 10,
    height: 35,
    width: 100,
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  username: {
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 15,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#dfe0e3",
  },
  indicatorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  indicatorNumber: { fontWeight: "700", fontSize: 16 },
  indicatorCategory: { fontWeight: "400", fontSize: 14 },
  nameActionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginVertical: 15,
  },
});
