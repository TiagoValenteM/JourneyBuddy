interface Guide {
  uid: string;
  title: string;
  description: string;
  pictures: string[];
  user_id: string;
  author: string;
  rating: number[];
  status: string;
  dateCreated: string;
  places: Place[];
  comments: Comment[];
}

interface Place {
  name: string;
  coordinates: Coordinate;
}
interface Coordinate {
  latitude: number;
  longitude: number;
}
interface Comment {
  user_id: string;
  comment: string;
}

export { Guide, Place, Coordinate, Comment };
