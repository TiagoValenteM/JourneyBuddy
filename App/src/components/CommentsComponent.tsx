import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Comment, Guide } from "../models/guides";
import { useError } from "../hooks/useError";
import { MessageCircle, Trash } from "react-native-feather";
import Colors from "../../styles/colorScheme";
import {
  deleteComment,
  updateComments,
} from "../database/guideRepository/comments/commentsRepository";

interface CommentsComponentProps {
  guide: Guide;
  authUsername: string;
}

const CommentsComponent = ({ guide, authUsername }: CommentsComponentProps) => {
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const { showError } = useError();

  const handleAddComment = (comment: string, authUsername: string) => {
    if (comment.length === 0 || comment === "") {
      showError("Please enter a comment.");
      return;
    }

    const newComment: Comment = {
      username: authUsername,
      comment: comment,
    };

    updateComments(guide, newComment, showError).then(() => {
      setComments([...comments, newComment]);
      setComment("");
    });
  };

  const handleDeleteComment = (comment: Comment) => {
    deleteComment(guide, comment, showError).then(() => {
      setComments(
        comments.filter((deletedComment) => deletedComment !== comment)
      );
    });
  };

  useEffect(() => {
    setComments(guide?.comments || []);
  }, [guide]);

  return (
    <View>
      {comments && comments?.length > 0 ? (
        comments?.slice(0, 3).map((comment, index) => (
          <View key={index} style={styles.commentContainer}>
            <View style={styles.commentItem}>
              <Text style={styles.commentUsername}>
                {"@" + comment.username}
              </Text>
              <Text style={styles.commentText}>{comment.comment}</Text>
            </View>
            {comment.username === authUsername && (
              <Pressable
                onPress={() => {
                  handleDeleteComment(comment);
                }}
              >
                <Trash width={18} height={18} color={Colors.red} />
              </Pressable>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.noCommentsText}>No comments yet.</Text>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          multiline={true}
          placeholder="Add a comment..."
          placeholderTextColor={Colors.gray}
          onChangeText={(text) => setComment(text)}
          value={comment}
          maxLength={100}
        />
        <TouchableOpacity
          onPress={() => handleAddComment(comment, authUsername)}
        >
          <MessageCircle
            style={styles.sendIcon}
            width={25}
            height={25}
            color={Colors.blue}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: "row",
    marginVertical: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  commentItem: {
    flexDirection: "column",
    maxWidth: "80%",
  },
  commentUsername: {
    fontSize: 13,
    color: Colors.gray,
    fontWeight: "bold",
    marginBottom: 5,
  },
  commentText: {
    fontSize: 15,
    fontWeight: "normal",
    color: Colors.black,
  },
  noCommentsText: {
    fontSize: 15,
    fontWeight: "normal",
    marginTop: 10,
    color: Colors.gray,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 10,
    maxHeight: 70,
  },
  sendIcon: {
    marginLeft: 20,
  },
});

export default CommentsComponent;
