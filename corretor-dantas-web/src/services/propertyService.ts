import api from "./api";
import type { PropertyPage } from "../types/property";

export async function getProperties(): Promise<PropertyPage> {
  const response = await api.get<PropertyPage>("/properties");

  return response.data;
}