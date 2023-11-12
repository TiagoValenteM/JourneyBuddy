import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Guide } from "../../models/guides";
import { getMonthName } from "../../utils/getMonth";
import { useAuthenticatedUser } from "../../context/authenticatedUserContext";
import { Bookmark } from "react-native-feather";
import Colors from "../../../styles/colorScheme";
import { handleSaveActionGuide } from "../../database/userRepository/save/saveRepository";

interface GuideIdentifierProps {
  guide: Guide;
  guides: Guide[];
  setGuides: React.Dispatch<React.SetStateAction<Guide[]>>;
  navigation?: any;
}

const GuideIdentifier: React.FC<GuideIdentifierProps> = ({
  guide,
  guides,
  setGuides,
  navigation,
}) => {
  const { authenticatedUser, setAuthenticatedUser } = useAuthenticatedUser();

  return (
    <Pressable
      style={{
        justifyContent: "space-between",
        flexDirection: "row",
      }}
      onPress={() => {
        if (navigation) {
          navigation.navigate("OverviewGuide", {
            guide: guide,
            guides: guides,
            setGuides: setGuides,
          });
        }
      }}
    >
      <View style={identifierStyles.container}>
        <Text
          style={identifierStyles.title}
          numberOfLines={2}
          ellipsizeMode={"tail"}
        >
          {guide?.title}
        </Text>
        <Text style={identifierStyles.description}>{guide?.description}</Text>
        <Text style={identifierStyles.date}>
          {parseInt(guide?.dateCreated.slice(8, 10))}{" "}
          {getMonthName(parseInt(guide?.dateCreated.slice(5, 7)))}{" "}
          {guide?.dateCreated.slice(0, 4)}
        </Text>
      </View>
      <View>
        <TouchableOpacity
          onPress={() => {
            handleSaveActionGuide(
              guide.uid,
              authenticatedUser,
              setAuthenticatedUser
            );
          }}
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Bookmark
            height={28}
            width={28}
            stroke={Colors.blue}
            fill={
              authenticatedUser?.savedGuides?.some(
                (guideUID) => guideUID === guide.uid
              )
                ? Colors.blue
                : "transparent"
            }
          />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

export default GuideIdentifier;

const identifierStyles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    justifyContent: "space-between",
    maxWidth: "80%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.black,
    marginBottom: 10,
  },
  description: {
    fontWeight: "normal",
    fontSize: 14,
    color: Colors.darkGray,
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.gray,
  },
});
