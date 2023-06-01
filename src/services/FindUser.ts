import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

const findUserProfilePicture = async (username: string): Promise<string> => {
  const userProfilesCollectionRef = collection(db, "user_profiles");
  const queryFindUser = query(
    userProfilesCollectionRef,
    where("username", "==", username)
  );
  const querySnapshot = await getDocs(queryFindUser);

  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data().profilePicturePath;
  }

  return "";
};

export { findUserProfilePicture };
