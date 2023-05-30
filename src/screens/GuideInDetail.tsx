import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { Guide } from "../models/guides";
import average from "../utils/average";
import MapView, { Marker } from "react-native-maps";
import React from "react";
import Feather from "react-native-vector-icons/Feather";

interface GuideInDetailScreenProps {
  selectedGuide?: Guide | null;
}

function GuideInDetailScreen({ selectedGuide }: GuideInDetailScreenProps) {
  const [rating, setRating] = React.useState(0);
  const [comments, setComments] = React.useState([]);
  const [newComment, setNewComment] = React.useState("");
  const averageRating = selectedGuide?.rating
    ? average(selectedGuide.rating)
    : 0;

  const handleRating = (value) => {
    setRating(value);
  };

  const handleAddComment = (comment) => {
    setComments([...comments, comment]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.author}>{"@" + selectedGuide?.author}</Text>
      <Text style={styles.title}>{selectedGuide?.title}</Text>
      <Text style={styles.description}>{selectedGuide?.description}</Text>
      <Text style={styles.averageRating}>{averageRating}</Text>
      <Text style={styles.date}>{selectedGuide?.dateCreated.slice(0, 10)}</Text>

      <View style={styles.imageContainer}>
        {selectedGuide?.pictures?.map((picture, index) => (
          <Image style={styles.image} source={{ uri: picture }} key={index} />
        ))}
      </View>

      <View style={styles.placesContainer}>
        {selectedGuide?.places.map((place, index) => (
          <View key={index} style={styles.place}>
            <Text style={styles.placeName}>{place?.name}</Text>
            <Text style={styles.placeCoordinates}>
              {place?.coordinates?.latitude}
            </Text>
            <Text style={styles.placeCoordinates}>
              {place?.coordinates?.longitude}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude:
              selectedGuide?.places[0]?.coordinates?.latitude || 38.7223,
            longitude:
              selectedGuide?.places[0]?.coordinates?.longitude || -9.1393,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {selectedGuide?.places.map((place, index) => (
            <Marker coordinate={place?.coordinates} key={index} />
          ))}
        </MapView>
      </View>

      <View style={styles.ratingContainer}>
        <Text style={styles.tapToRateText}>Tap to Rate:</Text>
        <View style={styles.ratingStars}>
          {[1, 2, 3, 4, 5].map((value) => (
            <TouchableOpacity
              key={value}
              style={styles.starButton}
              onPress={() => handleRating(value)}
            >
              <Feather
                name="star"
                style={rating >= value ? styles.starFilled : styles.starOutline}
                size={30}
                color="#FFD700"
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.commentsContainer}>
        <Text style={styles.commentsHeading}>Comments</Text>
        {selectedGuide?.comments?.map((comment, index) => (
          <View style={styles.commentItem} key={index}>
            <Text style={styles.commentText}>{comment}</Text>
          </View>
        ))}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
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
    color: "#FFD700",
  },
  starOutline: {
    color: "grey",
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

export default GuideInDetailScreen;
