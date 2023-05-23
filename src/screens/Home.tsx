import React from "react";
import { Pressable, Text, View } from "react-native";
import { useAuth } from "../hooks/useAuth";

function HomeScreen<StackScreenProps>({ navigation }) {
  const { user } = useAuth();

  return (
    <View className="w-full h-full">
      <View className="mx-4 h-1/2  flex justify-center align-center space-y-6">
        <Text className="text-white text-center text-2xl">
          Welcome {user?.email}!
        </Text>
      </View>
      <View className="h-1/2 flex justify-center align-center space-y-6 bg-red-400">
        <Text
          className={"text-center text-white font-bold text-base"}
          onPress={() => navigation.navigate("Profile")}
        >
          PROFILE
        </Text>
      </View>
    </View>
  );
}

export default HomeScreen;
