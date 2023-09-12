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
import { Guide } from "../../models/guides";
import { selectPictures } from "../../services/ImageUpload";
import UserProfile from "../../models/userProfiles";
import { MapPin, PlusCircle, Trash } from "react-native-feather";

interface AddGuideScreenProps {
  navigation: any;
  authenticatedUser?: UserProfile;
  setRefreshing: any;
  refreshing: boolean;
  currentGuide?: Guide;
  updateGuideCallback: any;
}

const UploadGuideView: React.FC<AddGuideScreenProps> = ({
  navigation,
  authenticatedUser,
  setRefreshing,
  refreshing,
  currentGuide,
  updateGuideCallback,
}) => {
  const onRefresh = () => {
    setRefreshing(true);
    updateGuideCallback(new Guide(authenticatedUser));
    setRefreshing(false);
  };

  const handleSelectImages = () => {
    selectPictures()
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
            value={currentGuide?.title}
            onChangeText={(text) =>
              updateGuideCallback({ ...currentGuide, title: text })
            }
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
            value={currentGuide?.description}
            onChangeText={(text) =>
              updateGuideCallback({ ...currentGuide, description: text })
            }
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
              <Text style={{ fontSize: 30, fontWeight: "600" }}>Pictures</Text>
              <TouchableOpacity onPress={handleSelectImages}>
                <PlusCircle height={30} width={30} color="black" />
              </TouchableOpacity>
            </View>
            {currentGuide?.pictures?.length! > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ flexDirection: "row" }}
              >
                {currentGuide?.pictures.map((picture, index) => (
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
                    <Image
                      source={{ uri: picture }}
                      resizeMode="cover"
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
                      onPress={() => {
                        const newImages = [...currentGuide?.pictures];
                        newImages.splice(index, 1);
                        updateGuideCallback({
                          ...currentGuide,
                          pictures: newImages,
                        });
                      }}
                    >
                      <Trash stroke={"black"} width={24} height={24} />
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
              <Text style={{ fontSize: 30, fontWeight: "600" }}>Locations</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Add places");
                }}
              >
                <PlusCircle height={30} width={30} color="black" />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "column" }}>
              {currentGuide?.places?.length! > 0 ? (
                currentGuide?.places.map((place, index) => (
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
                        {place.name}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          marginVertical: 5,
                        }}
                      >
                        <MapPin height={15} width={15} color={"#007AFF"} />
                        <Text style={{ marginHorizontal: 5 }}>
                          ({place.coordinates?.latitude.toString().slice(0, 8)},{" "}
                          {place.coordinates?.longitude.toString().slice(0, 8)})
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={{ paddingRight: 5 }}
                      onPress={() => {
                        const newPlaces = [...currentGuide?.places];
                        newPlaces.splice(index, 1);
                        updateGuideCallback({
                          ...currentGuide,
                          places: newPlaces,
                        });
                      }}
                    >
                      <Trash stroke={"black"} width={24} height={24} />
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

export default UploadGuideView;
