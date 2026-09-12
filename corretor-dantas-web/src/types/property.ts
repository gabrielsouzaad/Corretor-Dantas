export type PropertyType =
  | "HOUSE"
  | "APARTMENT"
  | "LAND"
  | "COMMERCIAL";

export type TransactionType =
  | "SALE"
  | "RENT";

export type PropertyStatus =
  | "AVAILABLE"
  | "SOLD"
  | "RENTED"
  | "INACTIVE";

export interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  type: PropertyType;
  transactionType: TransactionType;
  bedrooms: number;
  bathrooms: number;
  area: number;
  city: string;
  neighborhood: string;
  address: string;
  status: PropertyStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyPage {
  content: Property[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}