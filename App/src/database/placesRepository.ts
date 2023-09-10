import UserProfile from "../models/userProfiles";
import { getUserByUID } from "./userRepository";
import { Place } from "../models/guides";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const checkSelectPlace = (
  selectedPlace: Place,
  authenticatedUser: UserProfile | undefined,
  setAuthenticatedUser: any
) => {
  if (
    authenticatedUser?.savedPlaces?.some(
      (placeName) => placeName.name === selectedPlace?.name
    )
  ) {
    handleUnsavedPlace(
      selectedPlace,
      authenticatedUser,
      setAuthenticatedUser
    ).then();
  } else {
    handleSavePlace(
      selectedPlace,
      authenticatedUser,
      setAuthenticatedUser
    ).then();
  }
};

async function handleSavePlace(
  selectedPlace: Place,
  authenticatedUser: UserProfile | undefined,
  setAuthenticatedUser: any
): Promise<Promise<void>> {
  try {
    const updatedSavedPlaces = [
      ...(authenticatedUser?.savedPlaces || []),
      selectedPlace || "",
    ];

    const user = await getUserByUID(authenticatedUser?.uid || "");

    if (user) {
      await updateDoc(doc(db, "user_profiles", user.uid), {
        savedPlaces: updatedSavedPlaces,
      });

      const updatedAuthenticatedUser: { savedPlaces: (Place | undefined)[] } = {
        ...(authenticatedUser || {}),
        savedPlaces: updatedSavedPlaces,
      };

      setAuthenticatedUser(updatedAuthenticatedUser);
    }
  } catch (error) {
    console.log("Error updating profile:", error);
  }
}

async function handleUnsavedPlace(
  selectedPlace: Place,
  authenticatedUser: UserProfile | undefined,
  setAuthenticatedUser: any
): Promise<Promise<void>> {
  try {
    const updatedSavedPlaces = (authenticatedUser?.savedPlaces || []).filter(
      (savedPlace) => savedPlace?.name !== selectedPlace?.name
    );

    const user = await getUserByUID(authenticatedUser?.uid || "");

    if (user) {
      await updateDoc(doc(db, "user_profiles", user.uid), {
        savedPlaces: updatedSavedPlaces,
      });

      const updatedAuthenticatedUser: { savedPlaces: (Place | undefined)[] } = {
        ...(authenticatedUser || {}),
        savedPlaces: updatedSavedPlaces,
      };

      setAuthenticatedUser(updatedAuthenticatedUser);
    }
  } catch (error) {
    console.log("Error updating profile:", error);
  }
}

export { checkSelectPlace };
