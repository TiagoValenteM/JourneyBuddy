import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { Guide } from "../../models/guides";
import SavedModal from "../../components/modals/SavedModal";
import MapView, { Marker, Region } from "react-native-maps";
import { useGuide } from "../../context/GuideContext";
import CachedImage from "../../components/images/CachedImage";
import { ArrowLeft, Grid } from "react-native-feather";

interface SavedGuidesMapViewProps {
  navigation: any;
  route: any;
}

const SavedGuidesMapView = ({ navigation, route }: SavedGuidesMapViewProps) => {
  const { guides } = route.params as { guides: Guide[] };
  const { setPressedGuide } = useGuide();
  const [visibleGuides, setVisibleGuides] = useState<Guide[]>(guides);
  const initialRegion = {
    latitude: guides[0]?.places[0]?.coordinates?.latitude || 38.7223,
    longitude: guides[0]?.places?.[0]?.coordinates?.longitude || -9.1393,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };
  const handleRegionChangeComplete = (region: Region) => {
    const guidesInBounds = guides.filter((guide) => {
      const coordinates = guide?.places[0]?.coordinates;
      return (
        coordinates &&
        coordinates.latitude >= region.latitude - region.latitudeDelta / 2 &&
        coordinates.latitude <= region.latitude + region.latitudeDelta / 2 &&
        coordinates.longitude >= region.longitude - region.longitudeDelta / 2 &&
        coordinates.longitude <= region.longitude + region.longitudeDelta / 2
      );
    });

    setVisibleGuides(guidesInBounds);
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          position: "absolute",
          top: 60,
          flex: 1,
          flexDirection: "row",
          paddingHorizontal: 20,
          width: "100%",
          zIndex: 1,
          justifyContent: "space-between",
        }}
      >
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            backgroundColor: "#fff",
            borderRadius: 50,
            padding: 10,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowOffset: {
              width: 1,
              height: 3,
            },
            elevation: 3,
            height: 50,
            justifyContent: "center",
            width: 50,
            alignItems: "center",
          }}
        >
          <ArrowLeft width={28} height={28} color={"black"} />
        </Pressable>
        <Pressable
          onPress={() => {
            navigation.navigate("SavedGuidesGrid", { guides: guides });
          }}
          style={{
            backgroundColor: "#fff",
            borderRadius: 50,
            padding: 10,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowOffset: {
              width: 1,
              height: 3,
            },
            elevation: 3,
            height: 50,
            justifyContent: "center",
            width: 50,
            alignItems: "center",
          }}
        >
          <Grid width={25} height={25} color={"black"} />
        </Pressable>
      </View>
      <MapView
        style={{ width: "100%", height: "100%" }}
        initialRegion={initialRegion}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        {visibleGuides?.map((guide, index) => (
          <Marker
            coordinate={guide?.places[0]?.coordinates}
            key={index}
            onPress={() => {
              setPressedGuide(guide);
              navigation.navigate("OverviewGuide");
            }}
          >
            <CachedImage
              source={{ uri: guide?.pictures[0] }}
              key={index}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                borderWidth: 2,
                borderColor: "#dfe0e3",
                backgroundColor: "white",
              }}
            />
          </Marker>
        ))}
      </MapView>
      <SavedModal guides={guides} navigation={navigation} />
    </View>
  );
};

export default SavedGuidesMapView;
