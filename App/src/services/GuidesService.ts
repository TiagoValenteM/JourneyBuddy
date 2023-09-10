import { Guide } from "../models/guides";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "../config/firebase";

const getGuidesSorted = async (): Promise<Guide[]> => {
  try {
    const userGuidesCollectionRef = collection(db, "guides");
    const guidesQuery = query(
      userGuidesCollectionRef,
      orderBy("dateCreated", "desc"),
      where("status", "==", "approved")
    );
    const querySnapshotUser = await getDocs(guidesQuery);

    if (!querySnapshotUser.empty) {
      return querySnapshotUser.docs.map((doc) => doc.data() as Guide);
    } else {
      console.log("No matching guides found.");
      return [];
    }
  } catch (error) {
    console.log("Error retrieving guides:", error);
    return [];
  }
};

export { getGuidesSorted };
