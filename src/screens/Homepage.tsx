import React, { useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { getAllGuides } from "../services/ManageGuides";
import { Guide } from "../models/guides";
import CarouselLocations from "../components/carousels/CarouselLocations";
import CarouselPictures from "../components/carousels/CarouselPictures";
import UserIdentifier from "../components/identifiers/UserIdentifier";
import GuideIdentifier from "../components/identifiers/GuideIdentifier";

interface HomepageProps {
  navigation: any;
}

function Homepage({ navigation }: HomepageProps) {
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
            <CarouselPictures images={guide?.pictures} />
          </View>
          <View style={{ marginVertical: 10 }}>
            <CarouselLocations places={guide?.places} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

export default Homepage;
