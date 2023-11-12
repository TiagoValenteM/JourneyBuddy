import { Guide, Rating } from "../../../models/guides";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";

const updateRating = async (
  newRating: Rating,
  guide: Guide,
  showError: (message: string) => void
): Promise<void> => {
  const guideRef = doc(db, "guides", guide.uid);

  const backupRating = [...guide.rating];
  const backupAverage = guide.averageRating;

  try {
    guide.rating = [...guide.rating, newRating];
    const newAverage =
      guide.rating.reduce((sum, rating) => sum + rating.rate, 0) /
      guide.rating.length;
    guide.averageRating = parseFloat(newAverage.toFixed(1));

    await updateDoc(guideRef, {
      rating: arrayUnion(newRating),
      averageRating: newAverage.toFixed(1),
    });

    console.log("Rating updated successfully");
  } catch (error) {
    console.log("Error updating rating:", error);
    showError("Error updating rating. Please try again later.");

    guide.rating = backupRating;
    guide.averageRating = backupAverage;
  }
};

export { updateRating };
