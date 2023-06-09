import React, { useEffect, useState } from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { Guide, Place } from "../../models/guides";
import { selectMultipleImages } from "../../services/ImageUpload";
import Feather from "react-native-vector-icons/Feather";
import CachedImage from "../../components/images/CachedImage";

interface EditGuideScreenProps {
  navigation: any;
  authenticatedUser: UserProfile;
  setRefreshing: any;
  refreshing: boolean;
  currentGuide: Guide;
  updateGuideCallback: any;
}

const UpdateGuideView = ({
  navigation,
  setRefreshing,
  refreshing,
  currentGuide,
  updateGuideCallback,
}: EditGuideScreenProps) => {
  const [title, setTitle] = useState(currentGuide.title);
  const [description, setDescription] = useState(currentGuide.description);
  const [selectedImages, setSelectedImages] = useState<string[]>(
    currentGuide.pictures
  );
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>(
    currentGuide.places
  );

  useEffect(() => {
    if (currentGuide) {
      setSelectedImages(currentGuide?.pictures);
      setSelectedPlaces(currentGuide?.places);
    }
  }, [currentGuide]);

  const updateGuide = () => {
    updateGuideCallback({
      ...currentGuide,
      title,
      description,
      places: selectedPlaces,
    });
  };

  const handleSelectImages = () => {
    selectMultipleImages()
      .then((images) => {
        const newImages = currentGuide?.pictures
          ? [...currentGuide.pictures, ...images]
          : images;

        updateGuideCallback({ ...currentGuide, pictures: newImages });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteImage = (index: number) => {
    const newImages = [...currentGuide?.pictures];
    newImages.splice(index, 1);
    updateGuideCallback({
      ...currentGuide,
      pictures: newImages,
    });
  };

  const handleDeletePlace = (index: number) => {
    const newPlaces = [...currentGuide?.places];
    newPlaces.splice(index, 1);
    updateGuideCallback({
      ...currentGuide,
      places: newPlaces,
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    if (currentGuide) {
      setTitle(currentGuide.title);
      setDescription(currentGuide.description);
      setSelectedImages(currentGuide.pictures);
      setSelectedPlaces(currentGuide.places);
    }
    setRefreshing(false);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={{ marginVertical: 10, flex: 1 }}>
        <View style={{ paddingHorizontal: 25, marginVertical: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: "500" }}>Title</Text>
          <TextInput
            maxLength={25}
            multiline
            numberOfLines={2}
            placeholder="Title"
            style={{
              padding: 10,
              borderBottomWidth: 2,
              borderBottomColor: "#dfe0e3",
              marginTop: 10,
            }}
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              updateGuide();
            }}
          />
        </View>
        <View style={{ paddingHorizontal: 25, marginVertical: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: "500" }}>Description</Text>
          <TextInput
            maxLength={250}
            multiline
            numberOfLines={6}
            placeholder="Description"
            style={{
              padding: 10,
              borderBottomWidth: 2,
              borderBottomColor: "#dfe0e3",
              marginTop: 10,
            }}
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              updateGuide();
            }}
          />
        </View>

        <View style={{ paddingHorizontal: 25 }}>
          <View style={{ marginVertical: 20 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: "600",
                }}
              >
                Pictures
              </Text>
              <TouchableOpacity onPress={handleSelectImages}>
                <Feather name="plus-circle" size={30} color="black" />
              </TouchableOpacity>
            </View>
            {selectedImages?.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ flexDirection: "row" }}
              >
                {selectedImages?.map((picture, index) => (
                  <View
                    key={index}
                    style={{
                      marginVertical: 10,
                      marginRight: 25,
                      width: 200,
                      height: 250,
                      borderRadius: 20,
                      overflow: "hidden",
                      backgroundColor: "#dfe0e3",
                    }}
                  >
                    <CachedImage
                      source={{ uri: picture }}
                      style={{ width: "100%", height: "100%" }}
                    />
                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        position: "absolute",
                        right: 10,
                        top: 10,
                        backgroundColor: "white",
                        borderRadius: 50,
                        width: 35,
                        height: 35,
                      }}
                      onPress={() => handleDeleteImage(index)}
                    >
                      <Feather name="trash" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View
                style={{
                  flexDirection: "column",
                  backgroundColor: "#dfe0e3",
                  borderRadius: 10,
                  padding: 15,
                  marginVertical: 10,
                }}
              >
                <Text style={{ textAlign: "center" }}>
                  Try adding some pictures
                </Text>
              </View>
            )}
          </View>
          <View style={{ marginVertical: 20 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: "600",
                }}
              >
                Locations
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("EditPlaces")}
              >
                <Feather name="plus-circle" size={30} color="black" />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "column" }}>
              {selectedPlaces?.length > 0 ? (
                selectedPlaces?.map((place, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: "#dfe0e3",
                      borderRadius: 10,
                      padding: 10,
                      marginVertical: 10,
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexDirection: "row",
                    }}
                  >
                    <View style={{ width: "85%" }}>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{ fontWeight: "bold", marginBottom: 5 }}
                      >
                        {place?.name?.length > 50
                          ? `${place?.name?.substring(0, 50)}...`
                          : place?.name}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          marginVertical: 5,
                        }}
                      >
                        <Feather name={"map-pin"} size={15} color={"#007AFF"} />
                        <Text style={{ marginHorizontal: 5 }}>
                          ({place.coordinates?.latitude.toString().slice(0, 8)},{" "}
                          {place.coordinates?.longitude.toString().slice(0, 8)})
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={{
                        paddingRight: 5,
                      }}
                      onPress={() => handleDeletePlace(index)}
                    >
                      <Feather name="trash" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <View
                  style={{
                    flexDirection: "column",
                    backgroundColor: "#dfe0e3",
                    borderRadius: 10,
                    padding: 15,
                    marginVertical: 10,
                  }}
                >
                  <Text style={{ textAlign: "center" }}>
                    Try adding some locations
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default UpdateGuideView;
