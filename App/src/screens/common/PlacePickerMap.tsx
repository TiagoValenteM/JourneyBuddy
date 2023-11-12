import React, { useEffect } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import debounce from "../../utils/debounce";
import { Coordinate, Place } from "../../models/guides";
import { useError } from "../../hooks/useError";
import Colors from "../../../styles/colorScheme";
import { ArrowLeft, MapPin, Plus } from "react-native-feather";
import {
  getLocationCoordinates,
  getLocationName,
} from "../../database/placeRepository/placesRepository";
import PlaceSearchBottomsheet from "../../components/bottomsheets/PlaceSearchBottomsheet";

interface NewPlaceProps {
  navigation: any;
  setPlaces: React.Dispatch<React.SetStateAction<Place[]>>;
}

function PlacePickerMap({ navigation, setPlaces }: NewPlaceProps) {
  const [markerCoordinate, setMarkerCoordinate] = React.useState<Coordinate>();
  const [locationName, setLocationName] = React.useState(
    "Search for a place or tap the map"
  );
  const [modalVisible, setModalVisible] = React.useState(false);
  const [locationList, setLocationList] = React.useState<Place[]>();
  const { showError } = useError();

  const handlePlaceSearch = async (text: string) => {
    setModalVisible(false);
    getLocationCoordinates(text, showError).then((coordinates) => {
      setLocationList(coordinates);
      setModalVisible(true);
    });
  };

  const updateLocationName = debounce((coordinates) => {
    getLocationName(coordinates).then((place) => {
      if (place) {
        setLocationName(place.name);
      }
    });
  }, 1000);

  useEffect(() => {
    if (markerCoordinate) {
      updateLocationName(markerCoordinate);
    }
  }, [markerCoordinate]);

  const Header = () => {
    return (
      <View style={[styles.container, { top: 0 }]}>
        <Pressable
          onPress={() => {
            navigation.navigate("NewGuide");
          }}
          style={styles.backButton}
        >
          <ArrowLeft width={25} height={25} color={Colors.blue} />
        </Pressable>
        <TextInput
          placeholder="Search"
          onChangeText={debounce(handlePlaceSearch, 1000)}
          numberOfLines={1}
          style={styles.textInput}
        />
      </View>
    );
  };

  const Footer = () => {
    return (
      <View style={[styles.container, { bottom: 0 }]}>
        <View style={styles.textContainer}>
          <Text style={styles.text} numberOfLines={1} ellipsizeMode={"tail"}>
            {locationName}
          </Text>
        </View>

        <Pressable
          onPress={() => {
            if (markerCoordinate && locationName?.length > 0) {
              const place = {
                name: locationName,
                coordinates: {
                  latitude: markerCoordinate.latitude,
                  longitude: markerCoordinate.longitude,
                },
              };

              setPlaces((prevPlaces) =>
                prevPlaces ? [...prevPlaces, place] : [place]
              );

              navigation.navigate("NewGuide");
            } else {
              Alert.alert("Please select a location");
            }
            setLocationName("");
            setMarkerCoordinate(undefined);
          }}
          style={styles.backButton}
        >
          <Plus width={25} height={25} color={Colors.blue} />
        </Pressable>
      </View>
    );
  };

  return (
    <>
      <SafeAreaView style={[styles.safeAreaView, { top: 0 }]}>
        <Header />
      </SafeAreaView>
      <MapView
        style={styles.mapContainer}
        initialRegion={{
          latitude: 38.7223,
          longitude: -9.1393,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
        onPress={(e) =>
          setMarkerCoordinate(e.nativeEvent.coordinate as Coordinate)
        }
      >
        {markerCoordinate && (
          <Marker coordinate={markerCoordinate}>
            <MapPin
              width={25}
              height={25}
              color={Colors.blue}
              strokeWidth={3}
            />
          </Marker>
        )}
      </MapView>
      <SafeAreaView style={[styles.safeAreaView, { bottom: 0 }]}>
        <Footer />
      </SafeAreaView>
      <PlaceSearchBottomsheet
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        placesArray={locationList}
        setLocationName={setLocationName}
        setMarkerCoordinate={setMarkerCoordinate}
      />
    </>
  );
}

export default PlacePickerMap;

const styles = StyleSheet.create({
  safeAreaView: {
    zIndex: 1,
    position: "absolute",
    width: "100%",
  },
  mapContainer: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 0,
  },
  container: {
    marginVertical: 10,
    flexDirection: "row",
    paddingHorizontal: 15,
    width: "100%",
    zIndex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    backgroundColor: Colors.lightGray,
    borderRadius: 50,
    padding: 10,
    shadowColor: Colors.black,
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 1,
      height: 3,
    },
    elevation: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    color: Colors.darkGray,
    backgroundColor: Colors.lightGray,
    borderRadius: 10,
    padding: 12,
    marginVertical: 5,
    width: "80%",
    fontWeight: "bold",
    fontSize: 14,
    shadowColor: Colors.black,
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 1,
      height: 3,
    },
    elevation: 3,
  },
  text: {
    color: Colors.darkGray,
    fontWeight: "bold",
    fontSize: 14,
  },
  textContainer: {
    backgroundColor: Colors.lightGray,
    borderRadius: 10,
    padding: 12,
    marginVertical: 5,
    width: "80%",
    shadowColor: Colors.black,
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 1,
      height: 3,
    },
    elevation: 3,
  },
});
