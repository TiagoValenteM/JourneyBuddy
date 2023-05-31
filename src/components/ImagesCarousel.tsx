import React, { useRef, useState } from "react";
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  Image,
  Text,
} from "react-native";

interface ImageObject {
  uri: string;
}

interface ImagesCarouselProps {
  images: string[];
}

interface CarouselIndicatorProps {
  isActive: boolean;
}

const ImagesCarousel: React.FC<ImagesCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const windowWidth = Dimensions.get("window").width - 40;

  const handleScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const index = Math.floor(contentOffset.x / windowWidth);
    setCurrentIndex(index);
  };

  const snapToInterval = windowWidth;
  const image = images.map((image) => ({ uri: image }));

  const CarouselIndicator: React.FC<CarouselIndicatorProps> = ({
    isActive,
  }) => (
    <View
      style={[
        styles.indicator,
        isActive ? styles.activeIndicator : styles.inactiveIndicator,
      ]}
    />
  );

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={image}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        onScroll={handleScroll}
        renderItem={({ item }) => (
          <View
            style={{
              width: windowWidth,
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: windowWidth - 20,
                backgroundColor: "#dfe0e3",
                borderRadius: 15,
                height: 1.25 * (windowWidth - 20),
              }}
            >
              <Image
                source={{ uri: item.uri }}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 15,
                  position: "absolute",
                }}
              />
            </View>
          </View>
        )}
        snapToInterval={snapToInterval}
        decelerationRate="fast"
      />
      <View style={styles.indicatorContainer}>
        {images?.map((_, index) => (
          <CarouselIndicator key={index} isActive={index === currentIndex} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default ImagesCarousel;
