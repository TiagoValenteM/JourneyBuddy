import React, { useRef, useState } from "react";
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  Text,
  Pressable,
} from "react-native";
import CachedImage from "../images/CachedImage";
import { ArrowLeft, Image, MoreVertical } from "react-native-feather";

interface CarouselPicturesProps {
  images: string[];
  navigation: any;
  authUserId: string | undefined;
  guideAuthId: string | undefined;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const CarouselPicturesOverview: React.FC<CarouselPicturesProps> = ({
  images,
  navigation,
  authUserId,
  guideAuthId,
  setModalVisible,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const windowWidth = Dimensions.get("window").width;
  const pictureData = images.map((image) => ({ uri: image }));

  const handleScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const index = Math.floor(contentOffset.x / windowWidth);
    setCurrentIndex(index);
  };

  return (
    <View>
      <View
        style={{
          position: "absolute",
          top: 60,
          flex: 1,
          flexDirection: "row",
          paddingHorizontal: 20,
          width: "100%",
          zIndex: 1,
          justifyContent: "space-between",
        }}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          style={carouselStyles.button}
        >
          <ArrowLeft width={28} height={28} color={"white"} />
        </Pressable>
        {authUserId === guideAuthId && (
          <Pressable
            onPress={() => setModalVisible(true)}
            style={carouselStyles.button}
          >
            <MoreVertical width={28} height={28} color={"white"} />
          </Pressable>
        )}
      </View>

      <FlatList
        ref={flatListRef}
        data={pictureData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={true}
        keyExtractor={(_, index) => index.toString()}
        snapToInterval={windowWidth}
        decelerationRate="fast"
        onScroll={handleScroll}
        indicatorStyle={"white"}
        renderItem={({ item }) => (
          <View
            style={{
              width: windowWidth,
              height: windowWidth,
            }}
          >
            <CachedImage
              source={{ uri: item.uri }}
              style={carouselStyles.image}
            />
          </View>
        )}
      />
      <View
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: "rgba(31,31,31,0.8)",
          flexDirection: "row",
          paddingHorizontal: 15,
          paddingVertical: 3,
          borderRadius: 10,
        }}
      >
        <Image width={15} height={15} color={"white"} />
        <Text
          style={{
            marginLeft: 7,
            fontSize: 12,
            fontWeight: "700",
            color: "white",
          }}
        >
          {currentIndex + 1} / {images.length}
        </Text>
      </View>
    </View>
  );
};

const carouselStyles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  button: {
    backgroundColor: "rgba(31,31,31,0.8)",
    borderRadius: 50,
    padding: 7,
    elevation: 1,
  },
});

export default CarouselPicturesOverview;
