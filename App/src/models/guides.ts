import uuid from "react-native-uuid";
import UserProfile from "./userProfiles";

interface Place {
  name: string;
  coordinates: Coordinate;
}
interface Coordinate {
  latitude: number;
  longitude: number;
}
interface Comment {
  username: string;
  comment: string;
}

interface Rating {
  user_id: string;
  rate: number;
}

class Guide {
  uid: string = uuid.v4() as string;
  title: string = "";
  description: string = "";
  pictures: string[] = [];
  user_id: string = "";
  author: string = "";
  rating: Rating[] = [];
  status: string = "pending";
  dateCreated: string = new Date().toISOString();
  places: Place[] = [];
  comments: Comment[] = [];

  constructor(authenticatedUser?: UserProfile, previousGuide?: Guide) {
    if (previousGuide) {
      this.uid = previousGuide.uid;
      this.title = previousGuide.title;
      this.description = previousGuide.description;
      this.pictures = previousGuide.pictures;
      this.user_id = previousGuide.user_id;
      this.author = previousGuide.author;
      this.rating = previousGuide.rating;
      this.status = previousGuide.status;
      this.dateCreated = previousGuide.dateCreated;
      this.places = previousGuide.places;
      this.comments = previousGuide.comments;
    }

    if (authenticatedUser) {
      this.author = authenticatedUser?.username;
      this.user_id = authenticatedUser?.uid;
    }
  }
}

export { Guide, Place, Coordinate, Comment, Rating };
