import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Guide, Rating } from "../models/guides";
import { uploadMultiplePictures } from "./ImageUpload";
import { Alert } from "react-native";
import React from "react";

const getGuidesCurrentUser = async (
  currentUser: UserProfile
): Promise<Guide[]> => {
  try {
    const userGuidesCollectionRef = collection(db, "guides");
    const queryFindUserGuides = query(
      userGuidesCollectionRef,
      where("user_id", "==", currentUser?.uid)
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

const getAllGuides = async (): Promise<Guide[]> => {
  try {
    const userGuidesCollectionRef = collection(db, "guides");
    const querySnapshotUser = await getDocs(userGuidesCollectionRef);

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

const getGuideDetailed = async (uid: string): Promise<Guide | undefined> => {
  try {
    const userGuidesCollectionRef = collection(db, "guides");
    const queryFindUserGuides = query(
      userGuidesCollectionRef,
      where("uid", "==", uid)
    );

    const querySnapshotUser = await getDocs(queryFindUserGuides);

    if (!querySnapshotUser.empty) {
      const guideDoc = querySnapshotUser.docs[0];
      return guideDoc.data() as Guide;
    } else {
      console.log("No matching user profile found");
      return {} as Guide;
    }
  } catch (error) {
    console.log("Error retrieving user guides:", error);
    return {} as Guide;
  }
};

const updateGuideComments = async (
  guideId: string,
  comment: string,
  authUserUsername: string
) => {
  const newComment = [
    {
      username: authUserUsername,
      comment: comment,
    },
  ];
  const guidesCollectionRef = collection(db, "guides");
  const queryFindCurrentGuide = query(
    guidesCollectionRef,
    where("uid", "==", guideId)
  );

  const querySnapshot = await getDocs(queryFindCurrentGuide);

  if (!querySnapshot.empty) {
    const guideRef = doc(db, "guides", querySnapshot.docs[0].id);

    try {
      const guideDoc = await getDoc(guideRef);
      const existingComments = guideDoc.data()?.comments || [];

      const updatedComments = [...existingComments, ...newComment];

      await updateDoc(guideRef, {
        comments: updatedComments,
      });

      console.log("Comments updated successfully!");
    } catch (error) {
      console.log("Error updating comments:", error);
    }
  } else {
    console.log("No matching guide found");
  }
};

const UpdateGuideRating = async (
  guideId: string,
  rate: number,
  authUserID: string
) => {
  const newRating = [
    {
      user_id: authUserID,
      rate: rate,
    },
  ];
  const guidesCollectionRef = collection(db, "guides");
  const queryFindCurrentGuide = query(
    guidesCollectionRef,
    where("uid", "==", guideId)
  );

  const querySnapshot = await getDocs(queryFindCurrentGuide);

  if (!querySnapshot.empty) {
    const guideRef = doc(db, "guides", querySnapshot.docs[0].id);

    try {
      const guideDoc = await getDoc(guideRef);
      const existingRating = guideDoc.data()?.rating || [];

      const updatedRating = [...existingRating, ...newRating];

      await updateDoc(guideRef, {
        rating: updatedRating,
      });

      console.log("Rating updated successfully!");
    } catch (error) {
      console.log("Error updating rating:", error);
    }
  } else {
    console.log("No matching guide found");
  }
};

const hasRatedByUser = (userId: string, ratings?: Rating[]): boolean => {
  if (!ratings || ratings.length === 0) {
    return false;
  }
  return ratings.some((rating) => rating.user_id === userId);
};

const getRatingByUser = (userId: string, ratings?: Rating[]): number => {
  if (!ratings || ratings.length === 0) {
    return 0;
  }
  const rating = ratings.find((rating) => rating.user_id === userId);
  return rating?.rate || 0;
};

const deleteGuide = async (guideId: string) => {
  try {
    const guideRef = doc(db, "guides", guideId);
    await deleteDoc(guideRef);

    console.log("Guide deleted successfully");
  } catch (error) {
    console.error("Error deleting guide:", error);
  }
};

const handleUpdateGuide = (
  setPressedGuide: React.Dispatch<React.SetStateAction<Guide | undefined>>,
  pressedGuide: Guide,
  navigation: any
) => {
  if (pressedGuide?.uid) {
    const guideRef = doc(db, "guides", pressedGuide.uid);
    updateDoc(guideRef, { ...pressedGuide })
      .then(async () => {
        console.log("UPDATED GUIDE, NOW PICTURES...");
        if (pressedGuide?.pictures?.length > 0) {
          try {
            const imagesUrl = await Promise.all(
              pressedGuide?.pictures?.map(
                async (picture) =>
                  await uploadMultiplePictures(pressedGuide?.uid, picture)
              )
            ).catch((error) => {
              console.log("Error updating guide", error);
            });

            console.log("UPDATED PICTURES, NOW GUIDE AGAIN...");

            await updateDoc(guideRef, {
              pictures: imagesUrl,
            });

            console.log("UPDATED GUIDE FINALLY...");

            Alert.alert("Guide updated successfully");
            setPressedGuide({ ...pressedGuide });
            navigation.navigate("GuideInDetail");
          } catch (error) {
            console.log(error);
            Alert.alert("Error updating guide");
          }
        }
      })
      .catch((error) => {
        console.log("Error updating guide", error);
      });
  }
};

export {
  getAllGuides,
  getGuideDetailed,
  getGuidesCurrentUser,
  updateGuideComments,
  UpdateGuideRating,
  hasRatedByUser,
  deleteGuide,
  handleUpdateGuide,
  getRatingByUser,
};
