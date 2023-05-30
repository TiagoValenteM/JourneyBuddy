import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { defaultProfilePicture, selectImage } from "../services/ImageUpload";

function EditProfileScreen<StackScreenProps>({
  currentUser,
}: {
  currentUser?: UserProfile;
}) {
  const [fullName, setFullName] = React.useState(currentUser?.fullName || "");
  const [username, setUsername] = React.useState(currentUser?.username || "");
  const [email, setEmail] = React.useState(currentUser?.email || "");

  const handleUpdateProfile = async () => {
    const userProfilesCollectionRef = collection(db, "user_profiles");
    const queryFindCurrentUser = query(
      userProfilesCollectionRef,
      where("uid", "==", currentUser?.uid)
    );

    const querySnapshotUser = await getDocs(queryFindCurrentUser);

    if (!querySnapshotUser.empty) {
      const userRef = doc(db, "user_profiles", querySnapshotUser.docs[0].id);

      try {
        await updateDoc(userRef, {
          fullName: fullName || currentUser?.fullName || "",
          username: username || currentUser?.username || "",
          email: email || currentUser?.email || "",
        });
        console.log("Profile updated successfully!");
      } catch (error) {
        console.log("Error updating profile:", error);
      }
    } else {
      console.log("No matching user profile found");
    }
  };

  return (
    <ScrollView className="w-screen h-screen">
      <View className="w-full h-[170px]  flex justify-center items-center space-y-6 border-b border-b-gray-300">
        <Image
          source={{
            uri: currentUser?.profilePicturePath || defaultProfilePicture,
          }}
          className={"h-24 w-24 rounded-full"}
        ></Image>
        <TouchableOpacity
          onPress={() => selectImage(currentUser!!)}
          className={
            "bg-gray-300 h-7 justify-center text-sm w-[40%] rounded-lg"
          }
        >
          <Text className={"text-center font-semibold"}>Edit Picture</Text>
        </TouchableOpacity>
      </View>
      <View className="h-3/4 flex flex-col justify-start mt-5 items-center space-y-6">
        <View
          className={
            "flex flex-row justify-between px-4 items-center space-x-1 w-full"
          }
        >
          <Text className={"text-black font-light text-sm"}>Name</Text>
          <TextInput
            placeholder={currentUser?.fullName || "Name"}
            style={{
              width: "75%",
              padding: 10,
            }}
            className={"border-b border-b-gray-300"}
            value={fullName}
            onChangeText={(text) => setFullName(text)}
          />
        </View>
        <View
          className={
            "flex flex-row justify-between px-4 items-center space-x-1 w-full"
          }
        >
          <Text className={"text-black font-light text-sm"}>Username</Text>
          <TextInput
            placeholder={currentUser?.username || "Username"}
            style={{
              width: "75%",
              padding: 10,
            }}
            className={"border-b border-b-gray-300"}
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
        </View>
        <View
          className={
            "flex flex-row justify-between px-4 items-center space-x-1 w-full"
          }
        >
          <Text className={"text-black font-light text-sm"}>Email</Text>
          <TextInput
            placeholder={currentUser?.email || "Email"}
            style={{
              width: "75%",
              padding: 10,
            }}
            className={"border-b border-b-gray-300"}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <TouchableOpacity
          onPress={handleUpdateProfile}
          className={
            "bg-gray-300 h-7 justify-center text-sm w-[40%] rounded-lg"
          }
        >
          <Text className={"text-center font-semibold"}>Update Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default EditProfileScreen;
