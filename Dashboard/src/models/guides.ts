
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

interface Guide {
  uid: string;
  title: string;
  description: string;
  pictures: string[];
  user_id: string;
  author: string;
  rating: Rating[];
  status: string;
  dateCreated: string;
  places: Place[];
  comments: Comment[];
}


export default Guide;