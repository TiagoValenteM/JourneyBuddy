import * as ImagePicker from "expo-image-picker";
import "firebase/storage";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../config/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Alert } from "react-native";

const defaultProfilePicture =
  "https://firebasestorage.googleapis.com/v0/b/journeybuddy2023.appspot.com/o/profile_pictures%2Fdefault_profile_picture.jpg?alt=media&token=2ecdbd0a-d2a7-4f5d-8ba7-a0457904a264";

const selectImage = async (currentUser: UserProfile) => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    return; // Handle permission denied
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.5,
  });

  if (!result?.canceled) {
    await uploadProfilePicture(result.assets[0].uri, currentUser); // Upload the selected image to Firebase
  }
};

const selectMultipleImages = async (): Promise<string[]> => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status === "granted") {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      allowsMultipleSelection: true,
    });

    if (!result?.canceled) {
      return result?.assets?.map((asset) => asset.uri);
    }
  }

  return [];
};

const uploadMultiplePictures = async (guide_uid: string, uri: string) => {
  if (uri.includes("file://")) {
    const response = await fetch(uri);
    const blob = await response.blob();

    const filename = uri.split("/").pop();
    const storageRef = ref(storage, `guide_pictures/${guide_uid}/${filename}`);

    const snapshot = await uploadBytes(storageRef, blob);
    return await getDownloadURL(snapshot.ref);
  }
  return uri;
};

const uploadProfilePicture = async (uri: string, currentUser: UserProfile) => {
  const response = await fetch(uri);
  const blob = await response.blob();

  const filename = uri.split("/").pop();
  const storageRef = ref(storage, `profile_pictures/${filename}`);

  const snapshot = await uploadBytes(storageRef, blob);
  const downloadURL = await getDownloadURL(snapshot.ref);

  await handleUploadProfilePic(currentUser, downloadURL);
};

const handleUploadProfilePic = async (
  currentUser: UserProfile,
  downloadURL: string
) => {
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
        profilePicturePath:
          downloadURL || currentUser?.profilePicturePath || "",
      });
      console.log("Profile updated successfully!");
    } catch (error) {
      console.log("Error updating profile:", error);
    }
  } else {
    console.log("No matching user profile found");
  }
};

export {
  selectImage,
  selectMultipleImages,
  uploadProfilePicture,
  uploadMultiplePictures,
  defaultProfilePicture,
};
