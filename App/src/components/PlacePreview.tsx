import { Place } from "../models/guides";
import { Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { MapPin } from "react-native-feather";

interface PlacePreviewProps {
  place: Place;
  onPress: () => void;
}

const PlacePreview = ({ place, onPress }: PlacePreviewProps) => {
  const initialRegion = {
    latitude: place?.coordinates?.latitude || 38.7223,
    longitude: place?.coordinates?.longitude || -9.1393,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        borderRadius: 15,
        overflow: "hidden",
        zIndex: 1,
      }}
    >
      <View
        style={{
          borderTopStartRadius: 15,
          borderTopEndRadius: 15,
          overflow: "hidden",
        }}
      >
        <MapView
          initialRegion={initialRegion}
          cacheEnabled={true}
          style={{
            flex: 1,
            height: 150,
          }}
          onPress={onPress}
        >
          <Marker coordinate={place?.coordinates}>
            <MapPin width={25} height={25} strokeWidth={3} stroke={"#fb4342"} />
          </Marker>
        </MapView>
      </View>
      <View
        style={{
          paddingVertical: 15,
          paddingHorizontal: 15,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "500",
            overflow: "hidden",
            width: "90%",
          }}
          numberOfLines={2}
          ellipsizeMode="middle"
        >
          {place.name}
        </Text>
      </View>
    </View>
  );
};

export default PlacePreview;
