export interface User {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  role: 'CLIENT' | 'HOST' | 'MODERATOR' | 'ADMIN'; // Enum Role
  createdAt: string;                // LocalDateTime → string (ISO format)
  updatedAt: string;
  imageUrl?: string;
  isActive: boolean;
  balance: number;

  // Relazioni opzionali o da includere solo se necessarie:
  // properties?: Property[];
  // bookings?: Booking[];
  // favorite?: Property[];
  // coupons?: Coupon[];
  // reviews?: Review[];
}
