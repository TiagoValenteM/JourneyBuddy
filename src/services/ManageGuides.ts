import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { Guide, Comment } from "../models/guides";

const authenticatedUser = auth?.currentUser?.uid;

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

const updateGuideComments = async (guideId: string, comment: string) => {
  const newComment = [
    {
      user_id: authenticatedUser,
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

const UpdateGuideRating = async (guideId: string, rate: number) => {
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

      const updatedRating = [...existingRating, rate];

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

export { getGuidesCurrentUser, updateGuideComments, UpdateGuideRating };
