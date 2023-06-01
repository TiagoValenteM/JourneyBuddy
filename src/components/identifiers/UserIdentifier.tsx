import { useAuthenticatedUser } from "../../context/authenticatedUserContext";
import React, { useEffect } from "react";
import { Image, View, Text, StyleSheet, Pressable } from "react-native";
import { findUserProfilePicture } from "../../services/FindUser";
import { followUser } from "../../database/userRepository";

interface UserIdentifierProps {
  selectedUsername: string;
  selectedUserUid: string;
  homepage: boolean;
  navigation?: any;
}

const UserIdentifier: React.FC<UserIdentifierProps> = ({
  selectedUsername,
  selectedUserUid,
  homepage,
  navigation,
}) => {
  const [username, setUsername] = React.useState("");
  const [profilePicture, setProfilePicture] = React.useState("");
  const { authenticatedUser, setAuthenticatedUser } = useAuthenticatedUser();
  const [fetchingTrigger, setFetchingTrigger] = React.useState(false);
  const isFollowing =
    (Array.isArray(authenticatedUser?.following) &&
      authenticatedUser?.following.includes(selectedUserUid)) ||
    authenticatedUser?.uid === selectedUserUid;

  console.log(selectedUsername, isFollowing);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfilePicture = await findUserProfilePicture(
          selectedUsername
        );
        setUsername(selectedUsername);
        setProfilePicture(userProfilePicture);
      } catch (error) {
        console.error("Error fetching user profile picture:", error);
      }
    };

    if (authenticatedUser?.username !== selectedUsername) {
      fetchData();
    } else {
      setUsername(authenticatedUser?.username);
      setProfilePicture(authenticatedUser?.profilePicturePath);
    }
  }, [authenticatedUser, selectedUsername, fetchingTrigger]);

  const handleFollow = async () => {
    try {
      await followUser(
        selectedUserUid,
        authenticatedUser!!,
        setAuthenticatedUser
      );
      setFetchingTrigger(true);
    } catch (error) {
      console.error("Error handling follow:", error);
    }
  };

  return profilePicture && username ? (
    <View style={identifierStyles.container}>
      <View style={identifierStyles.userPictureContainer}>
        <Image
          style={identifierStyles.profilePicture}
          source={{ uri: profilePicture }}
        />
        {homepage ? (
          <Pressable
            onPress={() => {
              navigation.navigate("Profile");
            }}
          >
            <Text style={identifierStyles.username}>{username}</Text>
          </Pressable>
        ) : (
          <Text style={identifierStyles.username}>{username}</Text>
        )}
      </View>
      {!isFollowing && authenticatedUser?.uid !== selectedUserUid ? (
        <Pressable style={identifierStyles.followButton} onPress={handleFollow}>
          <Text style={identifierStyles.followButtonText}>Follow</Text>
        </Pressable>
      ) : null}
    </View>
  ) : null;
};

export default UserIdentifier;

const identifierStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userPictureContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  followButton: {
    backgroundColor: "#dfe0e3",
    borderRadius: 10,
    height: 35,
    width: 80,
    justifyContent: "center",
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  username: {
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 15,
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#dfe0e3",
  },
});
