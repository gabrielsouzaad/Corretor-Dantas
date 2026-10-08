import { useNavigate } from "react-router-dom";
import type { Property } from "../../types/property";
import { getImageUrl } from "../../utils/images";
import "./PropertyCard.css";

interface PropertyCardProps {
  property: Property;
}

function PropertyCard({ property }: PropertyCardProps) {
  const navigate = useNavigate();

  const formattedPrice = property.price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const transactionLabel =
    property.transactionType === "SALE"
      ? "Venda"
      : "Aluguel";

  const images = property.images ?? [];
  const cover = images.find((image) => image.cover) ?? images[0];

  function handleClick() {
    navigate(`/imoveis/${property.id}`);
  }

  return (
    <article
      className="property-card"
      onClick={handleClick}
    >
      <div className="property-card-image">
        {cover ? (
          <img
            src={getImageUrl(cover.url)}
            alt={property.title}
            loading="lazy"
          />
        ) : (
          <span className="property-card-placeholder">
            Imóvel
          </span>
        )}

        <span className="property-card-type">
          {transactionLabel}
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