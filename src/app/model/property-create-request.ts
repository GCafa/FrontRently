export interface PropertyCreateRequest {
  title: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pricePerNight: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
}
