import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import UserProfile from "../../models/userProfiles";

async function getUserData(id: string): Promise<UserProfile | undefined> {
  try {
    const userRef = doc(db, "user_profiles", id);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return undefined;
  }
}

const handleUpdateProfile = async (
  authenticatedUser: UserProfile | undefined,
  pressedUser: UserProfile | undefined,
  setAuthenticatedUser: any,
  setPressedUser: any
) => {
  const batch = writeBatch(db);

  // Update user profile
  const userRef = doc(db, "user_profiles", authenticatedUser?.uid || "");
  batch.update(userRef, {
    fullName: pressedUser?.fullName || "",
    username: pressedUser?.username || "",
    email: pressedUser?.email || "",
  });

  // Update author field in all guides
  const guidesCollectionRef = collection(db, "guides");
  const queryFindCurrentGuide = query(
    guidesCollectionRef,
    where("user_id", "==", authenticatedUser?.uid)
  );

  const querySnapshot = await getDocs(queryFindCurrentGuide);
  querySnapshot.forEach((doc) => {
    const guideRef = doc.ref;
    batch.update(guideRef, { author: pressedUser?.username || "" });
  });

  try {
    await batch.commit();
    console.log("Profile and guides updated successfully!");

    setAuthenticatedUser((prevAuthenticatedUser: UserProfile | undefined) => ({
      ...prevAuthenticatedUser,
      fullName: pressedUser?.fullName || "",
      username: pressedUser?.username || "",
      email: pressedUser?.email || "",
    }));
    setPressedUser(undefined);
  } catch (error) {
    console.log("Error updating profile and guides:", error);
  }
};

export { getUserData, handleUpdateProfile };
