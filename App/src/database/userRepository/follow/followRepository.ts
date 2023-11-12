import UserProfile from "../../../models/userProfiles";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../config/firebase";

async function follow(
  authenticatedUser: UserProfile,
  userToFollowID: string,
  setAuthenticatedUser: (user: UserProfile | undefined) => void,
  showError: (message: string) => void
): Promise<void> {
  const userProfilesRef = collection(db, "user_profiles");

  try {
    await updateDoc(doc(userProfilesRef, authenticatedUser?.uid), {
      following: arrayUnion(userToFollowID),
    });

    await updateDoc(doc(userProfilesRef, userToFollowID), {
      followers: arrayUnion(authenticatedUser?.uid),
    });

    console.log("Followed user successfully!");

    const updatedAuthenticatedUser: UserProfile = {
      ...authenticatedUser,
      following: [...authenticatedUser?.following, userToFollowID],
    } as UserProfile;

    setAuthenticatedUser(updatedAuthenticatedUser);
  } catch (error) {
    console.error("Error following user:", error);
    showError("Error following user. Please try again later.");
  }
}

async function unfollow(
  authenticatedUser: UserProfile,
  userToUnfollowID: string,
  setAuthenticatedUser: (user: UserProfile | undefined) => void,
  showError: (message: string) => void
): Promise<void> {
  const userProfilesRef = collection(db, "user_profiles");

  try {
    await updateDoc(doc(userProfilesRef, authenticatedUser?.uid), {
      following: arrayRemove(userToUnfollowID),
    });

    await updateDoc(doc(userProfilesRef, userToUnfollowID), {
      followers: arrayRemove(authenticatedUser?.uid),
    });

    console.log("Unfollowed user successfully!");

    const updatedAuthenticatedUser: UserProfile = {
      ...authenticatedUser,
      following: authenticatedUser?.following.filter(
        (followingID) => followingID !== userToUnfollowID
      ),
    } as UserProfile;

    setAuthenticatedUser(updatedAuthenticatedUser);
  } catch (error) {
    console.error("Error unfollowing user:", error);
    showError("Error unfollowing user. Please try again later.");
  }
}

export { follow, unfollow };
