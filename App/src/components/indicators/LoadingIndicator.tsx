import { ActivityIndicator, View } from "react-native";
import React from "react";

const LoadingIndicator = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default LoadingIndicator;
