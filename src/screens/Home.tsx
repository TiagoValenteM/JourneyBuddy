import React from "react";
import { Text, View } from "react-native";
import { useAuth } from "../hooks/useAuth";

function HomeScreen<StackScreenProps>({}: {}) {
  const { user } = useAuth();

  return (
    <View className="w-full h-full">
      <View className="mx-4 h-1/2  flex justify-center align-center space-y-6">
        <Text className="text-white text-center text-2xl">
          Welcome {user?.email}!
        </Text>
      </View>
      <View className="h-1/2 flex justify-center align-center space-y-6 bg-red-400">
        <Text className={"text-center text-white font-bold text-base"}>
          PROFILE
        </Text>
      </View>
    </View>
  );
}

export default HomeScreen;
