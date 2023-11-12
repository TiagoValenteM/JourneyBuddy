import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Guide } from "../models/guides";
import { uploadPicture } from "./ImageUpload";
import React from "react";
import UserProfile from "../models/userProfiles";

const checkGuideFields = (guide: Guide, showError: any) => {
  if (guide?.title === "") {
    showError("Please enter a title.");
    return false;
  }

  if (guide?.description === "") {
    showError("Please enter a description.");
    return false;
  }

  if (guide.pictures?.length === 0) {
    showError("Please select at least one picture.");
    return false;
  }

  if (guide.places?.length === 0) {
    showError("Please select at least one place.");
    return false;
  }

  return true;
};

const getGuidesUser = async (userID: string | undefined): Promise<Guide[]> => {
  try {
    const userGuidesCollectionRef = collection(db, "guides");
    const queryFindUserGuides = query(
      userGuidesCollectionRef,
      where("user_id", "==", userID),
      orderBy("dateCreated", "desc")
    );

    const querySnapshotUser = await getDocs(queryFindUserGuides);

    if (!querySnapshotUser.empty) {
      return querySnapshotUser.docs.map((doc) => doc.data() as Guide);
    } else {
      console.log("No matching user profile found");
      return [];
    }
  } catch (error) {
    console.log("Error retrieving user guides:", error);
    return [];
  }
};

const getSavedGuides = async (
  guideIDs: string[] | undefined
): Promise<Guide[]> => {
  try {
    const guidesQuery = query(
      collection(db, "guides"),
      where("uid", "in", guideIDs),
      orderBy("dateCreated", "desc")
    );

    const querySnapshotGuides = await getDocs(guidesQuery);

    if (!querySnapshotGuides.empty) {
      return querySnapshotGuides.docs.map((doc) => doc.data() as Guide);
    } else {
      console.log("No matching user guides found");
      return [];
    }
  } catch (error) {
    console.log("Error retrieving user guides:", error);
    return [];
  }
};

const deleteGuide = async (
  guideId: string,
  authenticatedUser: UserProfile | any,
  setAuthenticatedUser: any,
  guides: Guide[],
  setGuides: any,
  showError: any
) => {
  try {
    const guideRef = doc(db, "guides", guideId);
    await deleteDoc(guideRef);

    const userDocRef = doc(db, "user_profiles", authenticatedUser!.uid);

    await updateDoc(userDocRef, {
      guides: arrayRemove(guideId),
    });

    const updatedUser: UserProfile = {
      ...(authenticatedUser || {}),
      guides: authenticatedUser?.guides?.filter(
        (guide: string) => guide !== guideId
      ),
    };

    setAuthenticatedUser(updatedUser);

    const updatedGuides = guides.filter((guide) => guide.uid !== guideId);
    setGuides(updatedGuides);
    console.log("Guide deleted successfully");
  } catch (error) {
    console.error("Error deleting guide:", error);
    showError("Error deleting guide. Please try again later.");
  }
};

const handleUpdateGuide = async (
  setPressedGuide: React.Dispatch<React.SetStateAction<Guide | undefined>>,
  setTempGuide: React.Dispatch<React.SetStateAction<Guide | undefined>>,
  tempGuide: Guide,
  navigation: any,
  showError: (message: string) => void,
  guides: Guide[],
  setGuides: any
) => {
  if (tempGuide?.uid) {
    const guideRef = doc(db, "guides", tempGuide.uid);
    try {
      await updateDoc(guideRef, { ...tempGuide });

      console.log("updated guide, now uploading pictures.");
      if (tempGuide?.pictures?.length > 0) {
        try {
          const imagesUrl = await Promise.all(
            tempGuide?.pictures?.map(
              async (picture) => await uploadPicture(tempGuide?.uid, picture)
            )
          ).catch((err) => {
            console.log(err);
            showError("Error uploading guide images. Please try again later.");
            return;
          });

          console.log("uploaded images, now updating guide.");

          await updateDoc(guideRef, {
            pictures: imagesUrl,
          });

          console.log("updated guide successfully!");

          setPressedGuide({ ...tempGuide });

          const updatedGuidesOnDevice = guides.map((guide) =>
            guide.uid === tempGuide.uid ? tempGuide : guide
          );
          setGuides(updatedGuidesOnDevice);
        } catch (error) {
          console.log(error);
          showError("Error updating guide. Please try again later.");
        }
      } else {
        setPressedGuide({ ...tempGuide });

        const updatedGuidesOnDevice = guides.map((guide) =>
          guide.uid === tempGuide.uid ? tempGuide : guide
        );
        setGuides(updatedGuidesOnDevice);
      }
    } catch (error) {
      console.log("Error updating guide", error);
      showError("Error updating guide. Please try again later.");
    }
  }
};

export {
  checkGuideFields,
  getGuidesUser,
  getSavedGuides,
  deleteGuide,
  handleUpdateGuide,
};
