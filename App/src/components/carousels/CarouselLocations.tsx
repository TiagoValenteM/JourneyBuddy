import React, { useRef, useState } from "react";
import { View, Text, FlatList, Dimensions, StyleSheet } from "react-native";
import { Place } from "../../models/guides";
import Feather from "react-native-vector-icons/Feather";

interface CarouselLocationsProps {
  places: Place[];
}
interface CarouselIndicatorProps {
  isActive: boolean;
}

const CarouselLocations: React.FC<CarouselLocationsProps> = ({ places }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const windowWidth = Dimensions.get("window").width - 40;
  const snapToInterval = windowWidth;

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
        data={places}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(place, index) => index.toString()}
        snapToInterval={snapToInterval}
        decelerationRate="fast"
        onScroll={handleScroll}
        renderItem={({ item }) => (
          <View style={[carouselStyles.itemContainer, { width: windowWidth }]}>
            <View
              style={[
                carouselStyles.itemSubContainer,
                { width: windowWidth - 20 },
              ]}
            >
              <Text
                style={carouselStyles.locationName}
                numberOfLines={2}
                ellipsizeMode="middle"
              >
                {item.name}
              </Text>

              <View style={carouselStyles.coordinatesContainer}>
                <Feather name={"map-pin"} size={18} color={"#007AFF"} />
                <Text style={carouselStyles.coordinates}>
                  ({item.coordinates?.latitude.toString().slice(0, 8)},{" "}
                  {item.coordinates?.longitude.toString().slice(0, 8)})
                </Text>
              </View>
            </View>
          </View>
        )}
      />
      <View style={carouselStyles.indicatorContainer}>
        {places.map((place, index) => (
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
    padding: 20,
    justifyContent: "space-between",
  },
  locationName: {
    fontSize: 16,
    fontWeight: "600",
    overflow: "hidden",
    width: "100%",
  },
  coordinatesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 25,
  },
  coordinates: {
    marginHorizontal: 5,
  },
});

export default CarouselLocations;
