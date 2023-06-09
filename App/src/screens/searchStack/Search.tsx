import React from "react";
import { Pressable, Text, View } from "react-native";
import { useAuth } from "../../hooks/useAuth";

function SearchView<StackScreenProps>({ navigation }: { navigation: any }) {
  const { user } = useAuth();

  return (
    <View className="w-full h-full">
      <View className="mx-4 h-5/6 flex justify-center align-center space-y-6">
        <Text className="text-white text-center text-2xl">
          Welcome {user?.email}!
        </Text>
      </View>
      <View className="h-5/6 flex justify-center align-center space-y-6 bg-red-400">
        <Text className={"text-center text-white font-bold text-base"}>
          PROFILE
        </Text>
      </View>
    </View>
  );
}

export default SearchView;
