import {
  Text,
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import LoadingIndicator from "../../components/indicators/LoadingIndicator";
import { useGuide } from "../../context/GuideContext";
import UserIdentifier from "../../components/identifiers/UserIdentifier";
import GuideIdentifier from "../../components/identifiers/GuideIdentifier";
import { useAuthenticatedUser } from "../../context/authenticatedUserContext";
import GuideOptionsModal from "../../components/modals/GuideOptionsModal";
import CarouselPicturesOverview from "../../components/carousels/CarouselPicturesOverview";
import DynamicHeader from "../../components/headers/DynamicHeader";
import RatingsComponent from "../../components/RatingsComponent";
import PlacePreview from "../../components/PlacePreview";
import CommentsComponent from "../../components/CommentsComponent";
import { useRef, useState } from "react";
import { Animated } from "react-native";
interface OverviewGuideViewProps {
  navigation: any;
  route: any;
}

const screenWidth = Dimensions.get("window").width;

function OverviewGuideView({ navigation, route }: OverviewGuideViewProps) {
  const { guide } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const { guides, setGuides } = useGuide();
  const { authenticatedUser } = useAuthenticatedUser();
  const scrollY = useRef(new Animated.ValueXY()).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY.y } } }],
    { useNativeDriver: false }
  );

  if (guide === undefined) {
    return <LoadingIndicator />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <DynamicHeader
        screenWidth={screenWidth}
        scrollY={scrollY}
        authUserId={authenticatedUser!.uid}
        guideAuthId={guide?.user_id}
        setModalVisible={setModalVisible}
        navigation={navigation}
      />
      <Animated.ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
        contentInsetAdjustmentBehavior="never"
      >
        <CarouselPicturesOverview
          scrollY={scrollY}
          images={guide?.pictures}
          pictureSize={screenWidth}
        />
        <Animated.View
          style={{
            transform: [
              {
                translateY: scrollY.y.interpolate({
                  inputRange: [-500, 0],
                  outputRange: [720, 0],
                  extrapolate: "clamp",
                }),
              },
            ],
          }}
        >
          <View style={overviewGuideStyles.container}>
            <GuideIdentifier guide={guide} />
          </View>

          <Text style={overviewGuideStyles.title}>Creator</Text>
          <View style={overviewGuideStyles.container}>
            <UserIdentifier
              selectedUsername={guide?.author}
              selectedUserUid={guide?.user_id}
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
              place={guide.places[0]}
              onPress={() => {
                navigation.navigate("MapOverview", {
                  places: guide?.places,
                  title: "Places",
                });
              }}
            />
          </View>

          <Text style={overviewGuideStyles.title}>Ratings</Text>
          <View style={overviewGuideStyles.container}>
            <RatingsComponent
              guide={guide}
              authUserID={authenticatedUser!.uid}
              guides={guides}
              setGuides={setGuides}
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
              guide={guide}
              guides={guides}
              setGuides={setGuides}
              authUsername={authenticatedUser!.username}
            />
          </View>
        </Animated.View>
      </Animated.ScrollView>
      {modalVisible && (
        <GuideOptionsModal
          setModalVisible={setModalVisible}
          navigation={navigation}
          guideUid={guide?.uid}
          guides={guides}
          setGuides={setGuides}
        />
      )}
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
