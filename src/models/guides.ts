interface Guide {
  title: string;
  description: string;
  coverPhotoPath: string;
  uid: string;
  author: string;
  rating: number[];
  status: string;
  dateCreated: string;
  places: Place[];
}

interface Place {
  name: string;
  lat: number;
  lng: number;
}
