import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import debounce from "../../utils/debounce";
import { Coordinate, Place } from "../../models/guides";
import { useError } from "../../hooks/useError";
import Colors from "../../../styles/colorScheme";
import { ArrowLeft, MapPin } from "react-native-feather";
import {
  getLocationCoordinates,
  getLocationName,
} from "../../database/placeRepository/placesRepository";
import PlaceSearchBottomSheet from "../../components/bottomsheets/PlaceSearchBottomSheet";

interface NewPlaceProps {
  navigation: any;
  setPlaces: React.Dispatch<React.SetStateAction<Place[]>>;
}

function PlacePickerMap({ navigation, setPlaces }: NewPlaceProps) {
  const [markerCoordinate, setMarkerCoordinate] = React.useState<Coordinate>();
  const [selectedPlace, setSelectedPlace] = React.useState<string | undefined>(
    undefined
  );
  const [locationList, setLocationList] = React.useState<Place[]>();
  const { showError } = useError();
  const [loading, setLoading] = React.useState(false);

  const handlePlaceSearch = async (text: string) => {
    setLoading(true);
    getLocationCoordinates(text, showError)
      .then((coordinates) => {
        setLocationList(coordinates);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const updateLocationName = debounce((coordinates) => {
    getLocationName(coordinates, showError).then((place) => {
      if (place) {
        setSelectedPlace(place.name);
      } else {
        setSelectedPlace(undefined);
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
        <View style={styles.textInputContainer}>
          <TextInput
            placeholder="Search"
            onChangeText={debounce(handlePlaceSearch, 1000)}
            numberOfLines={1}
            style={styles.textInput}
          />
          {loading && (
            <ActivityIndicator
              style={styles.activityIndicator}
              color={Colors.gray}
            />
          )}
        </View>
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
              height={28}
              color={Colors.blue}
              strokeWidth={3}
            />
          </Marker>
        )}
      </MapView>
      <PlaceSearchBottomSheet
        navigation={navigation}
        setPlaces={setPlaces}
        selectedPlace={selectedPlace}
        placesArray={locationList}
        markerCoordinate={markerCoordinate}
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
    backgroundColor: Colors.white,
    borderRadius: 50,
    padding: 11,
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    elevation: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    color: Colors.darkGray,
    fontWeight: "bold",
    fontSize: 14,
  },
  textInputContainer: {
    backgroundColor: Colors.white,
    borderRadius: 13,
    padding: 13,
    marginVertical: 5,
    width: "80%",
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  activityIndicator: {
    width: 8,
    height: 8,
    marginHorizontal: 5,
  },
});
