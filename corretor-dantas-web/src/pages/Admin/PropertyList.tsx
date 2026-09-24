import { useEffect, useState } from "react";
import api from "../../services/api";
import type { Property } from "../../types/property";
import PropertyForm from "./PropertyForm";
import "./PropertyList.css";

function PropertyList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  async function loadProperties() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/properties");

      setProperties(response.data.content);
    } catch {
      setError("Não foi possível carregar os imóveis.");
    } finally {
      setLoading(false);
    }
  }

   async function handleDeactivate(id: number) {
     const confirmed = window.confirm(
       "Tem certeza que deseja inativar este imóvel?"
     );

     if (!confirmed) {
       return;
     }

     try {
       await api.delete(`/properties/${id}`);

       setProperties((currentProperties) =>
         currentProperties.filter(
           (property) => property.id !== id
         )
       );
     } catch {
       setError(
         "Não foi possível inativar o imóvel."
       );
     }
   }

  useEffect(() => {
    loadProperties();
  }, []);

  if (loading) {
    return (
      <section className="property-list">
        <p>Carregando imóveis...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="property-list">
        <p className="property-list-error">
          {error}
        </p>
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

            const formattedPrice =
              property.price.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              });

            const transactionLabel =
              property.transactionType === "SALE"
                ? "Venda"
                : "Aluguel";

            const statusLabel =
              property.status === "AVAILABLE"
                ? "Disponível"
                : property.status === "SOLD"
                ? "Vendido"
                : property.status === "RENTED"
                ? "Alugado"
                : "Inativo";

            return (
              <article
                key={property.id}
                className="property-list-card"
              >

                <div className="property-list-content">

                  <div className="property-list-main">

                    <div className="property-list-title-row">

                      <h3>
                        {property.title}
                      </h3>

                      <span className="property-list-status">
                        {statusLabel}
                      </span>

                    </div>

                    <p className="property-list-location">
                      {property.neighborhood},{" "}
                      {property.city}
                    </p>

                    <p className="property-list-price">
                      {formattedPrice}
                    </p>

                    <div className="property-list-details">

                      <span>
                        {property.bedrooms} quartos
                      </span>

                      <span>
                        {property.bathrooms} banheiros
                      </span>

                      <span>
                        {property.area} m²
                      </span>

                      <span>
                        {transactionLabel}
                      </span>

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
                     onClick={() => handleDeactivate(property.id)}
                   >
                     Inativar
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