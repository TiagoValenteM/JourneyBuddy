import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Guide } from "../../models/guides";
import { useGuide } from "../../context/GuideContext";
import CachedImage from "../images/CachedImage";
import UserProfile from "../../models/userProfiles";
import React from "react";
import { useAuthenticatedUser } from "../../context/authenticatedUserContext";
import { checkSelectGuide } from "../../services/ManageGuides";
import { AlertCircle, Bookmark } from "react-native-feather";

const screenWidth = Dimensions.get("window").width;
const columnWidth = screenWidth / 2 - 30;

interface GridImageProps {
  guides: Guide[];
  navigation: any;
  authUser?: UserProfile;
  allowSaveChange?: boolean;
}

const GridImage = ({
  guides,
  navigation,
  authUser,
  allowSaveChange,
}: GridImageProps) => {
  const { setPressedGuide, pressedGuide } = useGuide();
  const { authenticatedUser, setAuthenticatedUser } = useAuthenticatedUser();

  const renderGuideItem = (item: Guide, index: number) => (
    <Pressable
      key={index}
      style={styles.gridItem}
      onPress={() => handleGuidePress(item)}
    >
      <CachedImage style={styles.image} source={{ uri: item.pictures[0] }} />
      {renderAlertIcon(item)}
      <Text style={styles.bioText} ellipsizeMode={"tail"} numberOfLines={1}>
        {item.title}
      </Text>
    </Pressable>
  );

  const handleGuidePress = (guide: Guide) => {
    setPressedGuide(guide);
    navigation.navigate("OverviewGuide", {
      guide: pressedGuide,
    });
  };

  const handleBookmarkPress = (item: Guide) => {
    checkSelectGuide(item.uid, authenticatedUser, setAuthenticatedUser);
  };

  const renderAlertIcon = (item: Guide) => {
    if (item.status === "pending" && !allowSaveChange) {
      return (
        <View style={styles.alertIcon} key={item.uid}>
          <AlertCircle width={30} height={30} color={"white"} />
        </View>
      );
    }
    return null;
  };

  const renderBookmarkIcon = (item: Guide) => {
    if (allowSaveChange) {
      return (
        <TouchableOpacity
          onPress={() => handleBookmarkPress(item)}
          key={item.uid}
          style={styles.bookmarkIcon}
        >
          <Bookmark
            width={20}
            height={20}
            color={"black"}
            fill={
              authenticatedUser?.savedGuides?.includes(item.uid)
                ? "black"
                : "transparent"
            }
          />
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <View style={styles.gridContainer}>
      {guides?.map((item, index) => {
        const shouldRenderGuide =
          item.user_id === authUser?.uid ||
          item.status === "approved" ||
          allowSaveChange;

        if (shouldRenderGuide) {
          return (
            <View style={styles.gridItem} key={item.uid}>
              {renderGuideItem(item, index)}
              {renderBookmarkIcon(item)}
            </View>
          );
        }
        return null;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    marginBottom: 20,
    width: columnWidth,
    height: columnWidth * 1.25,
    backgroundColor: "#dfe0e3",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 1,
      height: 3,
    },
    elevation: 3,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  bioText: {
    position: "absolute",
    fontWeight: "600",
    left: 10,
    right: 1,
    bottom: 10,
    color: "white",
    fontSize: 20,
  },
  alertIcon: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 1,
    backgroundColor: "#fdcb03",
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  unsavedBookmarkIcon: {
    zIndex: 1,
    position: "absolute",
    top: 10,
  },
  bookmarkIcon: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 1,
    backgroundColor: "#dfe0e3",
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    height: 40,
    width: 40,
  },
});

export default GridImage;
