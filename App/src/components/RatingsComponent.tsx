import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Star } from "react-native-feather";
import React, { useEffect } from "react";
import { Guide, Rating } from "../models/guides";
import { useError } from "../hooks/useError";
import Colors from "../../styles/colorScheme";
import { updateRating } from "../database/guideRepository/ratings/ratingsRepository";

interface RatingsComponentProps {
  guide: Guide;
  authUserID: string;
}

const RatingsComponent = ({ guide, authUserID }: RatingsComponentProps) => {
  const [rated, setRated] = React.useState<number>(0);
  const [canRate, setCanRate] = React.useState<boolean>(true);
  const starArray = Array.from({ length: 5 }, (_, index) => index + 1);
  const { showError } = useError();

  const handleRating = (rate: number) => {
    setCanRate(false);
    setRated(rate);

    const newRating = {
      user_id: authUserID,
      rate: rate,
    };

    updateRating(newRating, guide, showError).catch(() => {
      showError("Error updating rating. Please try again.");
    });
  };

  const getRating = (userID: string, ratings: Rating[]): void => {
    const rating = ratings.find((rating) => rating.user_id === userID);
    const rate = rating?.rate || 0;

    if (authUserID !== guide.user_id) {
      if (rate > 0) {
        setCanRate(false);
        setRated(rate);
      } else {
        setCanRate(true);
      }
    } else {
      setCanRate(false);
    }
  };

  useEffect(() => {
    getRating(authUserID, guide.rating);
  }, []);

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.ratingSection}>
          <Text style={styles.ratingText}>{guide?.averageRating || 0}</Text>
          <Text style={styles.ratingDescription}>out of 5</Text>
        </View>

        <Text style={styles.ratingCount}>
          {guide?.rating?.length === 1
            ? guide?.rating?.length + " Rating"
            : guide?.rating?.length + " Ratings"}
        </Text>
      </View>

      <View style={styles.ratingContainer}>
        <Text style={styles.ratingTextTitle}>Tap to Rate:</Text>
        <View style={styles.ratingContainer}>
          {starArray.map((value) => (
            <TouchableOpacity
              key={value}
              style={{ marginHorizontal: 5 }}
              onPress={() => {
                handleRating(value);
              }}
              disabled={!canRate}
            >
              <Star
                width={27}
                height={27}
                stroke={Colors.yellow}
                fill={rated >= value ? Colors.yellow : "transparent"}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default RatingsComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: Colors.white,
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
    fontWeight: "bold",
    color: Colors.black,
  },
  ratingDescription: {
    fontSize: 15,
    fontWeight: "normal",
    color: Colors.gray,
  },
  ratingCount: {
    fontSize: 15,
    fontWeight: "normal",
    color: Colors.gray,
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
    fontSize: 15,
    fontWeight: "bold",
    color: Colors.darkGray,
  },
});
