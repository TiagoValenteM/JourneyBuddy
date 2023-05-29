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
}

interface Place {
  name: string;
  coordinates: Coordinate;
}
interface Coordinate {
  latitude: number;
  longitude: number;
}

export { Guide, Place, Coordinate };
