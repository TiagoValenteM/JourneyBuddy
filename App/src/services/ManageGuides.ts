import {
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Guide, Rating } from "../models/guides";
import { uploadPicture } from "./ImageUpload";
import { Alert } from "react-native";
import React from "react";
import UserProfile from "../models/userProfiles";

const checkGuide = (guide: Guide) => {
  if (guide?.title === "") {
    Alert.alert("Please enter a title");
    return false;
  }

  if (guide?.description === "") {
    Alert.alert("Please enter a description");
    return false;
  }

  if (guide.pictures?.length === 0) {
    Alert.alert("Please select at least one picture");
    return false;
  }

  if (guide.places?.length === 0) {
    Alert.alert("Please select at least one location");
    return false;
  }

  return true;
};

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

const deleteGuide = async (
  guideId: string,
  authenticatedUser: UserProfile | any,
  setAuthenticatedUser: any,
  guides: Guide[],
  setGuides: any
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
  }
};

const handleUpdateGuide = (
  setPressedGuide: React.Dispatch<React.SetStateAction<Guide | undefined>>,
  pressedGuide: Guide,
  navigation: any,
  showError: (message: string) => void,
  guides: Guide[],
  setGuides: any
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
                  await uploadPicture(pressedGuide?.uid, picture)
              )
            ).catch((err) => {
              console.log(err);
              showError(
                "Error uploading guide images. Please try again later."
              );
              return;
            });

            console.log("UPDATED PICTURES, NOW GUIDE AGAIN...");

            await updateDoc(guideRef, {
              pictures: imagesUrl,
            });

            console.log("UPDATED GUIDE FINALLY...");

            Alert.alert("Guide updated successfully");
            setPressedGuide({ ...pressedGuide });

            const updatedGuidesOnDevice = [...guides, pressedGuide];
            setGuides(updatedGuidesOnDevice);
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

const handleCreateGuide = async (
  setAuthenticatedUser: any,
  authenticatedUser: UserProfile | undefined,
  guide: Guide,
  guides: Guide[],
  setGuides: any,
  showError: any
) => {
  try {
    // 1 - Upload images
    if (guide?.pictures?.length > 0) {
      console.log(guide?.pictures);
      const imagesUrl = await Promise.all(
        guide?.pictures?.map(async (picture: string) =>
          uploadPicture(guide?.uid, picture)
        )
      ).catch((err) => {
        console.error(err);
        showError("Error uploading guide images. Please try again later.");
      });

      // Return early if imagesUrl is not available
      if (imagesUrl?.length === 0) {
        showError("Error uploading guide images. Please try again later.");
        return;
      }

      // 2 - Upload guide
      await setDoc(doc(db, "guides", guide?.uid), {
        ...guide,
        pictures: imagesUrl,
      });

      // 3 - Update user's guides
      const userDocRef = doc(db, "user_profiles", authenticatedUser!.uid);
      const userDocData = (await getDoc(userDocRef)).data();
      const userGuides = userDocData?.guides || [];
      const updatedGuides = [...userGuides, guide?.uid];

      await updateDoc(userDocRef, {
        guides: updatedGuides,
      });

      const updatedUser: UserProfile | any = {
        ...(authenticatedUser || {}),
        guides: updatedGuides,
      };

      setAuthenticatedUser(updatedUser);

      const updatedGuidesOnDevice = [...guides, guide];
      setGuides(updatedGuidesOnDevice);

      console.log("Guides updated successfully!");
    }
  } catch (error) {
    console.log("Error creating guide:", error);
    showError("Error creating guide.");
  }
};

export {
  checkGuide,
  getAllGuides,
  getGuideDetailed,
  getGuidesCurrentUser,
  updateGuideComments,
  UpdateGuideRating,
  hasRatedByUser,
  deleteGuide,
  handleUpdateGuide,
  getRatingByUser,
  handleCreateGuide,
};
