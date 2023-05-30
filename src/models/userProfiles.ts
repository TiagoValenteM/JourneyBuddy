interface UserProfile {
  email: string;
  followers: string[]; // array of user IDs
  following: string[]; // array of user IDs
  fullName: string;
  profilePicturePath: string;
  uid: string;
  username: string;
}
