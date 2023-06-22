import { StyleSheet, View, Dimensions, Text, Pressable } from "react-native";
import { Guide } from "../../models/guides";
import { useGuide } from "../../context/GuideContext";
import CachedImage from "../images/CachedImage";
import Feather from "react-native-vector-icons/Feather";
import UserProfile from "../../models/userProfiles";

const screenWidth = Dimensions.get("window").width;
const columnWidth = screenWidth / 2 - 30;

interface GridImageProps {
  guides: Guide[];
  navigation: any;
  authUser: UserProfile;
}
interface GridItemProps {
  item: Guide;
  navigation: any;
}

const GridImage = ({ guides, navigation, authUser }: GridImageProps) => {
  const { setPressedGuide } = useGuide();

  const renderItem = ({ item, navigation }: GridItemProps) => (
    <Pressable
      style={styles.gridItem}
      onPress={() => {
        setPressedGuide(item);
        navigation.navigate("GuideInDetail");
      }}
    >
      <CachedImage style={styles.image} source={{ uri: item.pictures[0] }} />
      {item.status === "pending" ? (
        <View
          style={{
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
          }}
        >
          <Feather name={"alert-circle"} size={30} color="white" />
        </View>
      ) : null}

      <Text style={styles.bioText}>{item.title}</Text>
    </Pressable>
  );

  return (
    <View style={styles.gridContainer}>
      {guides?.map((item) => {
        const shouldRenderGuide =
          item.user_id === authUser?.uid || item.status === "approved";

        if (shouldRenderGuide) {
          return (
            <View style={styles.gridItem} key={item.uid}>
              {renderItem({ item, navigation })}
            </View>
          );
        } else {
          return null;
        }
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
});

export default GridImage;
