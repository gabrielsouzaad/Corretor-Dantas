import { API_URL } from "../services/api";

export function getImageUrl(path: string): string {
  return `${API_URL}${path}`;
}