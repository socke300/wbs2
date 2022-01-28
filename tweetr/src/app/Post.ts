import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export class Post {
  dId?: string;
  text: string;
  userId: string;
  email: string;
  time: Timestamp;

  constructor(text: string, userId: string, email: string, time: Timestamp) {
    this.text = text;
    this.userId = userId;
    this.time = time;
    this.email = email;
  }
}
