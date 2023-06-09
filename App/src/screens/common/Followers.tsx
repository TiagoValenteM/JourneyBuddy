import { RefreshControl, ScrollView, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import UserIdentifier from "../../components/identifiers/UserIdentifier";
import { getUsername, getUserByUID } from "../../database/userRepository";
import { useCurrentUser } from "../../context/currentUserContext";

function FollowersView() {
  const { currentUser } = useCurrentUser();
  const [refreshing, setRefreshing] = useState(false);
  const [followers, setFollowers] = useState<UserProfile[] | []>([]);

  useEffect(() => {
    const fetchData = async () => {
      setRefreshing(true);
      await fetchFollowers();
      setRefreshing(false);
    };

    fetchData();
  }, []);

  const fetchFollowers = async () => {
    if (currentUser?.followers) {
      const users: (UserProfile | undefined)[] = await Promise.all(
        currentUser.followers.map((user) => getUserByUID(user))
      );
      setFollowers(users as UserProfile[]);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFollowers().then(() => setRefreshing(false));
  };

  useEffect(() => {
    if (currentUser?.followers) {
      currentUser.followers.forEach((user) => {
        getUsername(user);
      });
    }
  }, [currentUser?.followers]);

  return (
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 20 }}>
          All Followers
        </Text>
        {followers.map((user) => (
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

export default FollowersView;
