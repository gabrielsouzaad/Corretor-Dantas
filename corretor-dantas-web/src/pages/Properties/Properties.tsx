import { useEffect, useState } from "react";
import { getProperties } from "../../services/propertyService";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import type { Property } from "../../types/property";
import "./Properties.css";

function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProperties() {
      try {
        const data = await getProperties();

        setProperties(data.content);
      } catch {
        setError("Não foi possível carregar os imóveis.");
      } finally {
        setLoading(false);
      }
    }

    loadProperties();
  }, []);

  if (loading) {
    return (
      <main className="properties">
        <p>Carregando imóveis...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="properties">
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className="properties">

      <section className="properties-header">

        <span className="properties-subtitle">
          CORRETOR DANTAS
        </span>

        <h1>Imóveis</h1>

        <p>
          Encontre o imóvel ideal para comprar ou alugar.
        </p>

      </section>

      {properties.length === 0 ? (
        <p>Nenhum imóvel encontrado.</p>
      ) : (
        <section className="properties-grid">

          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
            />
          ))}

        </section>
      )}

    </main>
  );
}

export default Properties;