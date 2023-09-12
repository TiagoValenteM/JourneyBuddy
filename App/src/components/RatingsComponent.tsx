import { Text, TouchableOpacity, View, StyleSheet, Alert } from "react-native";
import { Star } from "react-native-feather";
import React from "react";
import average from "../utils/average";
import { Guide } from "../models/guides";
import {
  getRatingByUser,
  hasRatedByUser,
  UpdateGuideRating,
} from "../services/ManageGuides";
import { useError } from "../hooks/useError";

interface RatingsComponentProps {
  pressedGuide: Guide;
  setPressedGuide: React.Dispatch<React.SetStateAction<Guide | undefined>>;
  authUserId: string;
}

const RatingsComponent = ({
  pressedGuide,
  setPressedGuide,
  authUserId,
}: RatingsComponentProps) => {
  const { showError } = useError();
  const [rating, setRating] = React.useState(0);
  const averageRating = pressedGuide?.rating
    ? average(pressedGuide?.rating?.map((rating) => rating.rate))
    : 0;

  const handleRating = (rate: number) => {
    if (hasRatedByUser(authUserId, pressedGuide?.rating)) {
      return Alert.alert("You have already rated this guide");
    }
    UpdateGuideRating(
      pressedGuide!.uid,
      rate,
      authUserId,
      setPressedGuide,
      showError
    );
  };

  const votedRating = getRatingByUser(authUserId, pressedGuide?.rating);

  return (
    <View>
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
          {pressedGuide?.rating?.length === 1
            ? pressedGuide?.rating?.length + " Rating"
            : pressedGuide?.rating?.length + " Ratings"}
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
                if (authUserId !== pressedGuide?.user_id) {
                  handleRating(value);
                  setRating(value);
                }
              }}
            >
              <Star
                width={30}
                height={30}
                stroke={"#FFD700"}
                fill={
                  rating >= value || (votedRating && votedRating >= value)
                    ? "#FFD700"
                    : "transparent"
                }
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default RatingsComponent;

const ratingStyles = StyleSheet.create({
  container: {
    flex: 1,
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
