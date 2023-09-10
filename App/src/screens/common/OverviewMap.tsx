import MapView, { Marker } from "react-native-maps";
import React from "react";
import { Place } from "../../models/guides";
import { Pressable, View } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import SavedModal from "../../components/modals/SavedModal";
import { useGuide } from "../../context/GuideContext";

interface OverviewMapProps {
  navigation: any;
  route: any;
}
function OverviewMapView({ navigation, route }: OverviewMapProps) {
  const { places, title } = route.params as { places: Place[]; title: string };
  const { selectedPlace, setSelectedPlace } = useGuide();
  const initialRegion = {
    latitude: places?.[0]?.coordinates?.latitude || 38.7223,
    longitude: places?.[0]?.coordinates?.longitude || -9.1393,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  React.useEffect(() => {
    return () => {
      setSelectedPlace(null);
    };
  }, []);

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
      </View>

      <MapView.Animated
        style={{ width: "100%", height: "100%" }}
        initialRegion={initialRegion}
        region={
          selectedPlace
            ? { ...initialRegion, ...selectedPlace.coordinates }
            : initialRegion
        }
      >
        {places?.map((place, index) => (
          <Marker
            coordinate={place?.coordinates}
            key={index}
            onPress={() => {
              setSelectedPlace(place);
            }}
          />
        ))}
      </MapView.Animated>
      <SavedModal places={places} title={title} />
    </View>
  );
}

export default OverviewMapView;
