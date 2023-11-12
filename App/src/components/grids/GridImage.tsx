import { StyleSheet, View, Dimensions, Text, Pressable } from "react-native";
import { Guide } from "../../models/guides";
import CachedImage from "../images/CachedImage";
import UserProfile from "../../models/userProfiles";
import React from "react";
import { useAuthenticatedUser } from "../../context/authenticatedUserContext";
import { AlertCircle, Bookmark } from "react-native-feather";
import Colors from "../../../styles/colorScheme";
import { handleSaveActionGuide } from "../../database/userRepository/save/saveRepository";

const screenWidth = Dimensions.get("window").width;
const itemWidth = screenWidth / 2 - 20;

interface GridImageProps {
  guides: Guide[];
  navigation: any;
  authUser?: UserProfile;
  allowSaving?: boolean;
}

const GridImage = ({
  guides,
  navigation,
  authUser,
  allowSaving,
}: GridImageProps) => {
  const { authenticatedUser, setAuthenticatedUser } = useAuthenticatedUser();

  const renderGuideItem = (item: Guide, index: number) => (
    <Pressable
      key={index}
      style={styles.gridItem}
      onPress={() => handleGuidePress(item)}
    >
      <CachedImage style={styles.image} source={{ uri: item.pictures[0] }} />
      {renderAlertIcon(item)}
      <View style={styles.titleContainer}>
        <Text style={styles.bioText} ellipsizeMode={"tail"} numberOfLines={1}>
          {item.title}
        </Text>
      </View>
    </Pressable>
  );

  const handleGuidePress = (guide: Guide) => {
    navigation.navigate("OverviewGuide", {
      guide: guide,
    });
  };

  const handleBookmarkPress = (item: Guide) => {
    handleSaveActionGuide(item.uid, authenticatedUser, setAuthenticatedUser);
  };

  const renderAlertIcon = (item: Guide) => {
    if (item.status === "pending" && !allowSaving) {
      return (
        <AlertCircle
          width={28}
          height={28}
          color={Colors.yellow}
          style={styles.alertIcon}
          key={item.uid}
        />
      );
    }
    return null;
  };

  const renderBookmarkIcon = (item: Guide) => {
    if (allowSaving) {
      return (
        <Pressable
          onPress={() => handleBookmarkPress(item)}
          key={item.uid}
          style={styles.bookmarkIcon}
        >
          <Bookmark
            width={25}
            height={25}
            color={Colors.lightGray}
            fill={
              authenticatedUser?.savedGuides?.includes(item.uid)
                ? Colors.lightGray
                : "transparent"
            }
          />
        </Pressable>
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
          allowSaving;

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
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  titleContainer: {
    position: "absolute",
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    bottom: 0,
    right: 0,
    left: 0,
    height: 45,
    justifyContent: "center",
    paddingHorizontal: 10,
    backgroundColor: Colors.lightGray,
  },
  gridItem: {
    marginVertical: 5,
    width: itemWidth,
    height: itemWidth * 1.25,
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  bioText: {
    fontWeight: "bold",
    color: Colors.darkGray,
    fontSize: 16,
    alignItems: "center",
  },
  alertIcon: {
    position: "absolute",
    right: 15,
    top: 15,
    zIndex: 1,
  },
  bookmarkIcon: {
    position: "absolute",
    right: 15,
    top: 15,
    zIndex: 1,
  },
});

export default GridImage;
