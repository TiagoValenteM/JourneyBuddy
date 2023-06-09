import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  RefreshControl,
} from "react-native";
import { Guide } from "../../models/guides";
import average from "../../utils/average";
import React from "react";
import Feather from "react-native-vector-icons/Feather";
import {
  deleteGuide,
  getGuideDetailed,
  getRatingByUser,
  hasRatedByUser,
  updateGuideComments,
  UpdateGuideRating,
} from "../../services/ManageGuides";
import LoadingIndicator from "../../components/indicators/LoadingIndicator";
import { usePressedGuide } from "../../context/pressedGuideContext";
import CarouselLocations from "../../components/carousels/CarouselLocations";
import CarouselPictures from "../../components/carousels/CarouselPictures";
import UserIdentifier from "../../components/identifiers/UserIdentifier";
import GuideIdentifier from "../../components/identifiers/GuideIdentifier";
import { useAuthenticatedUser } from "../../context/authenticatedUserContext";

interface GuideInDetailScreenProps {
  navigation: any;
}

function OverviewGuideView({ navigation }: GuideInDetailScreenProps) {
  const { pressedGuide, guides, setGuides } = usePressedGuide();
  const { authenticatedUser, setAuthenticatedUser } = useAuthenticatedUser();
  const [rating, setRating] = React.useState(0);
  const [newComment, setNewComment] = React.useState("");
  const [fetchTrigger, setFetchTrigger] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedGuide, setSelectedGuide] = React.useState<Guide | undefined>(
    undefined
  );

  const fetchData = async () => {
    try {
      if (pressedGuide?.uid) {
        const guide = await getGuideDetailed(pressedGuide.uid);
        setSelectedGuide(guide);
      }
    } catch (error) {}
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData().finally(() => setRefreshing(false));
  };

  React.useEffect(() => {
    onRefresh();
  }, [fetchTrigger]);

  if (selectedGuide === undefined) {
    return <LoadingIndicator />;
  }

  const handleFetchAgain = () => {
    setFetchTrigger(!fetchTrigger);
  };

  const averageRating = selectedGuide?.rating
    ? average(selectedGuide?.rating?.map((rating) => rating.rate))
    : 0;

  const handleRating = (rate: number) => {
    if (hasRatedByUser(authenticatedUser!.uid, selectedGuide?.rating)) {
      return Alert.alert("You have already rated this guide");
    }
    UpdateGuideRating(selectedGuide!!.uid, rate, authenticatedUser!.uid).then(
      () => {
        handleFetchAgain();
      }
    );
  };

  const handleAddComment = (newComment: string) => {
    updateGuideComments(
      selectedGuide!!.uid,
      newComment,
      authenticatedUser!.username
    ).then(() => {
      handleFetchAgain();
      setNewComment("");
    });
  };

  const confirmDeleteGuide = (guideId: string) => {
    Alert.alert("Delete Guide", "Are you sure you want to delete this guide?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteGuide(
            guideId,
            authenticatedUser,
            setAuthenticatedUser,
            guides,
            setGuides
          ).then(navigation.navigate("Profile"));
        },
      },
    ]);
  };

  const votedRating = getRatingByUser(
    authenticatedUser!.uid,
    selectedGuide?.rating
  );

  return (
    <ScrollView
      style={ratingStyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {authenticatedUser?.uid === selectedGuide?.user_id ? (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: 20,
            marginBottom: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("EditGuideScreen");
            }}
            style={{ marginRight: 15 }}
          >
            <Feather name={"edit"} size={28} color={"#000"} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              confirmDeleteGuide(selectedGuide?.uid);
            }}
          >
            <Feather name={"trash"} size={28} color={"#000"} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ marginTop: 20 }}></View>
      )}

      <View style={{ marginBottom: 40 }}>
        <UserIdentifier
          selectedUsername={selectedGuide?.author}
          selectedUserUid={selectedGuide?.user_id}
          homepage={false}
        />
      </View>

      <View style={{ marginBottom: 40 }}>
        <GuideIdentifier guide={selectedGuide} />
      </View>

      <View style={{ marginBottom: 40 }}>
        <Text style={ratingStyles.sectionTitle}>Pictures</Text>
        <CarouselPictures images={selectedGuide?.pictures} />
      </View>

      <View style={{ marginBottom: 40 }}>
        <View style={ratingStyles.containerRowBetweenWithoutBorder}>
          <Text style={ratingStyles.sectionTitle}>Locations</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("FullScreenMap");
            }}
          >
            <Feather name={"map"} size={25} color={"#000"} />
          </TouchableOpacity>
        </View>
        <CarouselLocations places={selectedGuide?.places} />
      </View>

      <View style={ratingStyles.containerBottomMargin}>
        <Text style={ratingStyles.sectionTitle}>Ratings</Text>
        <View style={ratingStyles.containerRowBetween}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              maxWidth: 150,
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                fontSize: 45,
                fontWeight: "800",
              }}
            >
              {averageRating}
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "500", color: "gray" }}>
              out of 5
            </Text>
          </View>

          <Text
            style={{
              fontSize: 16,
              fontWeight: "400",
              color: "gray",
              textAlign: "right",
              alignSelf: "flex-start",
              marginTop: 10,
              marginRight: 10,
            }}
          >
            {selectedGuide?.rating?.length === 1
              ? selectedGuide?.rating?.length + " Rating"
              : selectedGuide?.rating?.length + " Ratings"}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "500" }}>Tap to Rate:</Text>
          <View style={{ flexDirection: "row" }}>
            {[1, 2, 3, 4, 5].map((value) => (
              <TouchableOpacity
                key={value}
                style={{ marginHorizontal: 5 }}
                onPress={() => {
                  if (authenticatedUser?.uid !== selectedGuide?.user_id) {
                    handleRating(value);
                    setRating(value);
                  }
                }}
              >
                <Feather
                  name="star"
                  style={
                    rating >= value || (votedRating && votedRating >= value)
                      ? { color: "#007AFF" }
                      : { color: "gray" }
                  }
                  size={30}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={ratingStyles.containerBottomMargin}>
        <Text style={ratingStyles.sectionTitle}>Comments</Text>
        {selectedGuide?.comments && selectedGuide.comments.length > 0 ? (
          selectedGuide.comments.map((comment, index) => (
            <View style={styles.commentItem} key={index}>
              <Text style={styles.commentText}>{comment.comment}</Text>
              <Text style={styles.commentAuthor}>{"@" + comment.username}</Text>
            </View>
          ))
        ) : (
          <Text>No comments</Text>
        )}
      </View>

      <View style={styles.addCommentContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          onChangeText={(text) => setNewComment(text)}
          value={newComment}
        />
        <TouchableOpacity
          style={styles.commentButton}
          onPress={() => handleAddComment(newComment)}
        >
          <Text style={styles.commentButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const ratingStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
  },
  containerBottomMargin: {
    marginBottom: 40,
  },
  containerRowBetween: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#dfe0e3",
    marginBottom: 10,
  },
  containerRowBetweenWithoutBorder: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const styles = StyleSheet.create({
  author: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  averageRating: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: "grey",
    marginBottom: 20,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  image: {
    width: "33%",
    height: 100,
    marginBottom: 10,
    borderRadius: 10,
  },
  placesContainer: {
    marginBottom: 20,
  },
  place: {
    marginBottom: 10,
  },
  placeName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  placeCoordinates: {
    fontSize: 14,
    color: "grey",
  },
  mapContainer: {
    borderRadius: 20,
    marginBottom: 20,
  },
  map: {
    width: "100%",
    height: 300,
    borderRadius: 20,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  tapToRateText: {
    fontSize: 16,
    fontWeight: "600",
  },
  ratingStars: {
    flexDirection: "row",
  },
  starButton: {
    marginHorizontal: 5,
  },
  starFilled: {
    color: "#007AFF",
  },
  starOutline: {
    color: "gray",
  },
  commentsContainer: {
    marginBottom: 20,
  },
  commentsHeading: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  commentItem: {
    backgroundColor: "#F2F2F2",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  commentText: {
    fontSize: 16,
  },
  commentAuthor: {
    fontSize: 14,
    color: "grey",
  },
  addCommentContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  commentButton: {
    marginLeft: 10,
    paddingHorizontal: 20,
    height: 40,
    backgroundColor: "#FFD700",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  commentButtonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default OverviewGuideView;
