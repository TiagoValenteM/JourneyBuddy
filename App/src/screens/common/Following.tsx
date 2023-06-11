import { RefreshControl, ScrollView, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import UserIdentifier from "../../components/identifiers/UserIdentifier";
import { getUsername, getUserByUID } from "../../database/userRepository";
import { useCurrentUser } from "../../context/currentUserContext";
import UserProfile from "../../models/userProfiles";

function FollowingView() {
  const { currentUser } = useCurrentUser();
  const [refreshing, setRefreshing] = useState(false);
  const [followingUsers, setFollowingUsers] = useState<UserProfile[] | []>([]);

  useEffect(() => {
    const fetchData = async () => {
      setRefreshing(true);
      await fetchFollowingUsers();
      setRefreshing(false);
    };

    fetchData();
  }, []);

  const fetchFollowingUsers = async () => {
    if (currentUser?.following) {
      const users: (UserProfile | undefined)[] = await Promise.all(
        currentUser.following.map((user) => getUserByUID(user))
      );
      setFollowingUsers(users as UserProfile[]);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFollowingUsers().then(() => setRefreshing(false));
  };

  useEffect(() => {
    if (currentUser?.following) {
      currentUser.following.forEach((user) => {
        getUsername(user);
      });
    }
  }, [currentUser?.following]);

  return (
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 20 }}>
          All Following
        </Text>
        {followingUsers.map((user) => (
          <UserIdentifier
            key={user.uid}
            selectedUsername={user.username}
            selectedUserUid={user.uid}
            homepage={false}
          />
        ))}
      </View>
    </ScrollView>
  );
}

export default FollowingView;
