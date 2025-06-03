import { User } from './user';
import { Property } from './property';

export interface BookingCreateRequest {
  checkInDate: string;
  checkOutDate: string;
  numOfAdults: number;
  numOfChildren?: number;
  bookingConfirmationCode: string;
  user: User;
  property: Property;
  couponCode?: string;
}
