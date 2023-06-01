import React from "react";
import Feather from "react-native-vector-icons/Feather";
import { Alert, Text, TouchableOpacity } from "react-native";
import ProfileScreen from "../screens/Profile";
import EditProfileScreen from "../screens/EditProfile";
import FollowersScreen from "../screens/Followers";
import FollowingScreen from "../screens/Following";
import { createStackNavigator } from "@react-navigation/stack";
import GuideInDetailScreen from "../screens/GuideInDetail";
import { Coordinate, Guide } from "../models/guides";
import FullScreenMap from "../screens/FullScreenMap";
import EditGuideScreen from "../screens/EditGuideScreen";
import AddPlacesScreen from "../screens/AddPlaces";
import { usePressedGuide } from "../context/pressedGuideContext";
import { useAuthenticatedUser } from "../context/authenticatedUserContext";
import { useCurrentUser } from "../context/currentUserContext";
import { handleUpdateGuide } from "../services/ManageGuides";
import FollowingTabs from "../components/FollowingTabs";

const Stack = createStackNavigator();

interface ProfileStackProps {
  navigation: any;
}

function ProfileStack({ navigation }: ProfileStackProps) {
  const { setPressedGuide, pressedGuide } = usePressedGuide();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const { authenticatedUser } = useAuthenticatedUser();
  const { currentUser } = useCurrentUser();
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
              {currentUser?.username || currentUser?.email}
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
          <ProfileScreen
            {...props}
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            isAuthUser={true}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name={"Edit Profile"}
        options={{
          gestureEnabled: false,
          headerBackTitle: "Cancel",
          headerRight: () => (
            <TouchableOpacity onPress={() => {}}>
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
      >
        {(props) => <EditProfileScreen {...props} currentUser={currentUser} />}
      </Stack.Screen>
      <Stack.Screen
        name={"GuideInDetail"}
        options={{
          headerTitle: "Guide",
        }}
        component={GuideInDetailScreen}
      />
      <Stack.Screen
        name={"FullScreenMap"}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        {(props) => (
          <FullScreenMap {...props} guidePlaces={pressedGuide?.places} />
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
                onPress={() =>
                  handleUpdateGuide(setPressedGuide, pressedGuide!, navigation)
                }
              >
                Done
              </Text>
            </TouchableOpacity>
          ),
        }}
      >
        {(props) => (
          <EditGuideScreen
            {...props}
            navigation={navigation}
            authenticatedUser={authenticatedUser!!}
            setRefreshing={setRefreshing}
            refreshing={refreshing}
            currentGuide={pressedGuide!!}
            updateGuideCallback={setPressedGuide}
          />
        )}
      </Stack.Screen>
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

                  const newPlaces = pressedGuide?.places
                    ? [...pressedGuide.places, newPlace]
                    : [newPlace];
                  setPressedGuide({
                    ...pressedGuide,
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
