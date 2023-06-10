import React, { useRef, useState } from "react";
import { View, FlatList, Dimensions, StyleSheet } from "react-native";
import CachedImage from "../images/CachedImage";
import uuid from "react-native-uuid";

interface CarouselPicturesProps {
  images: string[];
}
interface CarouselIndicatorProps {
  isActive: boolean;
}

const CarouselPictures: React.FC<CarouselPicturesProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const windowWidth = Dimensions.get("window").width - 40;
  const snapToInterval = windowWidth;
  const pictureData = images.map((image) => ({ uri: image }));

  const handleScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const index = Math.floor(contentOffset.x / windowWidth);
    setCurrentIndex(index);
  };

  const CarouselIndicator: React.FC<CarouselIndicatorProps> = ({
    isActive,
  }) => (
    <View
      style={[
        carouselStyles.indicator,
        isActive
          ? carouselStyles.activeIndicator
          : carouselStyles.inactiveIndicator,
      ]}
    />
  );

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={pictureData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        snapToInterval={snapToInterval}
        decelerationRate="fast"
        onScroll={handleScroll}
        renderItem={({ item }) => (
          <View
            style={[
              carouselStyles.itemContainer,
              {
                width: windowWidth,
              },
            ]}
          >
            <View
              style={[
                carouselStyles.itemSubContainer,
                {
                  width: windowWidth - 20,
                  height: 1.25 * (windowWidth - 20),
                },
              ]}
            >
              <CachedImage
                source={{ uri: item.uri }}
                style={carouselStyles.image}
              />
            </View>
          </View>
        )}
      />
      <View style={carouselStyles.indicatorContainer}>
        {images?.map((_, index) => (
          <CarouselIndicator key={index} isActive={index === currentIndex} />
        ))}
      </View>
    </View>
  );
};

const carouselStyles = StyleSheet.create({
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: "#007AFF",
  },
  inactiveIndicator: {
    backgroundColor: "#C4C4C4",
  },
  itemContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemSubContainer: {
    backgroundColor: "#dfe0e3",
    borderRadius: 15,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
});

export default CarouselPictures;
