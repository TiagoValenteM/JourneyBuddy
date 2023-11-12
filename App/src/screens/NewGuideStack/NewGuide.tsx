import React from "react";
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Alert,
} from "react-native";
import { Coordinate, Guide, Place } from "../../models/guides";
import { MapPin, PlusCircle, Trash } from "react-native-feather";
import MissingWarning from "../../components/warnings/MissingWarning";
import Colors from "../../../styles/colorScheme";
import Header from "../../components/headers/Header";
import { checkGuideFields } from "../../services/ManageGuides";
import { useError } from "../../hooks/useError";
import { useAuthenticatedUser } from "../../context/authenticatedUserContext";
import { createGuide } from "../../database/guideRepository/guideRepository";
import MapView, { Marker } from "react-native-maps";
import { useLoading } from "../../hooks/useLoading";
import { imageSelection } from "../../database/guideRepository/images/imagesRepository";
import SkeletonLoader from "expo-skeleton-loader";

const itemWidth = 130;
const mapSize = 100;
const maxImagesLimit = 10;

interface NewGuideProps {
  navigation: any;
  guide: Guide;
  setGuide: React.Dispatch<React.SetStateAction<Guide>>;
  places: Place[];
  setPlaces: React.Dispatch<React.SetStateAction<Place[]>>;
}

interface ImageWithCoordinates {
  uri: string;
  coordinates: Coordinate | undefined;
}

