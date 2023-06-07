import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  Text,
  Pressable,
} from "react-native";
import { Guide } from "../../models/guides";
import { usePressedGuide } from "../../context/pressedGuideContext";

const screenWidth = Dimensions.get("window").width;
const columnWidth = screenWidth / 2 - 30;

interface GridImageProps {
  guides: Guide[];
  navigation: any;
}
interface GridItemProps {
  item: Guide;
  navigation: any;
}

const GridImage = ({ guides, navigation }: GridImageProps) => {
  const { setPressedGuide } = usePressedGuide();

  const renderItem = ({ item, navigation }: GridItemProps) => (
    <Pressable
      style={styles.gridItem}
      onPress={() => {
        setPressedGuide(item);
        navigation.navigate("GuideInDetail");
      }}
    >
      <Image style={styles.image} source={{ uri: item.pictures[0] }} />
      <Text style={styles.bioText}>{item.title}</Text>
    </Pressable>
  );

  return (
    <View style={styles.gridContainer}>
      {guides?.map((item) => (
        <View style={styles.gridItem} key={item.uid}>
          {renderItem({ item, navigation })}
        </View>
      ))}
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
    bottom: 10,
    color: "white",
    fontSize: 20,
  },
});

export default GridImage;
