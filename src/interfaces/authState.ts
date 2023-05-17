import { IUser } from "./user";

export interface AuthState {
  isLoggedIn: boolean,
  user?: IUser
}