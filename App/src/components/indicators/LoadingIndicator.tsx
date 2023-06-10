import { ActivityIndicator, StyleSheet, View } from "react-native";
import React from "react";
import { useLoading } from "../../hooks/useLoading";

const LoadingIndicator = () => {
  const { loadingVisible } = useLoading();

  return loadingVisible ? (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the background color and opacity as needed
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoadingIndicator;
