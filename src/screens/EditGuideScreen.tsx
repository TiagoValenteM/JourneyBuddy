import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";
import { Guide, Place } from "../models/guides";
import { selectMultipleImages } from "../services/ImageUpload";
import Feather from "react-native-vector-icons/Feather";
import { usePressedGuide } from "../context/pressedGuideContext";

interface EditGuideScreenProps {
  navigation: any;
  authenticatedUser: UserProfile;
  setRefreshing: any;
  refreshing: boolean;
  currentGuide: Guide;
  updateGuideCallback: any;
}

const EditGuideScreen = ({
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
      style={{ flex: 1, width: "100%" }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          marginTop: 5,
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 4,
            alignItems: "center",
            width: "100%",
          }}
        >
          <Text style={{ color: "black", fontWeight: "300", fontSize: 14 }}>
            Title
          </Text>
          <TextInput
            maxLength={25}
            multiline
            numberOfLines={2}
            placeholder="Title"
            style={{
              width: "75%",
              padding: 10,
              borderBottomColor: "gray",
              borderBottomWidth: 1,
            }}
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              updateGuide();
            }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 4,
            alignItems: "center",
            width: "100%",
          }}
        >
          <Text style={{ color: "black", fontWeight: "300", fontSize: 14 }}>
            Description
          </Text>
          <TextInput
            maxLength={250}
            multiline
            numberOfLines={6}
            placeholder="Description"
            style={{
              width: "75%",
              padding: 10,
              borderBottomColor: "gray",
              borderBottomWidth: 1,
            }}
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              updateGuide();
            }}
          />
        </View>
        <View style={{ width: "85%", marginTop: 20 }}>
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
                  textAlignVertical: "center",
                }}
              >
                Pictures
              </Text>
              <TouchableHighlight onPress={handleSelectImages}>
                <Feather name="plus-circle" size={30} color="black" />
              </TouchableHighlight>
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
                      flexDirection: "row",
                      marginVertical: 10,
                      marginRight: 25,
                      width: 200,
                      height: 200,
                      borderRadius: 20,
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      source={{ uri: picture }}
                      style={{ width: "100%", height: "100%" }}
                    />
                    <View
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
                    >
                      <TouchableHighlight
                        onPress={() => handleDeleteImage(index)}
                      >
                        <Feather name="trash" size={24} color="black" />
                      </TouchableHighlight>
                    </View>
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
                <Text
                  style={{ textAlignVertical: "center", textAlign: "center" }}
                >
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
                  textAlignVertical: "center",
                }}
              >
                Places
              </Text>
              <TouchableHighlight
                onPress={() => navigation.navigate("EditPlaces")}
              >
                <Feather name="plus-circle" size={30} color="black" />
              </TouchableHighlight>
            </View>
            <View style={{ flexDirection: "column" }}>
              {selectedPlaces?.length > 0 ? (
                selectedPlaces?.map((place, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      backgroundColor: "#dfe0e3",
                      borderRadius: 10,
                      padding: 10,
                      marginVertical: 10,
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ width: "85%" }}>
                      <Text>
                        {place?.name?.length > 50
                          ? `${place?.name?.substring(0, 50)}...`
                          : place?.name}
                      </Text>
                      <Text>{place?.coordinates?.latitude}</Text>
                      <Text>{place?.coordinates?.longitude}</Text>
                    </View>
                    <View
                      style={{
                        paddingRight: 5,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TouchableHighlight
                        onPress={() => handleDeletePlace(index)}
                      >
                        <Feather name="trash" size={24} color="black" />
                      </TouchableHighlight>
                    </View>
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
                  <Text
                    style={{ textAlignVertical: "center", textAlign: "center" }}
                  >
                    Try adding some places
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

export default EditGuideScreen;
