import { collection, doc, getDocs, query, updateDoc, where,getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import Guide from "../models/guides";

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

const UpdateGuideStatus = async (guide: Guide) => {
  try {
    const guideDocRef = doc(db, "guides", guide.uid);
    await updateDoc(guideDocRef, {
      status: guide.status,
    });
  } catch (error) {
    console.log("Error updating guide status:", error);
  }
};

export { getAllGuides, UpdateGuideStatus };
