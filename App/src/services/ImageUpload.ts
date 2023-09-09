import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
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
import UserProfile from "../models/userProfiles";

const handleProfilePictureUpdate = async (
  authUser: UserProfile,
  setAuthenticatedUser: any
) => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    return; // Handle permission denied
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.2,
  });

  if (!result?.canceled) {
    try {
      const response = await fetch(result.assets[0].uri);
      const blob = await response.blob();

      const filename = result.assets[0].uri.split("/").pop();
      const storageRef = ref(storage, `profile_pictures/${filename}`);

      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);

      const userProfilesCollectionRef = collection(db, "user_profiles");
      const queryFindCurrentUser = query(
        userProfilesCollectionRef,
        where("uid", "==", authUser?.uid)
      );

      const querySnapshotUser = await getDocs(queryFindCurrentUser);

      if (!querySnapshotUser.empty) {
        const userRef = doc(db, "user_profiles", querySnapshotUser.docs[0].id);

        await updateDoc(userRef, {
          profilePicturePath: downloadURL,
        });

        const updatedUser: UserProfile = {
          ...(authUser || {}),
          profilePicturePath: downloadURL,
        } as UserProfile;

        setAuthenticatedUser(updatedUser);

        console.log("Profile Photo updated successfully!");
      } else {
        console.log("Error trying to update profile photo.");
      }
    } catch (error) {
      console.log("Error handling profile picture.");
    }
  }
};

const selectPictures = async (): Promise<string[]> => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status === "granted") {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.2,
      allowsMultipleSelection: true,
    });

    if (!result?.canceled) {
      return result?.assets?.map((asset) => asset.uri);
    }
  }

  return [];
};

const resizeImage = async (uri: string) => {
  try {
    const resizedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1080, height: 1350 } }],
      { compress: 0.2, format: ImageManipulator.SaveFormat.JPEG }
    );

    return resizedImage.uri;
  } catch (error) {
    console.error("Error resizing image:", error);
    throw error; // Rethrow the error for handling at a higher level
  }
};

const uploadPicture = async (guide_uid: string, uri: string) => {
  if (uri.includes("file://")) {
    const resizedUri = await resizeImage(uri);
    const response = await fetch(resizedUri);
    const blob = await response.blob();

    const filename = uri.split("/").pop();
    const storageRef = ref(storage, `guide_pictures/${guide_uid}/${filename}`);

    const snapshot = await uploadBytes(storageRef, blob);
    return await getDownloadURL(snapshot.ref);
  }
  return uri;
};

export { handleProfilePictureUpdate, selectPictures, uploadPicture };
