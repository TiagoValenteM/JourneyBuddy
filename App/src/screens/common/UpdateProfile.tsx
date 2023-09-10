import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { handleProfilePictureUpdate } from "../../services/ImageUpload";
import { useCurrentUser } from "../../context/currentUserContext";
import { useAuthenticatedUser } from "../../context/authenticatedUserContext";
import UserProfile from "../../models/userProfiles";
import { useLoading } from "../../hooks/useLoading";
import { useError } from "../../hooks/useError";

function UpdateProfileView<StackScreenProps>() {
  const { pressedUser, setPressedUser } = useCurrentUser();
  const { authenticatedUser, setAuthenticatedUser } = useAuthenticatedUser();
  const { startLoading, stopLoading } = useLoading();
  const { showError } = useError();

  React.useEffect(() => {
    setPressedUser(authenticatedUser);
  }, []);

  const handleFullNameChange = (text: string): void => {
    setPressedUser(
      (prevPressedUser) =>
        ({
          ...prevPressedUser!,
          fullName: text,
        } as UserProfile)
    );
  };

  const handleUsernameChange = (text: string): void => {
    setPressedUser(
      (prevPressedUser) =>
        ({
          ...prevPressedUser,
          username: text,
        } as UserProfile)
    );
  };

  const handleEmailChange = (text: string): void => {
    setPressedUser(
      (prevPressedUser) =>
        ({
          ...prevPressedUser!,
          email: text,
        } as UserProfile)
    );
  };

  return (
    <ScrollView style={{ flex: 1, marginHorizontal: 20 }}>
      <View
        style={{
          marginVertical: 20,
          justifyContent: "space-around",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Image
          source={{
            uri: authenticatedUser!.profilePicturePath,
          }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: "#dfe0e3",
          }}
          resizeMode={"cover"}
        ></Image>
        <TouchableOpacity
          onPress={async () => {
            try {
              startLoading();
              await handleProfilePictureUpdate(
                authenticatedUser!,
                setAuthenticatedUser
              );
            } catch (error) {
              showError("Error updating profile picture. Try again later.");
            } finally {
              stopLoading();
            }
          }}
          style={{
            backgroundColor: "#dfe0e3",
            borderRadius: 10,
            height: 35,
            width: 120,
            justifyContent: "center",
          }}
        >
          <Text
            style={{ fontSize: 14, fontWeight: "600", textAlign: "center" }}
          >
            Edit Picture
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginVertical: 20 }}>
        <Text style={{ fontSize: 14, fontWeight: "500" }}>Name</Text>
        <TextInput
          placeholder={pressedUser?.fullName || "Name"}
          maxLength={25}
          style={{
            padding: 10,
            borderBottomWidth: 2,
            borderBottomColor: "#dfe0e3",
            marginTop: 10,
          }}
          value={pressedUser?.fullName}
          onChangeText={handleFullNameChange}
        />
      </View>
      <View style={{ marginVertical: 20 }}>
        <Text style={{ fontSize: 14, fontWeight: "500" }}>Username</Text>
        <TextInput
          placeholder={pressedUser?.username || "Username"}
          maxLength={25}
          style={{
            padding: 10,
            borderBottomWidth: 2,
            borderBottomColor: "#dfe0e3",
            marginTop: 10,
          }}
          value={pressedUser?.username}
          onChangeText={handleUsernameChange}
        />
      </View>
      <View style={{ marginVertical: 20 }}>
        <Text style={{ fontSize: 14, fontWeight: "500" }}>Email</Text>
        <TextInput
          placeholder={pressedUser?.email || "Email"}
          maxLength={150}
          style={{
            padding: 10,
            borderBottomWidth: 2,
            borderBottomColor: "#dfe0e3",
            marginTop: 10,
          }}
          value={pressedUser?.email}
          onChangeText={handleEmailChange}
        />
      </View>
    </ScrollView>
  );
}

export default UpdateProfileView;
