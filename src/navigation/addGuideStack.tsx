import AddGuideScreen from "../screens/AddGuide";
import { Text, TouchableOpacity, Alert } from "react-native";
import AddPlacesScreen from "../screens/AddPlaces";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Coordinate, Guide } from "../models/guides";
import { useAuthenticatedUser } from "../context/authenticatedUserContext";
import { handleCreateGuide } from "../services/ManageGuides";
import { usePressedGuide } from "../context/pressedGuideContext";

const Stack = createStackNavigator();

interface AddGuideStackProps {
  navigation: any;
}

function AddGuideStack({ navigation }: AddGuideStackProps) {
  const { authenticatedUser, setAuthenticatedUser } = useAuthenticatedUser();
  const { guides, setGuides } = usePressedGuide();
  const [markerCoordinate, setMarkerCoordinate] = React.useState<Coordinate>();
  const [locationName, setLocationName] = React.useState(
    "Search for a location or tap on the map"
  );
  const [refreshing, setRefreshing] = React.useState(false);
  const [guide, setGuide] = React.useState<Guide>(new Guide(authenticatedUser));

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Add Guide Page"
        options={{
          headerTitle: "New Guide",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                handleCreateGuide(
                  setAuthenticatedUser,
                  authenticatedUser,
                  guide,
                  guides,
                  setGuides
                );
              }}
            >
              <Text
                style={{
                  color: "#007AFF",
                  fontSize: 18,
                  fontWeight: "400",
                  paddingRight: 15,
                }}
              >
                Share
              </Text>
            </TouchableOpacity>
          ),
        }}
      >
        {(props) => (
          <AddGuideScreen
            {...props}
            authenticatedUser={authenticatedUser}
            navigation={navigation}
            refreshing={refreshing}
            setRefreshing={setRefreshing}
            currentGuide={guide}
            updateGuideCallback={setGuide}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name={"Add places"}
        options={{
          gestureEnabled: false,
          headerTitle: "Select Location",
          headerBackTitle: "Cancel",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                if (markerCoordinate && locationName?.length > 0) {
                  const newPlace = {
                    name: locationName,
                    coordinates: {
                      latitude: markerCoordinate.latitude,
                      longitude: markerCoordinate.longitude,
                    },
                  };

                  const newPlaces = guide?.places
                    ? [...guide.places, newPlace]
                    : [newPlace];
                  setGuide({ ...guide, places: newPlaces });

                  navigation.navigate("Add Guide Page");
                } else {
                  Alert.alert("Please select a location");
                }
                setLocationName("");
                setMarkerCoordinate(undefined);
              }}
            >
              <Text
                style={{
                  color: "#007AFF",
                  fontSize: 18,
                  fontWeight: "400",
                  paddingRight: 15,
                }}
              >
                Save
              </Text>
            </TouchableOpacity>
          ),
        }}
      >
        {(props) => (
          <AddPlacesScreen
            {...props}
            markerCoordinate={markerCoordinate}
            setMarkerCoordinate={setMarkerCoordinate}
            locationName={
              locationName?.length > 0
                ? locationName
                : "Search for a location or tap on the map"
            }
            setLocationName={setLocationName}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default AddGuideStack;
