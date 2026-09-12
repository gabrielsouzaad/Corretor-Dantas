import type { Property } from "../../types/property";
import "./PropertyCard.css";

interface PropertyCardProps {
  property: Property;
}

function PropertyCard({ property }: PropertyCardProps) {
  const formattedPrice = property.price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const transactionLabel =
    property.transactionType === "SALE"
      ? "Venda"
      : "Aluguel";

  return (
    <article className="property-card">

      <div className="property-card-image">
        <span className="property-card-type">
          {transactionLabel}
        </span>

        <span className="property-card-placeholder">
          Imóvel
        </span>
      </div>

      <div className="property-card-content">

        <h2 className="property-card-title">
          {property.title}
        </h2>

        <p className="property-card-location">
          {property.neighborhood}, {property.city}
        </p>

        <p className="property-card-price">
          {formattedPrice}
        </p>

        <div className="property-card-details">

          <span>
            {property.bedrooms} quartos
          </span>

          <span>
            {property.bathrooms} banheiros
          </span>

          <span>
            {property.area} m²
          </span>

        </div>

      </div>

    </article>
  );
}

export default PropertyCard;