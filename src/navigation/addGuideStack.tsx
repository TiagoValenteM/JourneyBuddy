import AddGuideScreen from "../screens/AddGuide";
import { Text, TouchableOpacity, Alert } from "react-native";
import AddPlacesScreen from "../screens/AddPlaces";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Coordinate, Guide, Place } from "../models/guides";
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import uuid from "react-native-uuid";
import { uploadMultiplePictures } from "../services/ImageUpload";

const Stack = createStackNavigator();

interface AddGuideStackProps {
  route: any;
  navigation: any;
}

function AddGuideStack({ route, navigation }: AddGuideStackProps) {
  const currentUser = route.params?.userParam?.currentUser;
  const [markerCoordinate, setMarkerCoordinate] = React.useState<Coordinate>();
  const [locationName, setLocationName] = React.useState(
    "Search for a location or tap on the map"
  );
  const [refreshing, setRefreshing] = React.useState(false);
  const [guide, setGuide] = React.useState<Guide>({
    uid: uuid.v4() as string,
    author: currentUser?.username,
    rating: [],
    title: "",
    description: "",
    places: [],
    status: "pending",
    user_id: currentUser?.uid,
    dateCreated: new Date().toISOString(),
    pictures: [],
    comments: [],
  });

  const handleSave = () => {
    // 1 - Upload guide
    const guidesCollection = collection(db, "guides");
    setDoc(doc(db, "guides", guide?.uid), guide)
      .then(async () => {
        // 2 - Upload pictures
        if (guide?.pictures?.length > 0) {
          try {
            const imagesUrl = await Promise.all(
              guide?.pictures?.map(
                async (picture) =>
                  await uploadMultiplePictures(guide?.uid, picture)
              )
            ).catch((error) => {
              console.log(error);
            });

            // 3 - Update guide with pictures url
            await updateDoc(doc(db, "guides", guide?.uid), {
              pictures: imagesUrl,
            });
          } catch (error) {
            console.log(error);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Add Guide Page"
        options={{
          headerTitle: "New Guide",
          headerRight: () => (
            <TouchableOpacity onPress={handleSave}>
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
            currentUser={currentUser}
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
