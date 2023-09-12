import { Guide } from "../models/guides";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  limit,
  startAfter,
  doc,
  deleteDoc,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Alert } from "react-native";
import { deleteGuide } from "./ManageGuides";
import UserProfile from "../models/userProfiles";

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

export { getGuidesSorted };
