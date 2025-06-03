import { User } from './user';

export interface Property {
  id: number;
  host: User;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pricePerNight: number;     // BigDecimal → number
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  isAvailable: boolean;
  createdAt: string;         // LocalDateTime → ISO string
  updatedAt: string;
  propertyImages: string[];

  // Opzionali, includili solo se il backend li restituisce nella response:
  // bookings?: Booking[];
  // reviews?: Review[];
  // favoritedBy?: User[];
}
