import React, { useState } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Comment, Guide } from "../models/guides";
import { updateGuideComments } from "../services/ManageGuides";
import { useError } from "../hooks/useError";
import { MessageCircle } from "react-native-feather";

interface CommentsComponentProps {
  guideComments: Comment[];
  guideId: string;
  authUsername: string;
  setPressedGuide: React.Dispatch<React.SetStateAction<Guide | undefined>>;
}

const CommentsComponent = ({
  guideComments,
  guideId,
  authUsername,
  setPressedGuide,
}: CommentsComponentProps) => {
  const [newComment, setNewComment] = useState("");
  const { showError } = useError();

  const handleAddComment = (newComment: string) => {
    if (newComment.length === 0 || newComment === "") {
      showError("Please enter a comment.");
      return;
    }
    updateGuideComments(
      guideId,
      newComment,
      authUsername,
      setPressedGuide,
      showError
    ).then(() => {
      setNewComment("");
    });
  };

  return (
    <View>
      {guideComments && guideComments.length > 0 ? (
        guideComments.slice(0, 3).map((comment, index) => (
          <View style={styles.commentItem} key={index}>
            <Text style={styles.commentUsername}>{"@" + comment.username}</Text>
            <Text style={styles.commentText}>{comment.comment}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noCommentsText}>No comments</Text>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          multiline={true}
          placeholder="Add a comment..."
          onChangeText={(text) => setNewComment(text)}
          value={newComment}
          maxLength={100}
        />
        <TouchableOpacity onPress={() => handleAddComment(newComment)}>
          <MessageCircle
            style={styles.sendIcon}
            width={25}
            height={25}
            color={"#007AFF"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  commentItem: {
    marginVertical: 10,
  },
  commentUsername: {
    fontSize: 12,
    color: "gray",
    fontWeight: "500",
    marginBottom: 5,
  },
  commentText: {
    fontSize: 14,
    fontWeight: "400",
  },
  noCommentsText: {
    fontSize: 15,
    fontWeight: "400",
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  input: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    padding: 10,
    maxHeight: 70,
  },
  sendIcon: {
    marginHorizontal: 10,
  },
});

export default CommentsComponent;
