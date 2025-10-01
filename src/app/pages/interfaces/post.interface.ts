export interface Post {
  _id?: string;
  title: string;
  content: string;
  author: string;
  authorImage: string;
  fandom: string;
  comments: Comment[];
  date: Date;
}

export interface Comment {
  author: string;
  content: string;
  authorImage: string;
  date: Date;
}