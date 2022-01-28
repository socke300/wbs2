
export interface User {
  _id: string | null;
  username: string;
  firstName: string;
  lastName: string;
  password: string | null;
  creationTime: Date | null;
}
