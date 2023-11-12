import { Guide } from "../../models/guides";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  limit,
  startAfter,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import React from "react";
import UserProfile from "../../models/userProfiles";
import { uploadPicture } from "../../services/ImageUpload";

interface GuidesResponse {
  guides: Guide[];
  lastGuideSnapshot?: any;
}

const getGuidesSorted = async (
  lastGuideSnapshot?: any
): Promise<GuidesResponse> => {
  try {
    const userGuidesCollectionRef = collection(db, "guides");
    let guidesQuery;

    if (lastGuideSnapshot) {
      console.log("fetching more guides");
      guidesQuery = query(
        userGuidesCollectionRef,
        orderBy("dateCreated", "desc"),
        where("status", "==", "approved"),
        startAfter(lastGuideSnapshot),
        limit(5)
      );
    } else {
      console.log("fetching first guides");
      guidesQuery = query(
        userGuidesCollectionRef,
        orderBy("dateCreated", "desc"),
        where("status", "==", "approved"),
        limit(5)
      );
    }

    const documentSnapshots = await getDocs(guidesQuery);
    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];

    if (!documentSnapshots.empty) {
      return {
        guides: documentSnapshots.docs.map((doc) => doc.data() as Guide),
        lastGuideSnapshot: lastVisible,
      };
    } else {
      console.log("No matching guides found.");
      return { guides: [] };
    }
  } catch (error) {
    console.log("Error retrieving guides:", error);
    return { guides: [] };
  }
};

const createGuide = async (
  setAuthenticatedUser: React.Dispatch<
    React.SetStateAction<UserProfile | undefined>
  >,
  authenticatedUser: UserProfile,
  guide: Guide,
  showError: (message: string) => void
) => {
  const userRef = doc(db, "user_profiles", authenticatedUser.uid);
  const guideRef = doc(db, "guides", guide?.uid);

  try {
    const imagesURI = await Promise.all(
      guide?.pictures?.map(async (picture: string) => {
        return await uploadPicture(guide?.uid, picture);
      })
    ).catch((err) => {
      console.error(err);
      showError("Error uploading guide images. Please try again later.");
      return;
    });

    const updatedGuide = { ...guide, pictures: imagesURI };
    await setDoc(guideRef, updatedGuide);

    await updateDoc(userRef, {
      guides: arrayUnion(guide?.uid),
    });

    const updatedUser = {
      ...authenticatedUser,
      guides: [...(authenticatedUser.guides || []), guide.uid],
    } as UserProfile;

    setAuthenticatedUser(updatedUser);
    console.log("Guides updated successfully!");
  } catch (error) {
    console.log("Error creating guide:", error);
    showError("Error creating guide. Please try again later.");
  }
};

export { getGuidesSorted, createGuide };
