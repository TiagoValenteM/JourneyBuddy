import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Star } from "react-native-feather";
import React, { useEffect } from "react";
import { Guide } from "../models/guides";
import { useError } from "../hooks/useError";
import { getRatingByUser, updateRating } from "../database/guidesRepository";

interface RatingsComponentProps {
  guide: Guide;
  guides: Guide[];
  setGuides: React.Dispatch<React.SetStateAction<Guide[]>>;
  authUserID: string;
}

const RatingsComponent = ({
  guide,
  authUserID,
  guides,
  setGuides,
}: RatingsComponentProps) => {
  const { showError } = useError();
  const [avgRating, setAvgRating] = React.useState(0);
  const [ratingLength, setRatingLength] = React.useState(0);
  const [rated, setRated] = React.useState(0);
  const canNotRate = rated != 0 || authUserID === guide?.user_id;
  const starArray = Array.from({ length: 5 }, (_, index) => index + 1);

  const handleRating = (rate: number) => {
    const newRating = {
      user_id: authUserID,
      rate: rate,
    };

    updateRating(newRating, guide, guides, setGuides, showError).then(
      (newAverageRating) => {
        setRatingLength(ratingLength + 1);
        setAvgRating(newAverageRating!);
      }
    );
  };

  useEffect(() => {
    getRatingByUser(authUserID, guide?.rating).then((rating) => {
      setRated(rating);
    });
    setAvgRating(guide?.averageRating);
    setRatingLength(guide?.rating?.length);
  }, [guide?.averageRating]);

  return (
    <View>
      <View style={ratingStyles.container}>
        <View style={ratingStyles.ratingSection}>
          <Text style={ratingStyles.ratingText}>{avgRating || 0}</Text>
          <Text style={ratingStyles.ratingDescription}>out of 5</Text>
        </View>

        <Text style={ratingStyles.ratingCount}>
          {ratingLength === 1
            ? ratingLength + " Rating"
            : ratingLength + " Ratings"}
        </Text>
      </View>

      <View style={ratingStyles.ratingContainer}>
        <Text style={ratingStyles.ratingTextTitle}>Tap to Rate:</Text>
        <View style={ratingStyles.ratingContainer}>
          {starArray.map((value) => (
            <TouchableOpacity
              key={value}
              style={{ marginHorizontal: 5 }}
              onPress={() => {
                handleRating(value);
                setRated(value);
              }}
              disabled={canNotRate}
            >
              <Star
                width={27}
                height={27}
                stroke={"#FFD700"}
                fill={rated >= value ? "#FFD700" : "transparent"}
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
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#dfe0e3",
    marginBottom: 10,
    paddingBottom: 5,
  },
  ratingSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "50%",
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 45,
    fontWeight: "700",
  },
  ratingDescription: {
    fontSize: 14,
    fontWeight: "500",
    color: "gray",
  },
  ratingCount: {
    fontSize: 16,
    fontWeight: "400",
    color: "gray",
    textAlign: "right",
    alignSelf: "flex-start",
    marginTop: 10,
    marginRight: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingTextTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
});
