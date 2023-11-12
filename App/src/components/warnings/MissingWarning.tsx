import { Text, View, StyleSheet } from "react-native";
import React from "react";
import Colors from "../../../styles/colorScheme";

interface MissingWarningProps {
  text: any;
}
const MissingWarning = ({ text }: MissingWarningProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default MissingWarning;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: Colors.lightGray,
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
    alignItems: "center",
  },
  text: {
    fontWeight: "normal",
    color: Colors.black,
    fontSize: 14,
  },
});
