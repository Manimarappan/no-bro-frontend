// src/app/models/property.interface.ts
export interface Property {
  id: string; // Maps to property_id
  title: string; // Maps to property_name
  price: number; // Maps to price
  deposit: number;
  address?: number;
  bhk:string;
  area: number;
  propertyType: string; // Maps to property_type
  furnishing: string;
  status: string; // Maps to status
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
  parking?: boolean;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
  city: string;
  location : string
}