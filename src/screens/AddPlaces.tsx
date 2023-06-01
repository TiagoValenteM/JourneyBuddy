import React from "react";
import { TextInput, View, Text, ScrollView } from "react-native";
import MapView, { Marker } from "react-native-maps";
import debounce from "../utils/debouce";
import SelectLocationModal from "../components/modals/SelectLocationModal";
import { Coordinate } from "../models/guides";

interface LocationPickerProps {
  setModalVisible: any;
  setLocationList: any;
  markerCoordinate: Coordinate | undefined;
  setMarkerCoordinate: any;
  locationName: string;
  setLocationName: any;
}

interface AddPlacesScreenProps {
  markerCoordinate: Coordinate | undefined;
  setMarkerCoordinate: any;
  locationName: string;
  setLocationName: any;
}

const LocationPicker = ({
  setModalVisible,
  markerCoordinate,
  setMarkerCoordinate,
  setLocationList,
  locationName,
  setLocationName,
}: LocationPickerProps) => {
  const handlePlaceSearch = async (text: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${text}`
      );
      const locationData = await response.json();
      if (locationData?.length > 0) {
        setLocationList(locationData);
        setModalVisible(true);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getLocationName = async () => {
    if (markerCoordinate) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${markerCoordinate["latitude"]}&lon=${markerCoordinate["longitude"]}`
        );
        const locationData = await response.json();
        if (locationData?.display_name) {
          setLocationName(locationData?.display_name);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  React.useEffect(() => {
    debounce(getLocationName, 1000)();
  }, [markerCoordinate]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        marginTop: 25,
        width: "100%",
        height: 600,
      }}
    >
      <TextInput
        placeholder="Search"
        onChangeText={debounce(handlePlaceSearch, 1000)}
        style={{
          backgroundColor: "#dfe0e3",
          height: 40,
          textAlign: "auto",
          fontSize: 16,
          fontWeight: "500",
          width: "85%",
          borderRadius: 10,
          overflow: "hidden",
          maxWidth: "90%",
          textAlignVertical: "center",
          color: "#312f2f",
          paddingHorizontal: 10,
        }}
      />
      <Text
        style={{
          fontSize: 14,
          fontWeight: "400",
          color: "#312f2f",
          textAlign: "center",
          width: "85%",
          marginVertical: 30,
        }}
      >
        {locationName.slice(0, 70) + (locationName.length > 70 ? "..." : "")}
      </Text>
      <MapView
        style={{ borderRadius: 20, flex: 1, width: "85%" }}
        initialRegion={{
          latitude: 38.7223,
          longitude: -9.1393,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
        region={{
          latitude: markerCoordinate?.latitude || 38.7223,
          longitude: markerCoordinate?.longitude || -9.1393,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
        onPress={(e) =>
          setMarkerCoordinate(e.nativeEvent.coordinate as Coordinate)
        }
      >
        {markerCoordinate && <Marker coordinate={markerCoordinate} />}
      </MapView>
    </View>
  );
};

function AddPlacesScreen<StackScreenProps>({
  markerCoordinate,
  setMarkerCoordinate,
  locationName,
  setLocationName,
}: AddPlacesScreenProps) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [locationList, setLocationList] = React.useState<any>();

  return (
    <ScrollView>
      <LocationPicker
        setModalVisible={setModalVisible}
        setLocationList={setLocationList}
        markerCoordinate={markerCoordinate}
        setMarkerCoordinate={setMarkerCoordinate}
        locationName={locationName}
        setLocationName={setLocationName}
      />
      <SelectLocationModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        locationList={locationList}
        setLocationName={setLocationName}
        setMarkerCoordinate={setMarkerCoordinate}
      />
    </ScrollView>
  );
}

export default AddPlacesScreen;
