
export interface User {
  id: number | null;
  username: string;
  firstName: string;
  lastName: string;
  password: string | null;
  rights: number;
  creationTime: Date | null;
}
