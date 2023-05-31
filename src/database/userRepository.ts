import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../config/firebase";

async function getAuthUserProfile(): Promise<UserProfile | undefined> {
  if (auth?.currentUser?.uid) {
    return await getUserByUID(auth?.currentUser?.uid);
  }
  return undefined;
}

async function getUserByUID(uid: string): Promise<UserProfile | undefined> {
  const usersRef = collection(db, "user_profiles");
  const userQuery = query(usersRef, where("uid", "==", uid));

  const queryResult = await getDocs(userQuery);

  if (queryResult?.size === 1) {
    return queryResult.docs[0]?.data() as UserProfile;
  }

  return undefined; // did not find a single user profile
}

export { getAuthUserProfile, getUserByUID };
