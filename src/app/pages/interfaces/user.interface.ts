export interface UserProfile {
  type: string;
  level: string;
  bio: string;
  age?: string;
  interests: string[];
  friends: string[];
  pending_friends: string[];
  fandoms: string[];
  subscribed: string[];
}

export interface User {
  username: string;
  email: string;
  password: string;
  image: string;
  profile: UserProfile;
}