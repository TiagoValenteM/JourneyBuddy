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
import { checkSelectGuide } from "../../services/ManageGuides";
import { useGuide } from "../../context/GuideContext";
import { Bookmark } from "react-native-feather";

interface GuideIdentifierProps {
  guide: Guide;
  navigation?: any;
}

const GuideIdentifier: React.FC<GuideIdentifierProps> = ({
  guide,
  navigation,
}) => {
  const { authenticatedUser, setAuthenticatedUser } = useAuthenticatedUser();
  const { setPressedGuide } = useGuide();

  return (
    <Pressable
      style={{
        justifyContent: "space-between",
        flexDirection: "row",
      }}
      onPress={() => {
        if (navigation) {
          setPressedGuide(guide);
          navigation.navigate("OverviewGuide");
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
      <View>
        <TouchableOpacity
          onPress={() => {
            checkSelectGuide(
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
            height={30}
            width={30}
            color={"black"}
            fill={
              authenticatedUser?.savedGuides?.some(
                (guideUID) => guideUID === guide.uid
              )
                ? "black"
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
    fontWeight: "700",
    marginBottom: 10,
  },
  description: {
    fontSize: 13,
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: "grey",
  },
});
