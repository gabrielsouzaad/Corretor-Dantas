import { useEffect, useState } from "react";
import api from "../../services/api";
import type { Property } from "../../types/property";

function PropertyList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProperties() {
    try {
      setError("");

      const response = await api.get("/properties");

      setProperties(response.data.content);
    } catch {
      setError("Não foi possível carregar os imóveis.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProperties();
  }, []);

  if (loading) {
    return <p>Carregando imóveis...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section>
      <h2>Imóveis cadastrados</h2>

      {properties.length === 0 ? (
        <p>Nenhum imóvel cadastrado.</p>
      ) : (
        <div>
          {properties.map((property) => (
            <article key={property.id}>
              <h3>{property.title}</h3>

              <p>
                {property.neighborhood}, {property.city}
              </p>

              <p>
                {property.price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>

              <p>
                {property.bedrooms} quartos ·{" "}
                {property.bathrooms} banheiros ·{" "}
                {property.area} m²
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default PropertyList;