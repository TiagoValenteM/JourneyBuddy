import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Guide } from "../../models/guides";
import { getMonthName } from "../../utils/getMonth";

interface GuideIdentifierProps {
  guide: Guide;
}

const GuideIdentifier: React.FC<GuideIdentifierProps> = ({ guide }) => {
  return (
    <View style={identifierStyles.container}>
      <Text
        style={identifierStyles.title}
        numberOfLines={2}
        ellipsizeMode={"tail"}
      >
        {guide?.title}
      </Text>
      <Text
        style={identifierStyles.description}
        numberOfLines={5}
        ellipsizeMode={"tail"}
      >
        {guide?.description}
      </Text>

      <Text style={identifierStyles.date}>
        {parseInt(guide?.dateCreated.slice(8, 10))}{" "}
        {getMonthName(parseInt(guide?.dateCreated.slice(5, 7)))}{" "}
        {guide?.dateCreated.slice(0, 4)}
      </Text>
    </View>
  );
};

export default GuideIdentifier;

const identifierStyles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: "grey",
  },
});
