import { Guide, Rating } from "../models/guides";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  limit,
  startAfter,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { updateGuideLocally } from "../services/guidesService";
import React from "react";

interface GuidesResponse {
  guides: Guide[];
  lastGuideSnapshot?: any;
}

const getGuidesSorted = async (
  pageSize: number,
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
        limit(pageSize)
      );
    } else {
      console.log("fetching first guides");
      guidesQuery = query(
        userGuidesCollectionRef,
        orderBy("dateCreated", "desc"),
        where("status", "==", "approved"),
        limit(pageSize)
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

const updateRating = async (
  newRating: Rating,
  guide: Guide,
  guides: Guide[],
  setGuides: React.Dispatch<React.SetStateAction<Guide[]>>,
  showError: (message: string) => void
) => {
  try {
    const guidesCollectionRef = collection(db, "guides");
    const guideQuery = query(
      guidesCollectionRef,
      where("uid", "==", guide.uid)
    );

    const querySnapshot = await getDocs(guideQuery);

    if (!querySnapshot.empty) {
      const guideDoc = querySnapshot.docs[0];
      const existingRating = guideDoc.data().rating || [];

      const updatedRating = [...existingRating, newRating];
      const newAverageRating = parseFloat(
        (
          updatedRating.reduce((sum, rating) => sum + rating.rate, 0) /
          updatedRating.length
        ).toFixed(1)
      );

      await updateDoc(guideDoc.ref, {
        rating: updatedRating,
        averageRating: newAverageRating,
      });

      const updatedGuide: Guide = {
        ...guide,
        rating: updatedRating,
        averageRating: newAverageRating,
      };

      await updateGuideLocally(updatedGuide, guides, setGuides);

      return newAverageRating as number;
    }
  } catch (error) {
    console.log("Error updating rating:", error);
    showError("Error updating rating. Please try again later.");
  }
};

const getRatingByUser = async (
  userId: string,
  ratings?: Rating[]
): Promise<number> => {
  if (!ratings || ratings.length === 0) {
    return 0;
  }
  const rating = await ratings.find((rating) => rating.user_id === userId);
  return rating?.rate || 0;
};

export { getGuidesSorted, updateRating, getRatingByUser };
