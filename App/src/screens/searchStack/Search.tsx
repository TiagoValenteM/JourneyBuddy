import React from "react";
import { Text, View } from "react-native";
import { useAuth } from "../../hooks/useAuth";

function SearchView<StackScreenProps>({ navigation }: { navigation: any }) {
  const { user } = useAuth();

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text>Missing something here ;(</Text>
    </View>
  );
}

export default SearchView;
