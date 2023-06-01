import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
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

  return undefined;
}

async function getUsername(uid: string): Promise<UserProfile | undefined> {
  const usersRef = collection(db, "user_profiles");
  const userQuery = query(usersRef, where("uid", "==", uid));

  const queryResult = await getDocs(userQuery);

  if (queryResult?.size === 1) {
    return queryResult.docs[0].data().username;
  }

  return undefined;
}

async function followUser(
  userToFollow: string | undefined,
  authenticatedUser: UserProfile,
  currentUser: UserProfile,
  setAuthenticatedUser: (user: UserProfile | undefined) => void,
  setCurrentUser: (user: UserProfile | undefined) => void
): Promise<void> {
  const updateFollowing = () => [
    ...(authenticatedUser?.following || []),
    userToFollow || "",
  ];

  const followedUser = await getUserByUID(userToFollow || "");

  const updateFollowers = () => [
    ...(followedUser?.followers || []),
    authenticatedUser?.uid || "",
  ];

  const followedUserRef = collection(db, "user_profiles");
  const queryFindFollowedUser = query(
    followedUserRef,
    where("uid", "==", followedUser?.uid)
  );

  const querySnapshotFollowedUser = await getDocs(queryFindFollowedUser);

  if (!querySnapshotFollowedUser.empty) {
    const userRef = doc(
      db,
      "user_profiles",
      querySnapshotFollowedUser.docs[0].id
    );

    try {
      await updateDoc(userRef, {
        followers: updateFollowers(),
      });
      console.log("Followed user successfully!");
      const updatedCurrentUser: UserProfile = {
        ...(currentUser || {}),
        followers: updateFollowers()!,
      };

      setCurrentUser(updatedCurrentUser);
    } catch (error) {
      console.log("Error updating profile:", error);
    }
  }

  const userProfilesCollectionRef = collection(db, "user_profiles");
  const queryFindCurrentUser = query(
    userProfilesCollectionRef,
    where("uid", "==", authenticatedUser?.uid)
  );

  const querySnapshotUser = await getDocs(queryFindCurrentUser);

  if (!querySnapshotUser.empty) {
    const userRef = doc(db, "user_profiles", querySnapshotUser.docs[0].id);

    try {
      await updateDoc(userRef, {
        following: updateFollowing(),
      });

      console.log("Followed user successfully!");
      const updatedUser: UserProfile = {
        ...(authenticatedUser || {}),
        following: updateFollowing(),
      };

      setAuthenticatedUser(updatedUser);
    } catch (error) {
      console.log("Error updating profile:", error);
    }
  }
}

async function unfollowUser(
  userToUnfollow: string | undefined,
  authenticatedUser: UserProfile,
  currentUser: UserProfile,
  setAuthenticatedUser: (user: UserProfile | undefined) => void,
  setCurrentUser: (user: UserProfile | undefined) => void
): Promise<void> {
  const updateFollowing = () =>
    authenticatedUser?.following?.filter((uid) => uid !== userToUnfollow);

  const followedUser = await getUserByUID(userToUnfollow || "");

  const updateFollowers = () =>
    followedUser?.followers?.filter((uid) => uid !== authenticatedUser?.uid);

  const followedUserRef = collection(db, "user_profiles");
  const queryFindFollowedUser = query(
    followedUserRef,
    where("uid", "==", followedUser?.uid)
  );

  const querySnapshotFollowedUser = await getDocs(queryFindFollowedUser);

  if (!querySnapshotFollowedUser.empty) {
    const userRef = doc(
      db,
      "user_profiles",
      querySnapshotFollowedUser.docs[0].id
    );

    try {
      await updateDoc(userRef, {
        followers: updateFollowers(),
      });
      console.log("Unfollowed user successfully!");
      const updatedCurrentUser: UserProfile = {
        ...(currentUser || {}),
        followers: updateFollowers()!,
      };

      setCurrentUser(updatedCurrentUser);
    } catch (error) {
      console.log("Error updating profile:", error);
    }
  }

  const userProfilesCollectionRef = collection(db, "user_profiles");
  const queryFindCurrentUser = query(
    userProfilesCollectionRef,
    where("uid", "==", authenticatedUser?.uid)
  );

  const querySnapshotUser = await getDocs(queryFindCurrentUser);

  if (!querySnapshotUser.empty) {
    const userRef = doc(db, "user_profiles", querySnapshotUser.docs[0].id);

    try {
      await updateDoc(userRef, {
        following: updateFollowing(),
      });

      console.log("Unfollowed user successfully!");
      const updatedUser: UserProfile = {
        ...(authenticatedUser || {}),
        following: updateFollowing(),
      };

      setAuthenticatedUser(updatedUser);
    } catch (error) {
      console.log("Error updating profile:", error);
    }
  }
}

export {
  getAuthUserProfile,
  getUserByUID,
  getUsername,
  followUser,
  unfollowUser,
};
