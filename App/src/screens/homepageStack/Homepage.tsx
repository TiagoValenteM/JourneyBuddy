import React, { useState, useEffect } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Guide } from "../../models/guides";
import CarouselLocations from "../../components/carousels/CarouselLocations";
import CarouselPictures from "../../components/carousels/CarouselPictures";
import UserIdentifier from "../../components/identifiers/UserIdentifier";
import GuideIdentifier from "../../components/identifiers/GuideIdentifier";
import Feather from "react-native-vector-icons/Feather";
import { getGuidesSorted } from "../../services/GuidesService";

interface HomepageProps {
  navigation: any;
}

function HomepageView({ navigation }: HomepageProps) {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGuides = async () => {
    try {
      const fetchedGuides = await getGuidesSorted();
      setGuides(fetchedGuides);
    } catch (error) {
      console.error("Error fetching guides:", error);
      // Handle the error gracefully, e.g., show an error message to the user.
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setRefreshing(true);
    fetchGuides().then(() => setRefreshing(false));
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchGuides().then(() => setRefreshing(false));
  };

  const renderGuideItem = ({ item: guide }: { item: Guide }) => (
    <View style={{ marginVertical: 10 }}>
      <View style={{ marginVertical: 10 }}>
        <UserIdentifier
          selectedUsername={guide?.author}
          selectedUserUid={guide?.user_id}
          homepage={true}
          navigation={navigation}
        />
      </View>
      <View style={{ marginVertical: 10 }}>
        <GuideIdentifier guide={guide} navigation={navigation} />
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
          <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 20 }}>
            Locations
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("MapOverview", {
                places: guide?.places,
                title: "Places",
              });
            }}
          >
            <Feather name={"map"} size={25} color={"#000"} />
          </TouchableOpacity>
        </View>
        <CarouselLocations places={guide?.places} />
      </View>
    </View>
  );

  return (
    <FlatList
      style={{ flex: 1, paddingHorizontal: 20 }}
      data={guides}
      renderItem={renderGuideItem}
      keyExtractor={(item) => item.uid.toString()}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}

export default HomepageView;
