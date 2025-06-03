export interface PropertyUpdateRequest {
  title: string;
  description: string;
  pricePerNight: number;      
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  isActive?: boolean;
}
