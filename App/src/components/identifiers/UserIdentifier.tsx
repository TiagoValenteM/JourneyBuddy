import { useAuthenticatedUser } from "../../context/authenticatedUserContext";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { getUserData } from "../../database/userRepository/userRepository";
import CachedImage from "../images/CachedImage";
import Colors from "../../../styles/colorScheme";
import { LinearGradient } from "expo-linear-gradient";
import {
  follow,
  unfollow,
} from "../../database/userRepository/follow/followRepository";
import { useError } from "../../hooks/useError";
import UserProfile from "../../models/userProfiles";

interface UserIdentifierProps {
  username: string;
  userID: string;
  bottomSheetTrigger?: {
    showBottomSheet: () => void;
    hideBottomSheet: () => void;
  };
  navigation: any;
}

const UserIdentifier: React.FC<UserIdentifierProps> = ({
  username,
  userID,
  bottomSheetTrigger,
  navigation,
}) => {
  const [user, setUser] = React.useState<UserProfile>();
  const [userPicture, setUserPicture] = React.useState<string | undefined>("");
  const { authenticatedUser, setAuthenticatedUser } = useAuthenticatedUser();
  const isFollowing = authenticatedUser?.following?.includes(userID);
  const isNotFollowing = !isFollowing;
  const { showError } = useError();

  const navigateToProfile = () => {
    navigation.navigate("Profile", { user: user });
    if (bottomSheetTrigger) {
      bottomSheetTrigger.hideBottomSheet();
    }
  };

  const handleFollow = async () => {
    if (authenticatedUser) {
      follow(authenticatedUser, userID, setAuthenticatedUser, showError)
        .then(() => {
          const updatedUser: UserProfile = {
            ...user,
            followers: [...user!.followers, authenticatedUser?.uid],
          } as UserProfile;
          setUser(updatedUser);
        })
        .catch((error) => {
          console.error("Error handling follow:", error);
        });
    }
  };

  const handleUnfollow = async () => {
    if (authenticatedUser) {
      unfollow(authenticatedUser, userID, setAuthenticatedUser, showError)
        .then(() => {
          const updatedUser: UserProfile = {
            ...user,
            followers: user?.followers.filter(
              (followerID) => followerID !== authenticatedUser?.uid
            ),
          } as UserProfile;
          setUser(updatedUser);
        })
        .catch((error) => {
          console.error("Error handling follow:", error);
        });
    }
  };

  useEffect(() => {
    if (authenticatedUser?.uid === userID) {
      setUserPicture(authenticatedUser?.profilePicturePath);
    }

    getUserData(userID).then((user) => {
      setUser(user);
      setUserPicture(user?.profilePicturePath);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.userPictureContainer}
        onPress={navigateToProfile}
      >
        <LinearGradient
          colors={[Colors.blue, Colors.lightBlue, Colors.lightGray]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.75, y: 1 }}
          style={styles.profilePictureBackground}
        >
          <CachedImage
            source={{
              uri: userPicture!,
            }}
            style={styles.profilePicture}
          />
        </LinearGradient>
        <Text style={styles.username}>{username}</Text>
      </Pressable>
      <View style={styles.followContainer}>
        {isNotFollowing && authenticatedUser?.uid !== userID && (
          <Pressable style={styles.followButton} onPress={handleFollow}>
            <Text style={styles.followButtonText}>Follow</Text>
          </Pressable>
        )}

        {isFollowing && authenticatedUser?.uid !== userID && (
          <Pressable style={styles.followButton} onPress={handleUnfollow}>
            <Text style={styles.followButtonText}>Unfollow</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default UserIdentifier;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userPictureContainer: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "70%",
  },
  followContainer: {
    width: "30%",
    flexDirection: "row",
    justifyContent: "center",
  },
  followButton: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    justifyContent: "center",
    backgroundColor: Colors.blue,
    alignItems: "center",
  },
  followButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  username: {
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 15,
  },
  profilePictureBackground: {
    width: 65,
    height: 65,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});
