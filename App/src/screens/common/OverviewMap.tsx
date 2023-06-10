import MapView, { Marker } from "react-native-maps";
import React from "react";
import { Place } from "../../models/guides";
import { Pressable, Text, View } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { useGuide } from "../../context/GuideContext";

interface OverviewMapProps {
  guidePlaces: Place[] | undefined;
  navigation: any;
}
function OverviewMapView({ guidePlaces, navigation }: OverviewMapProps) {
  const { pressedGuide } = useGuide();
  const [selectedPlace, setSelectedPlace] = React.useState<Place | null>(null);
  const initialRegion = {
    latitude: guidePlaces?.[0]?.coordinates?.latitude || 38.7223,
    longitude: guidePlaces?.[0]?.coordinates?.longitude || -9.1393,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
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
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            backgroundColor: "#fff",
            borderRadius: 50,
            padding: 10,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowOffset: {
              width: 1,
              height: 3,
            },
            elevation: 3,
            height: 50,
            justifyContent: "center",
            width: 50,
            alignItems: "center",
          }}
        >
          <Feather name={"arrow-left"} size={28} color={"black"} />
        </Pressable>
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 50,
            paddingVertical: 10,
            paddingHorizontal: 20,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowOffset: {
              width: 1,
              height: 3,
            },
            width: 200,
            height: 50,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "500",
              textAlign: "center",
              textAlignVertical: "center",
            }}
          >
            {selectedPlace
              ? selectedPlace?.name.slice(0, 40) + "..."
              : "Select a location"}
          </Text>
        </View>
      </View>

      <MapView
        style={{ width: "100%", height: "100%" }}
        initialRegion={initialRegion}
      >
        {pressedGuide?.places?.map((place, index) => (
          <Marker
            coordinate={place?.coordinates}
            key={index}
            onPress={() => {
              setSelectedPlace(place);
            }}
          />
        ))}
      </MapView>
    </View>
  );
}

export default OverviewMapView;
