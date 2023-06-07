import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { defaultProfilePicture, selectImage } from "../services/ImageUpload";
import { useCurrentUser } from "../context/currentUserContext";
import { useAuthenticatedUser } from "../context/authenticatedUserContext";

function EditProfileScreen<StackScreenProps>() {
  const { pressedUser, setPressedUser } = useCurrentUser();
  const { authenticatedUser } = useAuthenticatedUser();

  React.useEffect(() => {
    setPressedUser(authenticatedUser);
  }, [authenticatedUser]);

  const handleFullNameChange = (text: string): void => {
    setPressedUser((prevPressedUser) => ({
      ...prevPressedUser!,
      fullName: text,
    }));
  };

  const handleUsernameChange = (text: string): void => {
    setPressedUser((prevPressedUser) => ({
      ...prevPressedUser!,
      username: text,
    }));
  };

  const handleEmailChange = (text: string): void => {
    setPressedUser((prevPressedUser) => ({
      ...prevPressedUser!,
      email: text,
    }));
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
            uri: pressedUser?.profilePicturePath || defaultProfilePicture,
          }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: "#dfe0e3",
          }}
        ></Image>
        <TouchableOpacity
          onPress={() => selectImage(pressedUser!!)}
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
      <View style={{ marginVertical: 10 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginVertical: 15,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "300" }}>Name</Text>
          <TextInput
            placeholder={pressedUser?.fullName || "Name"}
            maxLength={25}
            style={{
              width: "75%",
              padding: 10,
              borderBottomWidth: 2,
              borderBottomColor: "#dfe0e3",
            }}
            value={pressedUser?.fullName}
            onChangeText={handleFullNameChange}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginVertical: 15,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "300" }}>Username</Text>
          <TextInput
            placeholder={pressedUser?.username || "Username"}
            maxLength={25}
            style={{
              width: "75%",
              padding: 10,
              borderBottomWidth: 2,
              borderBottomColor: "#dfe0e3",
            }}
            value={pressedUser?.username}
            onChangeText={handleUsernameChange}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginVertical: 15,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "300" }}>Email</Text>
          <TextInput
            placeholder={pressedUser?.email || "Email"}
            maxLength={150}
            style={{
              width: "75%",
              padding: 10,
              borderBottomWidth: 2,
              borderBottomColor: "#dfe0e3",
            }}
            value={pressedUser?.email}
            onChangeText={handleEmailChange}
          />
        </View>
      </View>
    </ScrollView>
  );
}

export default EditProfileScreen;
