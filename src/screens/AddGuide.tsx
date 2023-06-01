import React from "react";
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  Image,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { Guide } from "../models/guides";
import { selectMultipleImages } from "../services/ImageUpload";
import uuid from "react-native-uuid";

interface AddGuideScreenProps {
  navigation: any;
  authenticatedUser?: UserProfile;
  setRefreshing: any;
  refreshing: boolean;
  currentGuide?: Guide;
  updateGuideCallback: any;
}

function AddGuideScreen<StackScreenProps>({
  navigation,
  authenticatedUser,
  setRefreshing,
  refreshing,
  currentGuide,
  updateGuideCallback,
}: AddGuideScreenProps) {
  const onRefresh = () => {
    setRefreshing(true);
    updateGuideCallback(new Guide(authenticatedUser));
    setRefreshing(false);
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

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="w-screen"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="h-3/4 flex flex-col justify-start mt-5 items-center space-y-6">
        <View
          className={
            "flex flex-row justify-between px-4 items-center space-x-1 w-full"
          }
        >
          <Text className={"text-black font-light text-sm"}>Title</Text>
          <TextInput
            maxLength={25}
            multiline
            numberOfLines={2}
            placeholder="Title"
            style={{
              width: "75%",
              padding: 10,
            }}
            className={"border-b border-b-gray-300"}
            value={currentGuide?.title}
            onChangeText={(text) =>
              updateGuideCallback({ ...currentGuide, title: text })
            }
          />
        </View>
        <View
          className={
            "flex flex-row justify-between px-4 items-center space-x-1 w-full"
          }
        >
          <Text className={"text-black font-light text-sm"}>Description</Text>
          <TextInput
            maxLength={250}
            multiline
            numberOfLines={6}
            placeholder="Description"
            style={{
              width: "75%",
              padding: 10,
            }}
            className={"border-b border-b-gray-300"}
            value={currentGuide?.description}
            onChangeText={(text) =>
              updateGuideCallback({ ...currentGuide, description: text })
            }
          />
        </View>
        <View style={{ width: "85%" }}>
          <View style={{ marginVertical: 20 }}>
            <View
              style={{
                flex: 1,
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
              <TouchableOpacity onPress={handleSelectImages}>
                <Feather name="plus-circle" size={30} color="black" />
              </TouchableOpacity>
            </View>
            {currentGuide!!.pictures?.length > 0 ? (
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{
                  flex: 1,
                  flexDirection: "row",
                }}
              >
                {currentGuide?.pictures.map((picture, index) => (
                  <View
                    key={index}
                    style={{
                      flex: 1,
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
                      <TouchableOpacity
                        onPress={() => {
                          const newImages = [...currentGuide?.pictures];
                          newImages.splice(index, 1);
                          updateGuideCallback({
                            ...currentGuide,
                            pictures: newImages,
                          });
                        }}
                      >
                        <Feather name="trash" size={24} color="black" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View
                style={{
                  flex: 1,
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
                flex: 1,
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
                Locations
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Add places");
                }}
              >
                <Feather name="plus-circle" size={30} color="black" />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "column",
              }}
            >
              {currentGuide!!.places?.length > 0 ? (
                currentGuide?.places?.map((place, index) => (
                  <View
                    key={index}
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      backgroundColor: "#dfe0e3",
                      borderRadius: 10,
                      padding: 10,
                      marginVertical: 10,
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        width: "85%",
                      }}
                    >
                      <Text>
                        {place.name.length > 50
                          ? `${place.name.substring(0, 50)}...`
                          : place.name}
                      </Text>
                      <Text>{place.coordinates.latitude}</Text>
                      <Text>{place.coordinates.longitude}</Text>
                    </View>
                    <View
                      style={{
                        paddingRight: 5,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          const newPlaces = [...currentGuide?.places];
                          newPlaces.splice(index, 1);
                          updateGuideCallback({
                            ...currentGuide,
                            places: newPlaces,
                          });
                        }}
                      >
                        <Feather name="trash" size={24} color="black" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <View
                  style={{
                    flex: 1,
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
}

export default AddGuideScreen;
