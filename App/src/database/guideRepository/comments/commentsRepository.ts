import { Comment, Guide } from "../../../models/guides";
import { doc, arrayUnion, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "../../../config/firebase";

const updateComments = async (
  guide: Guide,
  newComment: Comment,
  showError: (error: string) => void
) => {
  const guideRef = doc(db, "guides", guide.uid);
  try {
    await updateDoc(guideRef, {
      comments: arrayUnion(newComment),
    });
    console.log("Comments updated successfully");
  } catch (error) {
    console.error("Error updating comments:", error);
    showError("Error updating comments. Please try again.");
  }
};

const deleteComment = async (
  guide: Guide,
  commentToDelete: Comment,
  showError: (error: string) => void
) => {
  const guideRef = doc(db, "guides", guide.uid);
  try {
    await updateDoc(guideRef, {
      comments: arrayRemove(commentToDelete),
    });
    console.log("Comment deleted successfully");
  } catch (error) {
    console.error("Error deleting comment:", error);
    showError("Error deleting comment. Please try again.");
  }
};

export { updateComments, deleteComment };
