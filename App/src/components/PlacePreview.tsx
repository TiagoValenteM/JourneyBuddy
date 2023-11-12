import { Place } from "../models/guides";
import { Text, View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { MapPin } from "react-native-feather";
import Colors from "../../styles/colorScheme";

interface PlacePreviewProps {
  place: Place;
  onPress: () => void;
}

const PlacePreview = ({ place, onPress }: PlacePreviewProps) => {
  return (
    <View style={placePreviewStyles.container}>
      <View style={placePreviewStyles.mapContainer}>
        <MapView
          style={placePreviewStyles.map}
          initialRegion={{
            latitude: place?.coordinates?.latitude || 38.7223,
            longitude: place?.coordinates?.longitude || -9.1393,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
          onPress={onPress}
          cacheEnabled={true}
        >
          <Marker coordinate={place?.coordinates}>
            <MapPin
              width={25}
              height={25}
              strokeWidth={3}
              stroke={Colors.blue}
            />
          </Marker>
        </MapView>
      </View>
      <View style={placePreviewStyles.infoContainer}>
        <Text
          style={placePreviewStyles.placeName}
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

const placePreviewStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    borderRadius: 10,
    overflow: "hidden",
    zIndex: 1,
  },
  mapContainer: {
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    overflow: "hidden",
    height: 150,
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  placeName: {
    fontSize: 13,
    fontWeight: "normal",
    color: Colors.darkGray,
    overflow: "hidden",
  },
});
