//Others interfaces
import { AuthState } from "./authState";
import { CartState } from "./cartState";
import { UiState } from "./uiState";

export interface StateCurrent {
  ui: UiState;
  cart: CartState;
  auth: AuthState
}