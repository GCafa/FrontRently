export interface UserPasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  repeatNewPassword: string;
}
