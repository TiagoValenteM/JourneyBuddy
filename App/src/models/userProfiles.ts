import uuid from "react-native-uuid";
import { Place } from "./guides";

const defaultProfilePicture =
  "https://i.pinimg.com/originals/fa/60/51/fa6051d72b821cb48a8cc71d3481dfef.jpg";

class UserProfile {
  email: string = "";
  followers: string[] = [];
  following: string[] = [];
  fullName: string = "";
  profilePicturePath: string = defaultProfilePicture;
  uid: string = uuid.v4() as string;
  username: string = "";
  guides: string[] = [];
  savedPlaces: Place[] = [];
  savedGuides: string[] = [];

  constructor(email: string, username: string, fullName: string, uid: string) {
    this.email = email;
    this.username = username;
    this.fullName = fullName;
    this.uid = uid;
    this.followers = [];
    this.following = [];
    this.profilePicturePath = defaultProfilePicture;
    this.guides = [];
    this.savedPlaces = [];
    this.savedGuides = [];
  }

  toJSON() {
    return {
      email: this.email,
      username: this.username,
      fullName: this.fullName,
      uid: this.uid,
      followers: this.followers,
      following: this.following,
      profilePicturePath: this.profilePicturePath,
      guides: this.guides,
      savedPlaces: this.savedPlaces,
      savedGuides: this.savedGuides,
    };
  }
}

export default UserProfile;
