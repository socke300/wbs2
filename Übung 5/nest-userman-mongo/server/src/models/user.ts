
export interface User {
  id: string | null;
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string | null;
  rights: number;
  creationTime: Date | null;
}
