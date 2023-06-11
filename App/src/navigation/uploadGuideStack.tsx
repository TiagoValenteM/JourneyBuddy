import UploadGuideView from "../screens/uploadGuideStack/UploadGuide";
import { Text, TouchableOpacity, Alert } from "react-native";
import LocationPickerView from "../screens/common/LocationPicker";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Coordinate, Guide } from "../models/guides";
import { useAuthenticatedUser } from "../context/authenticatedUserContext";
import { checkGuide, handleCreateGuide } from "../services/ManageGuides";
import { useGuide } from "../context/GuideContext";
import { useError } from "../hooks/useError";
import { useLoading } from "../hooks/useLoading";

const Stack = createStackNavigator();

interface AddGuideStackProps {
  navigation: any;
}

function UploadGuideStack({ navigation }: AddGuideStackProps) {
  const { showError } = useError();
  const { startLoading, stopLoading } = useLoading();
  const { authenticatedUser, setAuthenticatedUser } = useAuthenticatedUser();
  const { guides, setGuides } = useGuide();
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
              onPress={async () => {
                if (checkGuide(guide, showError)) {
                  startLoading();
                  try {
                    await handleCreateGuide(
                      setAuthenticatedUser,
                      authenticatedUser,
                      guide,
                      guides,
                      setGuides,
                      showError
                    );
                    setGuide(new Guide(authenticatedUser));
                    stopLoading();
                    Alert.alert("Guide created successfully");
                  } catch (error) {
                    showError("Error creating guide.");
                  }
                }
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
          <UploadGuideView
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
          <LocationPickerView
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

export default UploadGuideStack;
