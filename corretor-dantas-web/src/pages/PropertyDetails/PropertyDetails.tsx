import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ImageGallery from "../../components/ImageGallery/ImageGallery";
import api from "../../services/api";
import type { Property } from "../../types/property";
import { getErrorMessage } from "../../utils/errors";
import {
  STATUS_LABELS,
  TRANSACTION_LABELS,
  TYPE_LABELS,
} from "../../utils/labels";
import "./PropertyDetails.css";

function PropertyDetails() {
  const { id } = useParams();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProperty() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get<Property>(
          `/properties/${id}`
        );

        setProperty(response.data);
      } catch (err) {
        setError(
          getErrorMessage(
            err,
            "Não foi possível carregar os dados do imóvel."
          )
        );
      } finally {
        setLoading(false);
      }
    }

    loadProperty();
  }, [id]);

  if (loading) {
    return (
      <main className="property-details">
        <p>Carregando imóvel...</p>
      </main>
    );
  }

  if (error || !property) {
    return (
      <main className="property-details">
        <p className="property-details-error">
          {error || "Imóvel não encontrado."}
        </p>
      </main>
    );
  }

  const formattedPrice = property.price.toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    }
  );

  const transactionLabel = TRANSACTION_LABELS[property.transactionType];

  const badgeLabel =
    property.status === "SOLD" || property.status === "RENTED"
      ? STATUS_LABELS[property.status]
      : transactionLabel;

  return (
    <main className="property-details">
      <section className="property-details-container">
        <ImageGallery
          images={property.images}
          alt={property.title}
          badge={badgeLabel}
        />

        <div className="property-details-content">
          <span className="property-details-subtitle">
            CORRETOR DANTAS
          </span>

          <h1>{property.title}</h1>

          <p className="property-details-location">
            {property.neighborhood}, {property.city}
          </p>

          <p className="property-details-price">
            {formattedPrice}
          </p>

          <div className="property-details-info">
            <div>
              <strong>{property.bedrooms}</strong>
              <span>Quartos</span>
            </div>

            <div>
              <strong>{property.bathrooms}</strong>
              <span>Banheiros</span>
            </div>

            <div>
              <strong>{property.area} m²</strong>
              <span>Área</span>
            </div>
          </div>

          <div className="property-details-section">
            <h2>Sobre o imóvel</h2>

            <p>{property.description}</p>
          </div>

          <div className="property-details-section">
            <h2>Informações</h2>

            <p>
              <strong>Tipo:</strong> {TYPE_LABELS[property.type]}
            </p>

            <p>
              <strong>Negociação:</strong>{" "}
              {transactionLabel}
            </p>

            <p>
              <strong>Endereço:</strong>{" "}
              {property.address}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PropertyDetails;