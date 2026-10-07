import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";
import type { Property } from "../../types/property";
import { getErrorMessage } from "../../utils/errors";
import PropertyForm from "./PropertyForm";
import "./PropertyList.css";

interface PropertyListProps {
  refreshKey?: number;
}

const STATUS_LABELS: Record<Property["status"], string> = {
  AVAILABLE: "Disponível",
  SOLD: "Vendido",
  RENTED: "Alugado",
  INACTIVE: "Inativo",
};

function PropertyList({ refreshKey = 0 }: PropertyListProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [deactivatingId, setDeactivatingId] = useState<number | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  const loadProperties = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError("");

      const response = await api.get("/properties", {
        params: { size: 50 },
      });

      setProperties(response.data.content);
    } catch (err) {
      setLoadError(
        getErrorMessage(err, "Não foi possível carregar os imóveis.")
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProperties();
  }, [loadProperties, refreshKey]);

  async function handleDeactivate(id: number) {
    const confirmed = window.confirm(
      "Tem certeza que deseja inativar este imóvel?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionError("");
      setDeactivatingId(id);

      await api.delete(`/properties/${id}`);

      setProperties((current) =>
        current.filter((property) => property.id !== id)
      );
    } catch (err) {
      setActionError(
        getErrorMessage(err, "Não foi possível inativar o imóvel.")
      );
    } finally {
      setDeactivatingId(null);
    }
  }

  if (loading && properties.length === 0) {
    return (
      <section className="property-list">
        <p>Carregando imóveis...</p>
      </section>
    );
  }

  if (loadError && properties.length === 0) {
    return (
      <section className="property-list">
        <p className="property-list-error">{loadError}</p>

        <button
          type="button"
          className="property-list-retry"
          onClick={loadProperties}
        >
          Tentar novamente
        </button>
      </section>
    );
  }

  return (
    <section className="property-list">

      <div className="property-list-header">
        <span>GERENCIAMENTO</span>

        <h2>Imóveis cadastrados</h2>

        <p>
          Gerencie os imóveis disponíveis no sistema.
        </p>
      </div>

      {actionError && (
        <p className="property-list-action-error" role="alert">
          {actionError}
        </p>
      )}

      {editingProperty && (
        <div className="property-list-edit-form">

          <PropertyForm
            property={editingProperty}
            onSuccess={() => {
              setEditingProperty(null);
              loadProperties();
            }}
          />

          <button
            type="button"
            className="property-list-cancel"
            onClick={() => setEditingProperty(null)}
          >
            Cancelar edição
          </button>

        </div>
      )}

      {properties.length === 0 ? (
        <p className="property-list-empty">
          Nenhum imóvel cadastrado.
        </p>
      ) : (
        <div className="property-list-items">

          {properties.map((property) => {
            const formattedPrice = property.price.toLocaleString(
              "pt-BR",
              { style: "currency", currency: "BRL" }
            );

            const transactionLabel =
              property.transactionType === "SALE" ? "Venda" : "Aluguel";

            return (
              <article
                key={property.id}
                className="property-list-card"
              >
                <div className="property-list-content">

                  <div className="property-list-main">

                    <div className="property-list-title-row">
                      <h3>{property.title}</h3>

                      <span className="property-list-status">
                        {STATUS_LABELS[property.status]}
                      </span>
                    </div>

                    <p className="property-list-location">
                      {property.neighborhood}, {property.city}
                    </p>

                    <p className="property-list-price">
                      {formattedPrice}
                    </p>

                    <div className="property-list-details">
                      <span>{property.bedrooms} quartos</span>
                      <span>{property.bathrooms} banheiros</span>
                      <span>{property.area} m²</span>
                      <span>{transactionLabel}</span>
                    </div>

                  </div>

                  <div className="property-list-actions">

                    <button
                      type="button"
                      className="property-list-edit"
                      onClick={() => setEditingProperty(property)}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className="property-list-delete"
                      disabled={deactivatingId === property.id}
                      onClick={() => handleDeactivate(property.id)}
                    >
                      {deactivatingId === property.id
                        ? "Inativando..."
                        : "Inativar"}
                    </button>

                  </div>

                </div>
              </article>
            );
          })}

        </div>
      )}

    </section>
  );
}

export default PropertyList;