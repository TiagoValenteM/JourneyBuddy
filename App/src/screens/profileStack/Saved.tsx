import React, { useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useAuthenticatedUser } from "../../context/authenticatedUserContext";
import MapView, { Marker } from "react-native-maps";
import CachedImage from "../../components/images/CachedImage";
import { Guide, Place } from "../../models/guides";
import { getSavedGuides } from "../../services/ManageGuides";
import { MapPin, PlusCircle } from "react-native-feather";
import Header from "../../components/headers/Header";
import Colors from "../../../styles/colorScheme";
import { LinearGradient } from "expo-linear-gradient";
import MissingWarning from "../../components/warnings/MissingWarning";

const screenWidth = Dimensions.get("window").width;
const itemWidth = screenWidth / 2 - 20;

interface SavedViewProps {
  navigation: any;
}

const SavedView = ({ navigation }: SavedViewProps) => {
  const { authenticatedUser } = useAuthenticatedUser();
  const [refreshing, setRefreshing] = React.useState(false);
  const [savedGuides, setSavedGuides] = React.useState([] as Guide[]);
  const [savedPlaces, setSavedPlaces] = React.useState([] as Place[]);
  const initialRegion = {
    latitude: savedPlaces[0]?.coordinates?.latitude || 38.7223,
    longitude: savedPlaces[0]?.coordinates?.longitude || -9.1393,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  const onRefresh = () => {
    setRefreshing(true);
    if (authenticatedUser) {
      getSavedGuides(authenticatedUser.savedGuides).then((savedGuides) =>
        setSavedGuides(savedGuides)
      );
      setSavedPlaces(authenticatedUser.savedPlaces);
    }

    setRefreshing(false);
  };

  useEffect(() => {
    if (authenticatedUser) {
      getSavedGuides(authenticatedUser.savedGuides).then((savedGuides) =>
        setSavedGuides(savedGuides)
      );
      setSavedPlaces(authenticatedUser?.savedPlaces);
    }
  }, [authenticatedUser?.savedGuides, authenticatedUser?.savedPlaces]);

  const Guides = () => {
    return (
      <View style={styles.gridItem}>
        <Pressable
          onPress={() =>
            navigation.navigate("SavedGuidesMap", {
              guides: savedGuides,
            })
          }
        >
          <CachedImage
            source={{ uri: savedGuides[0]?.pictures[0] }}
            style={styles.image}
          />
        </Pressable>
        <View style={styles.titleContainer}>
          <Text style={styles.title} ellipsizeMode={"tail"} numberOfLines={1}>
            Guides
          </Text>
        </View>
      </View>
    );
  };

  const Places = () => {
    return (
      <View style={styles.gridItem}>
        <MapView
          style={styles.image}
          initialRegion={initialRegion}
          cacheEnabled={true}
          onPress={() =>
            navigation.navigate("MapOverview", {
              places: savedPlaces,
            })
          }
        >
          <Marker coordinate={savedPlaces[0]?.coordinates}>
            <MapPin
              width={25}
              height={25}
              color={Colors.blue}
              strokeWidth={3}
            />
          </Marker>
        </MapView>
        <View style={styles.titleContainer}>
          <Text style={styles.title} ellipsizeMode={"tail"} numberOfLines={1}>
            Places
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        title={"Saved"}
        options={false}
        backButton={true}
        navigation={navigation}
      />
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.gridContainer}>
          {savedGuides.length > 0 && <Guides />}
          {savedPlaces.length > 0 && <Places />}
          {savedGuides.length === 0 && savedPlaces.length === 0 && (
            <MissingWarning text={"No saved items yet."} />
          )}
        </View>
        <Text style={styles.collectionsText}>Collections</Text>
        <TouchableOpacity style={styles.gridContainer}>
          <LinearGradient
            colors={[Colors.blue, Colors.lightBlue, Colors.lightGray]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.75, y: 1 }}
            style={[styles.gridItem, styles.gridItemCentered]}
          >
            <PlusCircle
              width={28}
              height={28}
              color={Colors.lightGray}
              style={{
                marginBottom: 30,
              }}
            />
            <View style={styles.titleContainer}>
              <Text
                style={styles.title}
                ellipsizeMode={"tail"}
                numberOfLines={1}
              >
                Add a collection...
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: { flex: 1, paddingHorizontal: 15 },
  gridContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    marginVertical: 5,
    width: itemWidth,
    height: itemWidth * 1.25,
    borderRadius: 10,
    overflow: "hidden",
  },
  gridItemCentered: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  titleContainer: {
    position: "absolute",
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    bottom: 0,
    right: 0,
    left: 0,
    height: 45,
    justifyContent: "center",
    paddingHorizontal: 10,
    backgroundColor: Colors.lightGray,
  },
  title: {
    fontWeight: "bold",
    color: Colors.darkGray,
    fontSize: 16,
    alignItems: "center",
  },
  collectionsText: {
    fontWeight: "bold",
    fontSize: 22,
    color: Colors.black,
    marginVertical: 20,
  },
});

export default SavedView;
