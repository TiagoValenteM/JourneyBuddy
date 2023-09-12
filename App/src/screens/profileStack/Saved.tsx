import React from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useAuthenticatedUser } from "../../context/authenticatedUserContext";
import MapView, { Marker } from "react-native-maps";
import CachedImage from "../../components/images/CachedImage";
import { Guide, Place } from "../../models/guides";
import { getSavedGuides } from "../../services/ManageGuides";
import { Feather } from "@expo/vector-icons";

interface SavedViewProps {
  navigation: any;
}

const columnWidth = Dimensions.get("window").width / 2 - 30;

const SavedView = ({ navigation }: SavedViewProps) => {
  const { authenticatedUser } = useAuthenticatedUser();
  const [savedGuides, setSavedGuides] = React.useState([] as Guide[]);
  const [savedPlaces, setSavedPlaces] = React.useState([] as Place[]);
  const initialRegion = {
    latitude: savedPlaces[0]?.coordinates?.latitude || 38.7223,
    longitude: savedPlaces[0]?.coordinates?.longitude || -9.1393,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  React.useEffect(() => {
    if (
      authenticatedUser?.savedGuides &&
      authenticatedUser?.savedGuides.length > 0
    ) {
      getSavedGuides(authenticatedUser.savedGuides).then((savedGuides) =>
        setSavedGuides(savedGuides)
      );
    }
    if (
      authenticatedUser?.savedPlaces &&
      authenticatedUser?.savedPlaces.length > 0
    ) {
      setSavedPlaces(authenticatedUser?.savedPlaces);
    }
  }, [authenticatedUser?.savedGuides, authenticatedUser?.savedPlaces]);

  return (
    <View style={styles.container}>
      {savedGuides.length > 0 || savedPlaces.length > 0 ? (
        <>
          {savedGuides.length > 0 ? (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("SavedGuidesMap", { guides: savedGuides })
              }
              style={styles.itemContainer}
            >
              <View style={styles.imageContainer}>
                <CachedImage
                  source={{ uri: savedGuides[0]?.pictures[0] }}
                  style={styles.image}
                />
              </View>
              <Text style={styles.title}>Guides</Text>
            </TouchableOpacity>
          ) : null}

          {savedPlaces.length > 0 ? (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("MapOverview", {
                  places: savedPlaces,
                })
              }
              style={styles.itemContainer}
            >
              <MapView
                style={styles.map}
                initialRegion={initialRegion}
                cacheEnabled={true}
              >
                <Marker coordinate={savedPlaces[0]?.coordinates}>
                  <Feather name={"map-pin"} size={25} color={"#007AFF"} />
                </Marker>
              </MapView>
              <Text style={styles.title}>Places</Text>
            </TouchableOpacity>
          ) : null}
        </>
      ) : (
        <View style={styles.noDataContainer}>
          <View style={styles.noDataTextContainer}>
            <Text style={styles.noDataText}>Try saving a place or a guide</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
    marginHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  itemContainer: {
    alignItems: "center",
  },
  imageContainer: {
    marginBottom: 10,
    width: columnWidth,
    height: columnWidth * 1.25,
    backgroundColor: "#dfe0e3",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 1,
      height: 3,
    },
    elevation: 3,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  map: {
    marginBottom: 10,
    width: columnWidth,
    height: columnWidth * 1.25,
    backgroundColor: "#dfe0e3",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 1,
      height: 3,
    },
    elevation: 3,
  },
  marker: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },
  title: {
    fontWeight: "500",
    fontSize: 20,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
  },
  noDataTextContainer: {
    flexDirection: "column",
    backgroundColor: "#dfe0e3",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },
  noDataText: {
    textAlign: "center",
  },
});

export default SavedView;
