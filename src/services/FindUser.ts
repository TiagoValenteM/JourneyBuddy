import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

const findUsers = async (
  userIds: string[]
): Promise<{ [userId: string]: string }> => {
  const userProfilesCollectionRef = collection(db, "user_profiles");
  const queryFindUsers = query(
    userProfilesCollectionRef,
    where("uid", "in", userIds)
  );
  const querySnapshot = await getDocs(queryFindUsers);

  const users: { [userId: string]: string } = {};

  querySnapshot.forEach((doc) => {
    const user = doc.data();
    users[user.uid] = user.username || user.email;
  });

  return users;
};

export { findUsers };
