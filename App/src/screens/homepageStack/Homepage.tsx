import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
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
import { Map } from "react-native-feather";
import { getGuidesSorted } from "../../database/guideRepository/guideRepository";
import Colors from "../../../styles/colorScheme";

interface HomepageProps {
  navigation: any;
}

function HomepageView({ navigation }: HomepageProps) {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [lastVisibleGuide, setLastVisibleGuide] = useState(undefined);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchGuides = async () => {
    try {
      if (hasMore) {
        setLoadingMore(true);
        const guidesResponse = await getGuidesSorted(lastVisibleGuide);

        if (guidesResponse?.guides?.length > 0) {
          // Append the fetched guides to the existing ones
          setGuides((prevGuides) => [...prevGuides, ...guidesResponse.guides]);
          setLastVisibleGuide(guidesResponse.lastGuideSnapshot);
        } else {
          // No more guides to load, set hasMore to false
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Error fetching guides:", error);
      // Handle the error gracefully
    } finally {
      setRefreshing(false);
      setLoadingMore(false); // Set loading more to false
    }
  };

  useEffect(() => {
    setRefreshing(true);
    fetchGuides().then(() => setRefreshing(false));
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setHasMore(true); // Reset hasMore flag
    setGuides([]); // Reset guides
    setLastVisibleGuide(undefined);
    fetchGuides().then(() => setRefreshing(false));
  };

  const onEndReached = () => {
    if (hasMore && !loadingMore) {
      fetchGuides();
    }
  };

  const renderGuideItem = ({ item: guide }: { item: Guide }) => (
    <View style={{ marginVertical: 10 }}>
      <View style={{ marginVertical: 10 }}>
        <UserIdentifier
          username={guide?.author}
          userID={guide?.user_id}
          navigation={navigation}
        />
      </View>
      <View style={{ marginVertical: 10 }}>
        <GuideIdentifier
          guide={guide}
          guides={guides}
          setGuides={setGuides}
          navigation={navigation}
        />
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
            <Map width={25} height={25} color={"black"} />
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
      ListFooterComponent={() => {
        if (loadingMore) {
          return (
            <ActivityIndicator
              style={{ marginVertical: 10 }}
              size="small"
              color="#000"
            />
          );
        } else {
          return (
            <View
              style={{
                marginVertical: 20,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 14,
                  fontWeight: "bold",
                  color: Colors.darkGray,
                }}
              >
                You've all caught up!
              </Text>
            </View>
          );
        }
      }}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.2}
    />
  );
}

export default HomepageView;
