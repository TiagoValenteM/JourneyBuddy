import UserProfile from "../../models/userProfiles";
import { Coordinate, Place } from "../../models/guides";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

const handleSaveActionPlace = (
  place: Place,
  authenticatedUser: UserProfile | undefined,
  setAuthenticatedUser: any
) => {
  if (
    authenticatedUser?.savedPlaces?.some(
      (placeName) => placeName.name === place?.name
    )
  ) {
    handleUnsavedPlace(place, authenticatedUser, setAuthenticatedUser).then();
  } else {
    handleSavePlace(place, authenticatedUser!, setAuthenticatedUser).then();
  }
};

async function handleSavePlace(
  place: Place,
  authenticatedUser: UserProfile,
  setAuthenticatedUser: any
): Promise<Promise<void>> {
  const userRef = doc(db, "user_profiles", authenticatedUser?.uid);
  try {
    await updateDoc(userRef, {
      savedPlaces: arrayUnion(place),
    });

    const updatedAuthenticatedUser: { savedPlaces: (Place | undefined)[] } = {
      ...(authenticatedUser || {}),
      savedPlaces: [...(authenticatedUser?.savedPlaces || []), place],
    };

    setAuthenticatedUser(updatedAuthenticatedUser);
    console.log("Place saved successfully");
  } catch (error) {
    console.log("Error updating profile:", error);
  }
}

async function handleUnsavedPlace(
  place: Place,
  authenticatedUser: UserProfile,
  setAuthenticatedUser: any
): Promise<Promise<void>> {
  const userRef = doc(db, "user_profiles", authenticatedUser?.uid);
  try {
    await updateDoc(userRef, {
      savedPlaces: arrayRemove(place),
    });

    const updatedAuthenticatedUser: { savedPlaces: (Place | undefined)[] } = {
      ...(authenticatedUser || {}),
      savedPlaces: authenticatedUser?.savedPlaces?.filter(
        (savedPlace) => savedPlace !== place
      ),
    };

    setAuthenticatedUser(updatedAuthenticatedUser);
    console.log("Place unsaved successfully");
  } catch (error) {
    console.log("Error updating profile:", error);
  }
}

const getLocationName = async (
  coordinate: Coordinate,
  showError: (message: string) => void
): Promise<Place | void> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coordinate.latitude}&lon=${coordinate.longitude}`
    );
    const placeData = await response.json();

    if (placeData?.name) {
      return {
        name: placeData?.name,
        coordinates: coordinate,
      } as Place;
    }

    const displayName = placeData?.display_name;

    if (displayName) {
      const splitDisplayName = displayName.split(",", 3);
      if (splitDisplayName.length >= 3) {
        return {
          name: splitDisplayName.toString().replaceAll("  ", ", "),
          coordinates: coordinate,
        } as Place;
      }
    } else {
      showError("Place not available yet. Please try again.");
    }
  } catch (error) {
    console.error(error);
  }
};

const getLocationCoordinates = async (
  place: string,
  showError: (message: string) => void
): Promise<Place[] | undefined> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${place}&limit=8&accept-language=en-US`
    );
    const placesData = await response.json();

    if (placesData?.length > 0) {
      return placesData.map((data: any) => {
        return {
          name: data.display_name
            .split(",", 3)
            .toString()
            .replaceAll("  ", ", "),
          coordinates: {
            latitude: parseFloat(data.lat),
            longitude: parseFloat(data.lon),
          },
        };
      }) as Place[];
    }

    showError("No results found. Please try again.");
  } catch (error) {
    console.error(error);
  }
};

export { handleSaveActionPlace, getLocationName, getLocationCoordinates };
