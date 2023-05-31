import React, { useRef, useState } from "react";
import { View, Text, FlatList, Dimensions, StyleSheet } from "react-native";
import { Place } from "../models/guides";

interface PlacesCarouselProps {
  places: Place[];
}

interface CarouselIndicatorProps {
  isActive: boolean;
}

const PlacesCarousel: React.FC<PlacesCarouselProps> = ({ places }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const windowWidth = Dimensions.get("window").width - 40;

  const handleScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const index = Math.floor(contentOffset.x / windowWidth);
    setCurrentIndex(index);
  };

  const snapToInterval = windowWidth;

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
        data={places}
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
                padding: 20,
                height: 150,
              }}
            >
              <Text
                style={{ fontSize: 16, fontWeight: "600", marginBottom: 5 }}
              >
                {item?.name}
              </Text>
              <Text style={styles.placeCoordinates}>
                {item?.coordinates?.latitude}
              </Text>
              <Text style={styles.placeCoordinates}>
                {item?.coordinates?.longitude}
              </Text>
            </View>
          </View>
        )}
        snapToInterval={snapToInterval}
        decelerationRate="fast"
      />
      <View style={styles.indicatorContainer}>
        {places.map((_, index) => (
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
  placeCoordinates: {
    marginBottom: 5,
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

export default PlacesCarousel;
