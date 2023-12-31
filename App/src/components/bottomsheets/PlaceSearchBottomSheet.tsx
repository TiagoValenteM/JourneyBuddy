import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import React, { useRef, useState } from "react";
import { Coordinate, Place } from "../../models/guides";
import { Map, PlusCircle } from "react-native-feather";
import Colors from "../../../styles/colorScheme";

interface SelectLocationModalProps {
  navigation: any;
  placesArray: Place[] | undefined;
  markerCoordinate: Coordinate | undefined;
  selectedPlace: string | undefined;
  setPlaces: React.Dispatch<React.SetStateAction<Place[]>>;
}

const DEFAULT_SNAP_POINT = "10%";
const SELECTED_PLACE_SNAP_POINT = "25%";
const SEARCH_RESULTS_SNAP_POINT = "60%";

const PlaceSearchBottomSheet = ({
  navigation,
  selectedPlace,
  placesArray,
  markerCoordinate,
  setPlaces,
}: SelectLocationModalProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [snapPoints, setSnapPoints] = useState([DEFAULT_SNAP_POINT]);
  const searchResults = placesArray;

  React.useEffect(() => {
    if (!selectedPlace && !searchResults) {
      setSnapPoints([DEFAULT_SNAP_POINT]);
    } else {
      setSnapPoints([
        DEFAULT_SNAP_POINT,
        SELECTED_PLACE_SNAP_POINT,
        SEARCH_RESULTS_SNAP_POINT,
      ]);
    }

    if (searchResults) {
      bottomSheetRef.current?.snapToPosition(SEARCH_RESULTS_SNAP_POINT);
    } else if (selectedPlace) {
      bottomSheetRef.current?.snapToPosition(SELECTED_PLACE_SNAP_POINT);
    }
  }, [searchResults, selectedPlace]);

  const handleAddPlace = (
    place?: Place,
    markerCoordinate?: Coordinate,
    selectedPlace?: string
  ) => {
    let newPlace: Place | undefined;

    if (markerCoordinate && selectedPlace) {
      newPlace = {
        name: selectedPlace,
        coordinates: { ...markerCoordinate },
      };
    } else if (place) {
      newPlace = {
        name: place?.name,
        coordinates: { ...place?.coordinates },
      };
    }

    if (newPlace) {
      setPlaces((prevPlaces) =>
        prevPlaces ? [...prevPlaces, newPlace!] : [newPlace!]
      );
    } else {
      Alert.alert("Please select a location");
    }
  };

  const keyExtractor = (item: Place, index: number) => index.toString();

  const renderResultsList = ({ item }: { item: Place }) => (
    <View style={styles.containerRow}>
      <View style={styles.container}>
        <Text style={styles.placeName} numberOfLines={1} ellipsizeMode="tail">
          {item.name}
        </Text>
        <View style={styles.coordinatesContainer}>
          <Map width={18} height={18} color={"#007AFF"} />
          <Text style={styles.coordinates}>
            ({item.coordinates?.latitude.toString().slice(0, 8)},{" "}
            {item.coordinates?.longitude.toString().slice(0, 8)})
          </Text>
        </View>
      </View>

      <View style={styles.unsavedContainer}>
        <TouchableOpacity
          onPress={() => {
            handleAddPlace(item);
            navigation.navigate("NewGuide");
          }}
          style={styles.saveButton}
        >
          <PlusCircle width={30} height={30} color={Colors.blue} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const RenderSelectedPlace = () => (
    <View style={styles.bottomSheetScrollView}>
      <Text style={styles.title}>Selected Place</Text>
      <Animated.View style={styles.containerRow}>
        <View style={styles.container}>
          <Text style={styles.placeName}>{selectedPlace}</Text>
        </View>
        <View style={styles.unsavedContainer}>
          <TouchableOpacity
            onPress={() => {
              handleAddPlace(undefined, markerCoordinate, selectedPlace);
              navigation.navigate("NewGuide");
            }}
            style={styles.saveButton}
          >
            <PlusCircle width={30} height={30} color={Colors.blue} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );

  return (
    <BottomSheet
      style={styles.bottomSheet}
      keyboardBehavior={"interactive"}
      snapPoints={snapPoints}
      ref={bottomSheetRef}
      backgroundStyle={styles.bottomSheet}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <Text style={[styles.subtitle, styles.bottomSheetScrollView]}>
        Search for a place or tap the map
      </Text>
      {selectedPlace && <RenderSelectedPlace />}
      {searchResults && (
        <BottomSheetFlatList<Place>
          style={styles.bottomSheetScrollView}
          data={searchResults}
          renderItem={renderResultsList}
          keyExtractor={keyExtractor}
          ListHeaderComponent={() => (
            <Text style={styles.title}>Search Results</Text>
          )}
        />
      )}
    </BottomSheet>
  );
};

export default PlaceSearchBottomSheet;

const styles = StyleSheet.create({
  bottomSheetScrollView: {
    paddingHorizontal: 20,
    paddingVertical: 7,
  },
  bottomSheet: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "white",
  },
  handleIndicator: {
    width: 50,
    height: 5,
    backgroundColor: "#dfe0e3",
    alignSelf: "center",
    marginVertical: 10,
    borderRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: Colors.black,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: Colors.gray,
  },
  container: {
    alignItems: "flex-start",
    justifyContent: "space-between",
    maxWidth: "80%",
  },
  containerRow: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    borderBottomWidth: 2,
    borderBottomColor: Colors.lightGray,
    width: "100%",
    marginVertical: 10,
  },
  placeName: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.darkGray,
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
