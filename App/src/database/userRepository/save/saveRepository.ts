import UserProfile from "../../../models/userProfiles";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import React from "react";

const handleSaveActionGuide = (
  guideID: string,
  authenticatedUser: UserProfile | undefined,
  setAuthenticatedUser: React.Dispatch<
    React.SetStateAction<UserProfile | undefined>
  >
) => {
  if (
    authenticatedUser?.savedGuides?.some((guideUID) => guideUID === guideID)
  ) {
    handleUnsavedGuide(guideID, authenticatedUser, setAuthenticatedUser).catch(
      (err) => {
        console.log(" Error removing saved guide:", err);
      }
    );
  } else {
    handleSaveGuide(guideID, authenticatedUser!, setAuthenticatedUser).catch(
      (err) => {
        console.log(" Error saving guide:", err);
      }
    );
  }
};

async function handleSaveGuide(
  guideID: string,
  authenticatedUser: UserProfile,
  setAuthenticatedUser: any
): Promise<Promise<void>> {
  const userRef = doc(db, "user_profiles", authenticatedUser?.uid);
  try {
    await updateDoc(userRef, {
      savedGuides: arrayUnion(guideID),
    });

    const updatedAuthenticatedUser: { savedGuides: (string | undefined)[] } = {
      ...(authenticatedUser || {}),
      savedGuides: [...(authenticatedUser?.savedGuides || []), guideID],
    };

    setAuthenticatedUser(updatedAuthenticatedUser);
    console.log("Guide saved successfully");
  } catch (error) {
    console.log("Error updating profile:", error);
  }
}

async function handleUnsavedGuide(
  guideID: string,
  authenticatedUser: UserProfile,
  setAuthenticatedUser: any
): Promise<Promise<void>> {
  const userRef = doc(db, "user_profiles", authenticatedUser?.uid);
  try {
    await updateDoc(userRef, {
      savedGuides: arrayRemove(guideID),
    });

    const updatedAuthenticatedUser: { savedGuides: (string | undefined)[] } = {
      ...(authenticatedUser || {}),
      savedGuides: authenticatedUser?.savedGuides?.filter(
        (savedGuideID) => savedGuideID !== guideID
      ),
    };

    setAuthenticatedUser(updatedAuthenticatedUser);
    console.log("Guide unsaved successfully");
  } catch (error) {
    console.log("Error updating profile:", error);
  }
}

export { handleSaveActionGuide };
