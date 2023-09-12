import {
  Text,
  View,
  StyleSheet,
  RefreshControl,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect } from "react";
import LoadingIndicator from "../../components/indicators/LoadingIndicator";
import { useGuide } from "../../context/GuideContext";
import UserIdentifier from "../../components/identifiers/UserIdentifier";
import GuideIdentifier from "../../components/identifiers/GuideIdentifier";
import { useAuthenticatedUser } from "../../context/authenticatedUserContext";
import GuideOptionsModal from "../../components/modals/GuideOptionsModal";
import CarouselPicturesOverview from "../../components/carousels/CarouselPicturesOverview";
import DynamicHeader from "../../components/headers/DynamicHeader";
import Animated, { Value } from "react-native-reanimated";
import RatingsComponent from "../../components/RatingsComponent";
import PlacePreview from "../../components/PlacePreview";
import CommentsComponent from "../../components/CommentsComponent";
import { getSavedGuides } from "../../services/ManageGuides";
interface OverviewGuideViewProps {
  navigation: any;
}

function OverviewGuideView({ navigation }: OverviewGuideViewProps) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const { pressedGuide, guides, setGuides, setPressedGuide } = useGuide();
  const { authenticatedUser } = useAuthenticatedUser();
  const scrollY: Animated.Value<number> = new Value(0); // Initialize scrollY

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  if (pressedGuide === undefined) {
    return <LoadingIndicator />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <DynamicHeader scrollY={scrollY} />
        <Animated.ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={20}
          style={{ flex: 1 }}
        >
          <CarouselPicturesOverview
            images={pressedGuide?.pictures}
            authUserId={authenticatedUser?.uid}
            guideAuthId={pressedGuide?.user_id}
            navigation={navigation}
            setModalVisible={setModalVisible}
          />
          <View style={overviewGuideStyles.container}>
            <GuideIdentifier guide={pressedGuide} />
          </View>

          <Text style={overviewGuideStyles.title}>Creator</Text>
          <View style={overviewGuideStyles.container}>
            <UserIdentifier
              selectedUsername={pressedGuide?.author}
              selectedUserUid={pressedGuide?.user_id}
              homepage={false}
            />
          </View>

          <Text style={overviewGuideStyles.title}>
            Places{"  "}
            <Text style={overviewGuideStyles.subtitle}>
              (Tap the map for more)
            </Text>
          </Text>
          <View style={[overviewGuideStyles.container, { padding: 0 }]}>
            <PlacePreview
              place={pressedGuide.places[0]}
              onPress={() => {
                navigation.navigate("MapOverview", {
                  places: pressedGuide?.places,
                  title: "Places",
                });
              }}
            />
          </View>

          <Text style={overviewGuideStyles.title}>Ratings</Text>
          <View style={overviewGuideStyles.container}>
            <RatingsComponent
              pressedGuide={pressedGuide}
              authUserId={authenticatedUser!.uid}
              setPressedGuide={setPressedGuide}
            />
          </View>

          <Text style={overviewGuideStyles.title}>
            Comments{"  "}
            <Text style={overviewGuideStyles.subtitle}>
              (Tap a comment for more)
            </Text>
          </Text>
          <View style={overviewGuideStyles.container}>
            <CommentsComponent
              guideComments={pressedGuide?.comments}
              guideId={pressedGuide?.uid}
              authUsername={authenticatedUser!.username}
              setPressedGuide={setPressedGuide}
            />
          </View>
        </Animated.ScrollView>
        {modalVisible && (
          <GuideOptionsModal
            setModalVisible={setModalVisible}
            navigation={navigation}
            guideUid={pressedGuide?.uid}
            guides={guides}
            setGuides={setGuides}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const overviewGuideStyles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    margin: 15,
  },
  title: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 15,
  },
  subtitle: {
    color: "gray",
    fontSize: 12,
    fontWeight: "400",
  },
});

export default OverviewGuideView;