const NewGuideView: React.FC<NewGuideProps> = ({
  navigation,
  guide,
  setGuide,
  places,
  setPlaces,
}) => {
  const { authenticatedUser, setAuthenticatedUser } = useAuthenticatedUser();
  const [images, setImages] = React.useState<ImageWithCoordinates[]>([]);
  const [suggestedPlaces, setSuggestedPlaces] = React.useState<Place[]>([]);
  const [imagesLimit, setImagesLimit] = React.useState(maxImagesLimit);
  const { startLoading, stopLoading } = useLoading();
  const { showError } = useError();

  const cleanGuide = () => {
    setGuide(new Guide(authenticatedUser));
    setPlaces([]);
    setSuggestedPlaces([]);
    setImages([]);
    setImagesLimit(10);
  };

  const Pictures = () => {
    const [loadingImages, setLoadingImages] = React.useState(false);
    const skeletonLength = Array.from({ length: maxImagesLimit });

    const handleImageSelection = () => {
      setLoadingImages(true);
      imageSelection(setImages, setSuggestedPlaces, imagesLimit, setImagesLimit)
        .then(() => {
          setLoadingImages(false);
        })
        .catch((err) => {
          setLoadingImages(false);
          showError("Failed to load images. Please try again later.");
          console.log("Error selecting images:", err);
        });
    };

    return (
      <View style={styles.sectionContainer}>
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.title}>Pictures</Text>
            <Text style={styles.subtitle}>(Add up to 10 pictures)</Text>
          </View>

          <Pressable
            disabled={loadingImages || images.length >= maxImagesLimit}
            onPress={handleImageSelection}
          >
            <PlusCircle width={28} height={28} color={Colors.blue} />
          </Pressable>
        </View>

        {images?.length === 0 && !loadingImages && (
          <MissingWarning text={"No pictures added yet."} />
        )}

        {loadingImages && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ alignItems: "center" }}
          >
            {skeletonLength.map((_, index) => (
              <SkeletonLoader
                boneColor={Colors.skeletonBone}
                highlightColor={Colors.skeletonHighlight}
                duration={800}
                key={index}
              >
                <SkeletonLoader.Item
                  style={{
                    marginVertical: 5,
                    marginHorizontal: 5,
                    width: itemWidth,
                    height: itemWidth * 1.25,
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                />
              </SkeletonLoader>
            ))}
          </ScrollView>
        )}

        {!loadingImages && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ alignItems: "center" }}
          >
            {images?.map((picture, index) => (
              <View
                key={index}
                style={[
                  styles.pictureContainer,
                  {
                    backgroundColor: Colors.lightGray,
                  },
                ]}
              >
                <Image source={{ uri: picture.uri }} style={styles.picture} />
                <Pressable
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    right: 10,
                    top: 10,
                    backgroundColor: Colors.lightGray,
                    borderRadius: 50,
                    padding: 5,
                  }}
                  onPress={() => {
                    const newImages = [...images];
                    newImages.splice(index, 1);
                    setImages(newImages);
                    setImagesLimit(imagesLimit + 1);
                  }}
                >
                  <Trash stroke={Colors.red} width={22} height={22} />
                </Pressable>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    );
  };

  const Places = () => {
    return (
      <View style={styles.sectionContainer}>
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.title}>Places</Text>
            <Text style={styles.subtitle}>(Add up to 15 places)</Text>
          </View>

          <Pressable onPress={() => navigation.navigate("NewPlace")}>
            <PlusCircle width={28} height={28} color={Colors.blue} />
          </Pressable>
        </View>

        {places?.length === 0 && (
          <MissingWarning text={"No places added yet."} />
        )}

        <View style={{ flexDirection: "column", flex: 1 }}>
          {places?.map((place, index) => (
            <>
              <View key={index} style={styles.placeContainer}>
                <MapView
                  cacheEnabled={true}
                  style={{
                    width: mapSize,
                    height: mapSize,
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: 10,
                    overflow: "hidden",
                  }}
                  region={{
                    latitude: place.coordinates.latitude,
                    longitude: place.coordinates.longitude,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                  }}
                >
                  <Marker coordinate={place?.coordinates}>
                    <MapPin
                      width={25}
                      height={25}
                      color={Colors.blue}
                      strokeWidth={3}
                    />
                  </Marker>
                </MapView>
                <View
                  style={{
                    flex: 1,
                    marginHorizontal: 15,
                    marginVertical: 10,
                  }}
                >
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={{
                      fontWeight: "bold",
                      fontSize: 13,
                      color: Colors.darkGray,
                    }}
                  >
                    {place.name}
                  </Text>
                </View>

                <TouchableOpacity
                  style={{ right: 10, top: 10, position: "absolute" }}
                  onPress={() => {
                    const updatedPlaces = [...places];
                    updatedPlaces.splice(index, 1);
                    setPlaces(updatedPlaces);
                  }}
                >
                  <Trash stroke={Colors.red} width={24} height={24} />
                </TouchableOpacity>
              </View>
            </>
          ))}
        </View>
      </View>
    );
  };

  const SuggestedPlaces = () => {
    return (
      <View style={styles.sectionContainer}>
        <View style={{ flexDirection: "column" }}>
          <Text style={[styles.title, { color: Colors.gray }]}>
            Suggested Places
          </Text>
          <Text style={styles.subtitle}>
            (Photo-Based Location Suggestions)
          </Text>
        </View>
        <View style={{ flexDirection: "column", flex: 1 }}>
          {suggestedPlaces?.map((place, index) => (
            <>
              <View
                key={index}
                style={{
                  marginVertical: 5,
                  borderRadius: 10,
                  backgroundColor: Colors.lightGray,
                  flex: 1,
                  padding: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    width: "70%",
                  }}
                >
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={{
                      fontWeight: "bold",
                      fontSize: 13,
                      color: Colors.darkGray,
                    }}
                  >
                    {place.name}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    gap: 20,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      const updatedPlaces = [...places, place];
                      setPlaces(updatedPlaces);
                      const updatedSuggestions = suggestedPlaces.filter(
                        (suggestedPlace) => suggestedPlace !== place
                      );
                      setSuggestedPlaces(updatedSuggestions);
                    }}
                  >
                    <PlusCircle stroke={Colors.blue} width={24} height={24} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      const updatedSuggestions = suggestedPlaces.filter(
                        (suggestedPlace) => suggestedPlace !== place
                      );
                      setSuggestedPlaces(updatedSuggestions);
                    }}
                  >
                    <Trash stroke={Colors.red} width={24} height={24} />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ))}
        </View>
      </View>
    );
  };

  const DiscardButton = () => {
    return (
      <Pressable
        style={{
          marginVertical: 15,
          borderRadius: 10,
          paddingHorizontal: 14,
          paddingVertical: 8,
          justifyContent: "center",
          backgroundColor: Colors.red,
          alignItems: "center",
        }}
        onPress={cleanGuide}
      >
        <Text
          style={{
            color: Colors.white,
            fontSize: 14,
            fontWeight: "bold",
          }}
        >
          Discard
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Header title={"New Guide"} options={false} backButton={false} />
        <Pressable
          style={{
            marginHorizontal: 15,
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 8,
            justifyContent: "center",
            backgroundColor: Colors.lightGray,
            alignItems: "center",
          }}
          onPress={async () => {
            const updatedPlaces = [...places];
            const pictures = [...images.map((image) => image.uri)];

            setGuide({
              ...guide,
              places: updatedPlaces,
              pictures: pictures,
            });

            if (checkGuideFields(guide, showError)) {
              startLoading();

              try {
                await createGuide(
                  setAuthenticatedUser,
                  authenticatedUser!,
                  guide,
                  showError
                );
                cleanGuide();
                stopLoading();
                Alert.alert("Guide created successfully");
              } catch (error) {
                showError("Error creating guide.");
              }
            }
          }}
        >
          <Text
            style={{
              color: Colors.darkGray,
              fontSize: 14,
              fontWeight: "bold",
            }}
          >
            Create
          </Text>
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 15, paddingVertical: 15 }}
      >
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Title</Text>
          <Text style={styles.subtitle}>(Add up to 25 characters)</Text>
          <TextInput
            maxLength={25}
            multiline
            placeholder="Add a title..."
            style={styles.input}
            value={guide?.title}
            onChangeText={(text) => setGuide({ ...guide, title: text })}
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Description</Text>
          <Text style={styles.subtitle}>(Add up to 250 characters)</Text>

          <TextInput
            maxLength={250}
            multiline
            placeholder="Add a description..."
            style={styles.input}
            value={guide?.description}
            onChangeText={(text) => setGuide({ ...guide, description: text })}
          />
        </View>

        <Pictures />
        {suggestedPlaces?.length !== 0 && <SuggestedPlaces />}
        <Places />
        <View style={{ flex: 1, alignItems: "flex-end", marginBottom: 20 }}>
          <DiscardButton />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewGuideView;

const styles = StyleSheet.create({
  sectionContainer: {
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.black,
  },
  subtitle: {
    marginHorizontal: 5,
    marginVertical: 5,
    color: Colors.gray,
    fontSize: 12,
    fontWeight: "normal",
  },
  input: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
    lineHeight: 18,
    color: Colors.darkGray,
    fontSize: 14,
    fontWeight: "normal",
    textAlignVertical: "center",
  },
  linearGradient: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  pictureContainer: {
    marginVertical: 5,
    marginHorizontal: 5,
    width: itemWidth,
    height: itemWidth * 1.25,
    borderRadius: 10,
    overflow: "hidden",
  },
  picture: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeContainer: {
    marginVertical: 5,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: Colors.lightGray,
    flex: 1,
    height: mapSize,
    flexDirection: "row",
    alignItems: "flex-end",
  },
});
