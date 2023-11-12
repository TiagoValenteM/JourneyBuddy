import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { Coordinate, Place } from "../../../models/guides";
import React from "react";
import { getLocationName } from "../../placeRepository/placesRepository";

interface ImageWithCoordinates {
  uri: string;
  coordinates: Coordinate | undefined;
}

interface ImageObject {
  image: ImageWithCoordinates;
  location: Place;
}

const imageSelection = async (
  setImages: React.Dispatch<React.SetStateAction<ImageWithCoordinates[]>>,
  setSuggestedPlaces: React.Dispatch<React.SetStateAction<Place[]>>,
  imagesLimit: number,
  setImagesLimit: React.Dispatch<React.SetStateAction<number>>
): Promise<void> => {
  const mediaLibraryPermission =
    await ImagePicker.requestMediaLibraryPermissionsAsync();
  const locationPermission = await MediaLibrary.requestPermissionsAsync();

  if (
    mediaLibraryPermission.status !== "granted" ||
    locationPermission.status !== "granted"
  ) {
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.3,
    allowsMultipleSelection: true,
    selectionLimit: imagesLimit,
  });

  if (!result?.canceled) {
    const imagePromises = result.assets.map(async (imagePickerAsset) => {
      try {
        const asset: MediaLibrary.Asset = {
          uri: imagePickerAsset.uri,
          width: imagePickerAsset.width,
          height: imagePickerAsset.height,
          creationTime: 0,
          modificationTime: 0,
          duration: 0,
          id: imagePickerAsset.assetId as string,
          filename: imagePickerAsset.uri,
          mediaType: MediaLibrary.MediaType.photo,
        };

        const assetInfo = await MediaLibrary.getAssetInfoAsync(asset);

        const newAsset: ImageWithCoordinates = {
          uri: assetInfo.uri,
          coordinates: assetInfo.location ? assetInfo.location : undefined,
        };

        if (newAsset.coordinates) {
          const locationData = await getLocationName(newAsset.coordinates);

          return {
            location: locationData,
            image: newAsset,
          } as ImageObject;
        }

        return {
          location: undefined,
          image: newAsset,
        };
      } catch (error) {
        console.error(error);
      }
    });

    const values = await Promise.all(imagePromises);
    const tempImages = values.map((value) => value?.image);
    const tempLocations = values
      .filter(
        (value, index, self) =>
          value?.location !== undefined &&
          index ===
            self.findIndex(
              (v) => v?.location && v.location.name === value.location?.name
            )
      )
      .map((value) => value?.location);

    setImages(
      (prevImages) => [...prevImages, ...tempImages] as ImageWithCoordinates[]
    );
    setSuggestedPlaces(
      (prevPlaces) => [...prevPlaces, ...tempLocations] as Place[]
    );
    setImagesLimit((prevImagesLimit) => prevImagesLimit - tempImages.length);
  }
};

export { imageSelection };
