import React, { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getAllGuides } from "../services/ManageGuides";
import { Guide } from "../models/guides";
import CarouselLocations from "../components/carousels/CarouselLocations";
import CarouselPictures from "../components/carousels/CarouselPictures";
import UserIdentifier from "../components/identifiers/UserIdentifier";
import GuideIdentifier from "../components/identifiers/GuideIdentifier";
import Feather from "react-native-vector-icons/Feather";
import { usePressedGuide } from "../context/pressedGuideContext";

interface HomepageProps {
  navigation: any;
}

function Homepage({ navigation }: HomepageProps) {
  const { setPressedGuide } = usePressedGuide();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchGuides = async () => {
    try {
      const guides = await getAllGuides();
      setGuides(guides);
    } catch (error) {
      console.log("Error fetching guides:", error);
    } finally {
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      setRefreshing(true);
      await fetchGuides();
    };

    fetchData().then();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchGuides().then();
  };

  return (
    <ScrollView
      style={{ flex: 1, paddingHorizontal: 20 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {guides.map((guide, index) => (
        <View key={index} style={{ marginVertical: 10 }}>
          <View style={{ marginVertical: 10 }}>
            <UserIdentifier
              selectedUsername={guide?.author}
              selectedUserUid={guide?.user_id}
              homepage={true}
              navigation={navigation}
            />
          </View>
          <View style={{ marginVertical: 10 }}>
            <GuideIdentifier guide={guide} />
          </View>
          <View style={{ marginVertical: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 20 }}>
              Pictures
            </Text>
            <CarouselPictures images={guide?.pictures} />
          </View>
          <View style={{ marginVertical: 10 }}>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{ fontSize: 20, fontWeight: "700", marginBottom: 20 }}
              >
                Locations
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setPressedGuide(guide);
                  navigation.navigate("MapOverview");
                }}
              >
                <Feather name={"map"} size={25} color={"#000"} />
              </TouchableOpacity>
            </View>
            <CarouselLocations places={guide?.places} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

export default Homepage;
