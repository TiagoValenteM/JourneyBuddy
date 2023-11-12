import React, { useRef, useState } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import CachedImage from "../images/CachedImage";
import { Animated } from "react-native";
import Colors from "../../../styles/colorScheme";

interface CarouselPicturesProps {
  scrollY: Animated.ValueXY;
  images: string[];
  pictureSize: number;
}

const CarouselPicturesOverview: React.FC<CarouselPicturesProps> = ({
  scrollY,
  images,
  pictureSize,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const pictureData = images.map((image) => ({ uri: image }));

  const handleScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const index = Math.floor(contentOffset.x / pictureSize);
    setCurrentIndex(index);
  };

  return (
    <View>
      <Animated.View
        style={{
          transform: [
            {
              translateY: scrollY.y.interpolate({
                inputRange: [-1000, 0],
                outputRange: [-50, 0],
                extrapolate: "clamp",
              }),
            },
            {
              scale: scrollY.y.interpolate({
                inputRange: [-3000, 0],
                outputRange: [20, 1],
                extrapolate: "clamp",
              }),
            },
          ],
        }}
      >
        <FlatList
          ref={flatListRef}
          data={pictureData}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={true}
          keyExtractor={(_, index) => index.toString()}
          snapToInterval={pictureSize}
          decelerationRate="fast"
          onScroll={handleScroll}
          indicatorStyle={"white"}
          renderItem={({ item }) => (
            <CachedImage
              source={{ uri: item.uri }}
              style={{
                width: pictureSize,
                height: pictureSize,
              }}
            />
          )}
        />
      </Animated.View>
      <Animated.View
        style={{
          ...carouselStyles.indicator,
          opacity: scrollY.y.interpolate({
            inputRange: [-20, 0],
            outputRange: [0, 1],
            extrapolate: "clamp",
          }),
        }}
      >
        <Text style={carouselStyles.indicatorText}>
          {currentIndex + 1} / {images.length}
        </Text>
      </Animated.View>
    </View>
  );
};

const carouselStyles = StyleSheet.create({
  indicator: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "rgba(31, 31, 31, 0.8)",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  indicatorText: {
    marginLeft: 7,
    fontSize: 13,
    fontWeight: "bold",
    color: Colors.white,
  },
});

export default CarouselPicturesOverview;
