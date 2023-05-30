import {
  FlatList,
  StyleSheet,
  View,
  Image,
  Dimensions,
  Text,
  Pressable,
} from "react-native";
import { Guide } from "../models/guides";

const screenWidth = Dimensions.get("window").width;
const columnWidth = screenWidth / 2;
const columnHeight = screenWidth / 2;

interface GridImageProps {
  guides: Guide[];
  navigation: any;
  setSelectedGuide: any;
}
interface GridItemProps {
  item: Guide;
  navigation: any;
  setSelectedGuide: any;
}

const GridImage = ({
  guides,
  navigation,
  setSelectedGuide,
}: GridImageProps) => {
  const renderItem = ({
    item,
    navigation,
    setSelectedGuide,
  }: GridItemProps) => (
    <Pressable
      style={styles.gridItem}
      onPress={() => {
        setSelectedGuide(item);
        navigation.navigate("Guide In Detail");
      }}
    >
      <Image style={styles.image} source={{ uri: item.pictures[0] }} />
      <Text style={styles.bioText}>{item.title}</Text>
    </Pressable>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={guides}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) =>
          renderItem({ item, navigation, setSelectedGuide })
        }
        numColumns={3}
        contentContainerStyle={styles.gridContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    justifyContent: "space-between",
  },
  gridItem: {
    width: columnWidth,
    height: columnHeight,
  },
  image: {
    width: "100%",
    height: "100%",
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
