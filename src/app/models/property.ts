// src/app/models/property.interface.ts
export interface Property {
  id: string; // Maps to property_id
  title: string; // Maps to property_name
  rent: number; // Maps to price
  deposit: number;
  area: number;
  location: string;
  type: string; // Maps to property_type
  furnishing: string;
  availability: string; // Maps to status
  bedrooms?: number; // Optional fields from backend
  bathrooms?: number;
  balconies?: number;
  floorNumber?: number;
  totalFloors?: number;
  yearBuilt?: number;
  viewsCount?: number;
  listedBy?: string | number;
  isFeatured?: boolean;
  imageId?: number;
}