import api from "./api";
import type {
  Property,
  PropertyPage,
  PropertyStatus,
  PropertyType,
  TransactionType,
} from "../types/property";

export interface PropertySearch {
  city?: string;
  neighborhood?: string;
  type?: PropertyType;
  transactionType?: TransactionType;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: number;
  size?: number;
}

export async function getProperties(
  search: PropertySearch = {}
): Promise<PropertyPage> {
  const params = Object.fromEntries(
    Object.entries(search).filter(
      ([, value]) => value !== undefined && value !== ""
    )
  );

  const response = await api.get<PropertyPage>("/properties", { params });

  return response.data;
}

export async function getAdminProperties(params: {
  status?: PropertyStatus;
  page?: number;
  size?: number;
}): Promise<PropertyPage> {
  const response = await api.get<PropertyPage>("/admin/properties", {
    params,
  });

  return response.data;
}

export async function updatePropertyStatus(
  id: number,
  status: PropertyStatus
): Promise<Property> {
  const response = await api.put<Property>(`/properties/${id}/status`, {
    status,
  });

  return response.data;
}