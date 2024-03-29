import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Animated,
} from "react-native";
import { Place } from "../../models/guides";
import { useAuthenticatedUser } from "../../context/authenticatedUserContext";
import { handleSaveActionPlace } from "../../database/placeRepository/placesRepository";
import { useGuide } from "../../context/GuideContext";
import { Bookmark, Map } from "react-native-feather";

interface LocationIdentifierProps {
  place: Place;
}

const LocationIdentifier: React.FC<LocationIdentifierProps> = ({ place }) => {
  const { authenticatedUser, setAuthenticatedUser } = useAuthenticatedUser();
  const { selectedPlace, setSelectedPlace } = useGuide();
  const bgAnimation = useRef(new Animated.Value(0)).current;

  const isSelected =
    selectedPlace?.coordinates?.latitude === place.coordinates?.latitude &&
    selectedPlace?.coordinates?.longitude === place.coordinates?.longitude;

  const interpolatedBackgroundColor = {
    backgroundColor: bgAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ["transparent", "#dfe0e3"],
    }),
  };

  React.useEffect(() => {
    if (isSelected) {
      Animated.timing(bgAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false, // better native performance
      }).start();
    } else {
      bgAnimation.setValue(0);
    }
  }, [isSelected]);

  return (
    <Animated.View
      style={[identifierStyles.containerRow, interpolatedBackgroundColor]}
    >
      <Pressable
        style={identifierStyles.container}
        onPress={() => {
          setSelectedPlace(place);
        }}
      >
        <Text
          style={identifierStyles.locationName}
          numberOfLines={3}
          ellipsizeMode="middle"
        >
          {place.name}
        </Text>

        <View style={identifierStyles.coordinatesContainer}>
          <Map width={18} height={18} color={"#007AFF"} />
          <Text style={identifierStyles.coordinates}>
            ({place.coordinates?.latitude.toString().slice(0, 8)},{" "}
            {place.coordinates?.longitude.toString().slice(0, 8)})
          </Text>
        </View>
      </Pressable>
      <View style={identifierStyles.unsavedContainer}>
        <TouchableOpacity
          onPress={() => {
            handleSaveActionPlace(
              place,
              authenticatedUser,
              setAuthenticatedUser
            );
          }}
          style={identifierStyles.saveButton}
        >
          <Bookmark
            width={30}
            height={30}
            color="black"
            fill={
              authenticatedUser?.savedPlaces?.some(
                (savedPlace) => savedPlace.name === place.name
              )
                ? "black"
                : "transparent"
            }
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default LocationIdentifier;

const identifierStyles = StyleSheet.create({
  containerRow: {
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 10,
    borderRadius: 10,
  },
  container: {
    alignItems: "flex-start",
    justifyContent: "space-between",
    maxWidth: "80%",
  },
  locationName: {
    fontSize: 15,
    fontWeight: "600",
    overflow: "hidden",
    width: "100%",
  },
  coordinatesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  coordinates: {
    fontSize: 13,
    marginHorizontal: 5,
  },
  unsavedContainer: {
    paddingHorizontal: 8,
  },
  saveButton: {
    justifyContent: "center",
    alignItems: "center",
  },
});
