import React from "react";
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";

interface HandlePlaceNameChangeParams {
  text: string;
  index: number;
}

function AddGuideScreen<StackScreenProps>({
  navigation,
  currentUser,
}: {
  navigation: any;
  currentUser?: UserProfile;
}) {
  const [value, setValue] = React.useState({
    title: "",
    description: "",
    error: "",
    places: [
      {
        name: "",
        lat: "",
        lng: "",
      },
    ],
    status: "pending",
    uid: currentUser?.uid,
    dateCreated: new Date().toISOString(),
  });

  const handlePlaceNameChange = ({
    text,
    index,
  }: HandlePlaceNameChangeParams) => {
    const updatedPlaces = [...value.places];
    updatedPlaces[index].name = text;
    setValue({ ...value, places: updatedPlaces });
  };

  const handlePlaceLatChange = ({
    text,
    index,
  }: HandlePlaceNameChangeParams) => {
    const updatedPlaces = [...value.places];
    updatedPlaces[index].lat = text;
    setValue({ ...value, places: updatedPlaces });
  };

  const handlePlaceLongChange = ({
    text,
    index,
  }: HandlePlaceNameChangeParams) => {
    const updatedPlaces = [...value.places];
    updatedPlaces[index].lng = text;
    setValue({ ...value, places: updatedPlaces });
  };

  const addPlace = () => {
    const updatedPlaces = [...value.places];
    updatedPlaces.push({ name: "", lat: "", lng: "" });
    setValue({ ...value, places: updatedPlaces });
  };

  return (
    <ScrollView className="w-screen h-screen">
      <View className="h-3/4 flex flex-col justify-start mt-5 items-center space-y-6">
        <View
          className={
            "flex flex-row justify-between px-4 items-center space-x-1 w-full"
          }
        >
          <Text className={"text-black font-light text-sm"}>Title</Text>
          <TextInput
            placeholder="Title"
            style={{
              width: "75%",
              padding: 10,
            }}
            className={"border-b border-b-gray-300"}
            value={value.title}
            onChangeText={(text) => setValue({ ...value, title: text })}
          />
        </View>
        <View
          className={
            "flex flex-row justify-between px-4 items-center space-x-1 w-full"
          }
        >
          <Text className={"text-black font-light text-sm"}>Description</Text>
          <TextInput
            placeholder="Description"
            style={{
              width: "75%",
              padding: 10,
            }}
            className={"border-b border-b-gray-300"}
            value={value.description}
            onChangeText={(text) => setValue({ ...value, description: text })}
          />
        </View>
        {value.places.map((place, index) => (
          <View key={index}>
            <TextInput
              placeholder="Place Name"
              style={{
                width: "75%",
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: "gray",
              }}
              value={place.name}
              onChangeText={(text) =>
                handlePlaceNameChange({ text: text, index: index })
              }
            />
            <TextInput
              placeholder="Latitude"
              style={{
                width: "75%",
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: "gray",
              }}
              value={place.lat}
              onChangeText={(text) => handlePlaceLatChange(text, index)}
            />
            <TextInput
              placeholder="Longitude"
              style={{
                width: "75%",
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: "gray",
              }}
              value={place.lng}
              onChangeText={(text) => handlePlaceLongChange(text, index)}
            />
          </View>
        ))}
        <TouchableOpacity>
          <Text>Add Guide</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={addPlace}>
          <Text>Add Place</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default AddGuideScreen;
