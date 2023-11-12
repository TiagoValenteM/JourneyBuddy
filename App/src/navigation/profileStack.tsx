import React from "react";
import { Alert, Text, TouchableOpacity } from "react-native";
import ProfileView from "../screens/common/Profile";
import UpdateProfileView from "../screens/common/UpdateProfile";
import { createStackNavigator } from "@react-navigation/stack";
import OverviewGuideView from "../screens/common/OverviewGuide";
import { Coordinate, Guide } from "../models/guides";
import OverviewMapView from "../screens/common/OverviewMap";
import UpdateGuideView from "../screens/common/UpdateGuide";
import LocationPickerView from "../screens/common/PlacePickerMap";
import { useGuide } from "../context/GuideContext";
import { useAuthenticatedUser } from "../context/authenticatedUserContext";
import { useCurrentUser } from "../context/currentUserContext";
import { checkGuideFields, handleUpdateGuide } from "../services/ManageGuides";
import { handleUpdateProfile } from "../database/userRepository/userRepository";
import { useError } from "../hooks/useError";
import { useLoading } from "../hooks/useLoading";
import Saved from "../screens/profileStack/Saved";
import SavedGuides from "../screens/profileStack/SavedGuidesMap";
import SavedGuidesGrid from "../screens/profileStack/SavedGuidesGrid";
import Colors from "../../styles/colorScheme";
import UserProfile from "../models/userProfiles";

const Stack = createStackNavigator();

interface ProfileStackProps {
  navigation: any;
}

function ProfileStack({ navigation }: ProfileStackProps) {
  const { showError } = useError();
  const { startLoading, stopLoading } = useLoading();
  const { setPressedGuide, tempGuide, setTempGuide, guides, setGuides } =
    useGuide();
  const [user, setUser] = React.useState<UserProfile>();
  const { authenticatedUser, setAuthenticatedUser } = useAuthenticatedUser();
  const { currentUser, pressedUser, setPressedUser } = useCurrentUser();
  const [markerCoordinate, setMarkerCoordinate] = React.useState<Coordinate>();
  const [locationName, setLocationName] = React.useState(
    "Search for a location or tap on the map"
  );

  return (
    <Stack.Navigator
      screenOptions={{ cardStyle: { backgroundColor: Colors.white } }}
    >
      <Stack.Screen
        name="Profile"
        initialParams={{ user: authenticatedUser }}
        options={() => ({
          headerShown: false,
        })}
        component={ProfileView}
      />
      <Stack.Screen
        name={"Edit Profile"}
        options={{
          gestureEnabled: false,
          headerBackTitle: "Cancel",
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                handleUpdateProfile(
                  authenticatedUser,
                  pressedUser,
                  setAuthenticatedUser,
                  setPressedUser
                ).then(() => navigation.navigate("Profile"))
              }
            >
              <Text
                style={{
                  color: "#007AFF",
                  fontSize: 18,
                  fontWeight: "400",
                  paddingRight: 15,
                }}
              >
                Done
              </Text>
            </TouchableOpacity>
          ),
        }}
        component={UpdateProfileView}
      />
      <Stack.Screen
        name={"OverviewGuide"}
        options={{
          headerShown: false,
        }}
        component={OverviewGuideView}
      />
      <Stack.Screen
        name={"MapOverview"}
        options={{
          headerShown: false,
        }}
        component={OverviewMapView}
      />
      <Stack.Screen
        name={"EditGuideScreen"}
        options={{
          gestureEnabled: false,
          headerTitle: "Edit Info",
          headerBackTitle: "Cancel",
          headerRight: () => (
            <TouchableOpacity>
              <Text
                style={{
                  color: "#007AFF",
                  fontSize: 18,
                  fontWeight: "400",
                  paddingRight: 15,
                }}
                onPress={async () => {
                  if (checkGuideFields(tempGuide!, showError)) {
                    try {
                      startLoading();

                      await handleUpdateGuide(
                        setPressedGuide,
                        setTempGuide,
                        tempGuide!,
                        navigation,
                        showError,
                        guides,
                        setGuides
                      );

                      stopLoading();
                      Alert.alert("Guide updated successfully");
                      navigation.navigate("OverviewGuide");
                    } catch (error) {
                      showError("Error updating guide.");
                      stopLoading();
                    }
                  }
                }}
              >
                Done
              </Text>
            </TouchableOpacity>
          ),
        }}
        component={UpdateGuideView}
      />
      <Stack.Screen
        name={"EditPlaces"}
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

                  const newPlaces = tempGuide?.places
                    ? [...tempGuide.places, newPlace]
                    : [newPlace];
                  setTempGuide({
                    ...tempGuide,
                    places: newPlaces,
                  } as Guide);

                  navigation.navigate("EditGuideScreen");
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
      <Stack.Screen
        name={"Saved"}
        component={Saved}
        options={() => ({
          headerShown: false,
        })}
      />
      <Stack.Screen
        name={"SavedGuidesMap"}
        component={SavedGuides}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={"SavedGuidesGrid"}
        component={SavedGuidesGrid}
        options={() => ({
          headerShown: false,
        })}
      />
    </Stack.Navigator>
  );
}

export default ProfileStack;
