import React from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Guide } from "../../models/guides";
import { selectPictures } from "../../services/ImageUpload";
import Feather from "react-native-vector-icons/Feather";
import { useGuide } from "../../context/GuideContext";

interface EditGuideScreenProps {
  navigation: any;
}

const UpdateGuideView = ({ navigation }: EditGuideScreenProps) => {
  const { tempGuide, setTempGuide, pressedGuide } = useGuide();

  console.log(tempGuide);
  React.useEffect(() => {
    setTempGuide(pressedGuide);
  }, []);

  const handleSelectImages = () => {
    selectPictures()
      .then((images) => {
        const newImages = tempGuide?.pictures
          ? [...tempGuide.pictures, ...images]
          : images;
        setTempGuide(
          (prevTempGuide) =>
            ({
              ...prevTempGuide,
              pictures: newImages,
            } as Guide)
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteImage = (index: number) => {
    const newImages = [...tempGuide!.pictures];
    newImages.splice(index, 1);
    setTempGuide(
      (prevTempGuide) =>
        ({
          ...prevTempGuide,
          pictures: newImages,
        } as Guide)
    );
  };

  const handleDeletePlace = (index: number) => {
    const newPlaces = [...tempGuide!.places];
    newPlaces.splice(index, 1);
    setTempGuide(
      (prevTempGuide) =>
        ({
          ...prevTempGuide,
          places: newPlaces,
        } as Guide)
    );
  };

  const handleTitleChange = (text: string): void => {
    setTempGuide(
      (prevTempGuide) =>
        ({
          ...prevTempGuide,
          title: text,
        } as Guide)
    );
  };

  const handleDescriptionChange = (text: string): void => {
    setTempGuide(
      (prevTempGuide) =>
        ({
          ...prevTempGuide,
          description: text,
        } as Guide)
    );
  };

  return tempGuide ? (
    <ScrollView showsVerticalScrollIndicator={false}>
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
            value={tempGuide?.title}
            onChangeText={handleTitleChange}
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
            value={tempGuide?.description}
            onChangeText={handleDescriptionChange}
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
            {tempGuide?.pictures?.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ flexDirection: "row" }}
              >
                {tempGuide?.pictures?.map((picture, index) => (
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
              {tempGuide?.places?.length > 0 ? (
                tempGuide?.places?.map((place, index) => (
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
  ) : (
    <View />
  );
};

export default UpdateGuideView;
