import React from "react";
import { Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";

function ProfileScreen<StackScreenProps>({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Profile Screen</Text>
      <Feather
        name="settings"
        size={24}
        color="black"
        onPress={() => navigation.navigate("Settings")}
      />
    </View>
  );
}

export default ProfileScreen;
