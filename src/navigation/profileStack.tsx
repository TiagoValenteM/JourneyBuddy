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
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { uploadMultiplePictures } from "../services/ImageUpload";

const Stack = createStackNavigator();

interface ProfileStackProps {
  route: any;
  navigation: any;
}

function ProfileStack({ route, navigation }: ProfileStackProps) {
  const { setPressedGuide, pressedGuide } = usePressedGuide();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [guides, setGuides] = React.useState<Guide[]>([]);
  const authenticatedUser = route.params?.userParam?.authenticatedUser;
  const currentUser = route.params?.userParam?.currentUser;
  const [markerCoordinate, setMarkerCoordinate] = React.useState<Coordinate>();
  const [locationName, setLocationName] = React.useState(
    "Search for a location or tap on the map"
  );

  const handleUpdateGuide = () => {
    // 1 - Upload guide
    if (pressedGuide?.uid) {
      console.log(pressedGuide);
      const guideRef = doc(db, "guides", pressedGuide.uid);
      updateDoc(guideRef, { ...pressedGuide })
        .then(async () => {
          // 2 - Upload pictures
          console.log("UPDATED GUIDE, NOW PICTURES...");
          if (pressedGuide?.pictures?.length > 0) {
            try {
              const imagesUrl = await Promise.all(
                pressedGuide?.pictures?.map(
                  async (picture) =>
                    await uploadMultiplePictures(pressedGuide?.uid, picture)
                )
              ).catch((error) => {
                console.log(error);
                Alert.alert("Error updating guide");
              });

              console.log("UPDATED PICTURES, NOW GUIDE AGAIN...");

              // 3 - Update guide with pictures url
              await updateDoc(guideRef, {
                pictures: imagesUrl,
              });

              console.log("UPDATED GUIDE FINALLY...");

              Alert.alert("Guide updated successfully");
              navigation.navigate("ProfilePage");
            } catch (error) {
              console.log(error);
              Alert.alert("Error updating guide");
            }
          }
        })
        .catch((error) => {
          console.log(error);
          Alert.alert("Error updating guide");
        });
    }
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfilePage"
        options={() => ({
          headerRight: (props) => (
            <Feather
              name={"menu"}
              onPress={() => setModalVisible(true)}
              size={25}
            />
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
            screenProps={{ modalVisible, setModalVisible }}
            currentUser={currentUser}
            refreshing={refreshing}
            setRefreshing={setRefreshing}
            guides={guides}
            setGuides={setGuides}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name={"Edit Profile"}
        options={{
          gestureEnabled: false,
          cardStyleInterpolator: ({ current }) => ({
            cardStyle: {
              opacity: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
                extrapolate: "clamp",
              }),
              transform: [
                {
                  translateY: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1000, 0],
                    extrapolate: "clamp",
                  }),
                },
              ],
            },
          }),
          transitionSpec: {
            open: {
              animation: "timing",
              config: {
                duration: 300, // Adjust the duration as desired
              },
            },
            close: {
              animation: "timing",
              config: {
                duration: 300, // Adjust the duration as desired
              },
            },
          },
        }}
      >
        {(props) => <EditProfileScreen {...props} currentUser={currentUser} />}
      </Stack.Screen>
      <Stack.Screen
        name={"GuideInDetail"}
        options={{
          headerTitle: "Guide",
        }}
      >
        {(props) => (
          <GuideInDetailScreen
            {...props}
            authenticatedUser={authenticatedUser}
            setRefreshing={setRefreshing}
            refreshing={refreshing}
          />
        )}
      </Stack.Screen>
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
                onPress={handleUpdateGuide}
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
            authenticatedUser={authenticatedUser}
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
      <Stack.Screen name={"Followers"} component={FollowersScreen} />
      <Stack.Screen name={"Following"} component={FollowingScreen} />
    </Stack.Navigator>
  );
}

export default ProfileStack;
