import {
  Text,
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
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
import Colors from "../../../styles/colorScheme";

interface OverviewGuideViewProps {
  navigation: any;
  route: any;
}

const screenWidth = Dimensions.get("window").width;

function OverviewGuideView({ navigation, route }: OverviewGuideViewProps) {
  const { guide, guides, setGuides } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const { authenticatedUser } = useAuthenticatedUser();
  const scrollY = useRef(new Animated.ValueXY()).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY.y } } }],
    { useNativeDriver: false }
  );

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
          <View style={styles.container}>
            <GuideIdentifier
              guide={guide}
              setGuides={setGuides}
              guides={guides}
            />
          </View>

          <Text style={styles.title}>Creator</Text>
          <View style={styles.container}>
            <UserIdentifier
              username={guide?.author}
              userID={guide?.user_id}
              navigation={navigation}
            />
          </View>

          <Text style={styles.title}>
            Places{"  "}
            <Text style={styles.subtitle}>(Tap the map for more)</Text>
          </Text>
          <View style={[styles.container, { padding: 0 }]}>
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

          <Text style={styles.title}>Ratings</Text>
          <View style={styles.container}>
            <RatingsComponent
              guide={guide}
              authUserID={authenticatedUser!.uid}
            />
          </View>

          <Text style={styles.title}>
            Comments{"  "}
            <Text style={styles.subtitle}>(Tap a comment for more)</Text>
          </Text>
          <View style={styles.container}>
            <CommentsComponent
              guide={guide}
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightGray,
    borderRadius: 10,
    padding: 15,
    margin: 15,
  },
  title: {
    marginTop: 10,
    fontSize: 17,
    fontWeight: "bold",
    marginHorizontal: 15,
    color: Colors.black,
  },
  subtitle: {
    color: Colors.gray,
    fontSize: 12,
    fontWeight: "normal",
  },
});

export default OverviewGuideView;
