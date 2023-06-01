import { useAuth } from "../hooks/useAuth";
import { ScrollView, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import UserIdentifier from "../components/identifiers/UserIdentifier";
import { useAuthenticatedUser } from "../context/authenticatedUserContext";
import { getUsername } from "../database/userRepository";
import { Guide } from "../models/guides";
import { getAllGuides } from "../services/ManageGuides";
import { useCurrentUser } from "../context/currentUserContext";

function FollowingScreen<StackScreenProps>() {
  const { currentUser } = useCurrentUser();
  useEffect(() => {
    currentUser?.following?.map((user) => {
      getUsername(user);
    });
  }, [currentUser?.following]);

  const [refreshing, setRefreshing] = React.useState(false);

  const fetchGuides = async () => {
    try {
      const guides = await getAllGuides();
      setGuides(guides);
    } catch (error) {
      console.log("Error fetching guides:", error);
    } finally {
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      setRefreshing(true);
      await fetchGuides();
    };

    fetchData().then();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchGuides().then();
  };

  return (
    <ScrollView className="w-full h-full">
      {currentUser?.following?.map((user) => {
        return (
          <UserIdentifier
            selectedUsername={user}
            selectedUserUid={user}
            homepage={false}
          />
        );
      })}
    </ScrollView>
  );
}

export default FollowingScreen;
