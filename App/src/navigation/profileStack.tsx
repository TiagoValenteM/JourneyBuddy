import React from "react";
import Feather from "react-native-vector-icons/Feather";
import { Alert, Text, TouchableOpacity } from "react-native";
import ProfileView from "../screens/common/Profile";
import UpdateProfileView from "../screens/common/UpdateProfile";
import { createStackNavigator } from "@react-navigation/stack";
import OverviewGuideView from "../screens/common/OverviewGuide";
import { Coordinate, Guide } from "../models/guides";
import OverviewMapView from "../screens/common/OverviewMap";
import UpdateGuideView from "../screens/common/UpdateGuide";
import LocationPickerView from "../screens/common/LocationPicker";
import { useGuide } from "../context/GuideContext";
import { useAuthenticatedUser } from "../context/authenticatedUserContext";
import { useCurrentUser } from "../context/currentUserContext";
import { checkGuide, handleUpdateGuide } from "../services/ManageGuides";
import FollowingTabs from "./FollowingTabs";
import { handleUpdateProfile } from "../database/userRepository";
import { useError } from "../hooks/useError";
import { useLoading } from "../hooks/useLoading";

const Stack = createStackNavigator();

interface ProfileStackProps {
  navigation: any;
}

function ProfileStack({ navigation }: ProfileStackProps) {
  const { showError } = useError();
  const { startLoading, stopLoading } = useLoading();
  const { setPressedGuide, pressedGuide, tempGuide, setTempGuide } = useGuide();
  const [modalVisible, setModalVisible] = React.useState(false);
  const { authenticatedUser, setAuthenticatedUser } = useAuthenticatedUser();
  const { currentUser, pressedUser, setPressedUser } = useCurrentUser();
  const [markerCoordinate, setMarkerCoordinate] = React.useState<Coordinate>();
  const [locationName, setLocationName] = React.useState(
    "Search for a location or tap on the map"
  );

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        options={() => ({
          headerRight: () => (
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Feather name={"menu"} size={25} />
            </TouchableOpacity>
          ),
          headerTitle: "",
          headerLeft: () => (
            <Text style={{ fontSize: 20, fontWeight: "600" }}>
              {authenticatedUser?.username}
            </Text>
          ),
          headerLeftContainerStyle: {
            paddingLeft: 20,
          },
          headerRightContainerStyle: {
            paddingRight: 20,
          },
        })}
      >
        {(props) => (
          <ProfileView
            {...props}
            isAuthUser={true}
            setModalVisible={setModalVisible}
            modalVisible={modalVisible}
          />
        )}
      </Stack.Screen>
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
        name={"GuideInDetail"}
        options={{
          headerTitle: "Guide",
        }}
        component={OverviewGuideView}
      />
      <Stack.Screen
        name={"MapOverview"}
        options={{
          headerShown: false,
        }}
      >
        {(props) => (
          <OverviewMapView {...props} guidePlaces={pressedGuide?.places} />
        )}
      </Stack.Screen>
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
                  if (checkGuide(tempGuide!, showError)) {
                    try {
                      startLoading();

                      await handleUpdateGuide(
                        setPressedGuide,
                        setTempGuide,
                        tempGuide!,
                        navigation,
                        showError
                      );

                      stopLoading();
                      Alert.alert("Guide updated successfully");
                      navigation.navigate("GuideInDetail");
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
        name={"FollowInteraction"}
        component={FollowingTabs}
        options={{
          headerTitle: currentUser?.username,
          headerStyle: {
            shadowColor: "transparent",
            elevation: 0,
          },
        }}
      />
    </Stack.Navigator>
  );
}

export default ProfileStack;
