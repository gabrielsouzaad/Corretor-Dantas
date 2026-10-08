import api from "./api";
import type { PropertyImage } from "../types/property";

export async function uploadPropertyImages(
  propertyId: number,
  files: File[]
): Promise<PropertyImage[]> {
  const form = new FormData();
  files.forEach((file) => form.append("files", file));


  const response = await api.post<PropertyImage[]>(
    `/properties/${propertyId}/images`,
    form
  );

  return response.data;
}

export async function setCoverImage(
  propertyId: number,
  imageId: number
): Promise<PropertyImage[]> {
  const response = await api.put<PropertyImage[]>(
    `/properties/${propertyId}/images/${imageId}/cover`
  );

  return response.data;
}

export async function deletePropertyImage(
  propertyId: number,
  imageId: number
): Promise<PropertyImage[]> {
  const response = await api.delete<PropertyImage[]>(
    `/properties/${propertyId}/images/${imageId}`
  );

  return response.data;
}