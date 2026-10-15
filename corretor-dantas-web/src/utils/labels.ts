import type {
  PropertyStatus,
  PropertyType,
  TransactionType,
} from "../types/property";

export const STATUS_LABELS: Record<PropertyStatus, string> = {
  AVAILABLE: "Disponível",
  SOLD: "Vendido",
  RENTED: "Alugado",
  INACTIVE: "Inativo",
};

export const TYPE_LABELS: Record<PropertyType, string> = {
  HOUSE: "Casa",
  APARTMENT: "Apartamento",
  LAND: "Terreno",
  COMMERCIAL: "Comercial",
};

export const TRANSACTION_LABELS: Record<TransactionType, string> = {
  SALE: "Venda",
  RENT: "Aluguel",
};