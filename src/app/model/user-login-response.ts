export interface UserLoginResponse {
  jwt: string;

  user: {
    isActive: boolean;
  }
}
