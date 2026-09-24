import { FormEvent, useEffect, useState } from "react";
import api from "../../services/api";
import type { Property } from "../../types/property";
import "./PropertyForm.css";

interface PropertyFormProps {
  property?: Property | null;
  onSuccess?: () => void;
}

function PropertyForm({
  property,
  onSuccess,
}: PropertyFormProps) {
  const [title, setTitle] = useState(property?.title ?? "");
  const [description, setDescription] = useState(
    property?.description ?? ""
  );
  const [price, setPrice] = useState(
    property ? String(property.price) : ""
  );
  const [type, setType] = useState(
    property?.type ?? "HOUSE"
  );
  const [transactionType, setTransactionType] = useState(
    property?.transactionType ?? "SALE"
  );
  const [bedrooms, setBedrooms] = useState(
    property ? String(property.bedrooms) : ""
  );
  const [bathrooms, setBathrooms] = useState(
    property ? String(property.bathrooms) : ""
  );
  const [area, setArea] = useState(
    property ? String(property.area) : ""
  );
  const [city, setCity] = useState(property?.city ?? "");
  const [neighborhood, setNeighborhood] = useState(
    property?.neighborhood ?? ""
  );
  const [address, setAddress] = useState(
    property?.address ?? ""
  );

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle(property?.title ?? "");
    setDescription(property?.description ?? "");
    setPrice(property ? String(property.price) : "");
    setType(property?.type ?? "HOUSE");
    setTransactionType(property?.transactionType ?? "SALE");
    setBedrooms(property ? String(property.bedrooms) : "");
    setBathrooms(property ? String(property.bathrooms) : "");
    setArea(property ? String(property.area) : "");
    setCity(property?.city ?? "");
    setNeighborhood(property?.neighborhood ?? "");
    setAddress(property?.address ?? "");

    setMessage("");
    setError("");
  }, [property]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const request = {
        title,
        description,
        price: Number(price),
        type,
        transactionType,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        area: Number(area),
        city,
        neighborhood,
        address,
      };

      if (property) {
        await api.put(
          `/properties/${property.id}`,
          request
        );
      } else {
        await api.post(
          "/properties",
          request
        );
      }

      setMessage(
        property
          ? "Imóvel atualizado com sucesso!"
          : "Imóvel cadastrado com sucesso!"
      );

      onSuccess?.();

      if (!property) {
        setTitle("");
        setDescription("");
        setPrice("");
        setType("HOUSE");
        setTransactionType("SALE");
        setBedrooms("");
        setBathrooms("");
        setArea("");
        setCity("");
        setNeighborhood("");
        setAddress("");
      }

    } catch {
      setError(
        property
          ? "Não foi possível atualizar o imóvel."
          : "Não foi possível cadastrar o imóvel."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="property-form">

      <div className="property-form-header">
        <span>IMÓVEIS</span>

        <h2>
          {property
            ? "Editar imóvel"
            : "Cadastrar imóvel"}
        </h2>

        <p>
          {property
            ? "Atualize as informações do imóvel."
            : "Adicione um novo imóvel ao catálogo."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="property-form-grid"
      >

        <div className="property-form-field">
          <label htmlFor="title">
            Título
          </label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="Ex.: Apartamento moderno"
            required
          />
        </div>

        <div className="property-form-field">
          <label htmlFor="price">
            Preço
          </label>

          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) =>
              setPrice(event.target.value)
            }
            placeholder="450000"
            required
          />
        </div>

        <div className="property-form-field property-form-full">
          <label htmlFor="description">
            Descrição
          </label>

          <textarea
            id="description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Descreva o imóvel..."
            rows={5}
            required
          />
        </div>

        <div className="property-form-field">
          <label htmlFor="type">
            Tipo do imóvel
          </label>

          <select
            id="type"
            value={type}
            onChange={(event) =>
              setType(event.target.value)
            }
          >
            <option value="HOUSE">
              Casa
            </option>

            <option value="APARTMENT">
              Apartamento
            </option>

            <option value="LAND">
              Terreno
            </option>

            <option value="COMMERCIAL">
              Comercial
            </option>
          </select>
        </div>

        <div className="property-form-field">
          <label htmlFor="transactionType">
            Negociação
          </label>

          <select
            id="transactionType"
            value={transactionType}
            onChange={(event) =>
              setTransactionType(event.target.value)
            }
          >
            <option value="SALE">
              Venda
            </option>

            <option value="RENT">
              Aluguel
            </option>
          </select>
        </div>

        <div className="property-form-field">
          <label htmlFor="bedrooms">
            Quartos
          </label>

          <input
            id="bedrooms"
            type="number"
            min="0"
            value={bedrooms}
            onChange={(event) =>
              setBedrooms(event.target.value)
            }
            required
          />
        </div>

        <div className="property-form-field">
          <label htmlFor="bathrooms">
            Banheiros
          </label>

          <input
            id="bathrooms"
            type="number"
            min="0"
            value={bathrooms}
            onChange={(event) =>
              setBathrooms(event.target.value)
            }
            required
          />
        </div>

        <div className="property-form-field">
          <label htmlFor="area">
            Área (m²)
          </label>

          <input
            id="area"
            type="number"
            min="0"
            step="0.01"
            value={area}
            onChange={(event) =>
              setArea(event.target.value)
            }
            required
          />
        </div>

        <div className="property-form-field">
          <label htmlFor="city">
            Cidade
          </label>

          <input
            id="city"
            type="text"
            value={city}
            onChange={(event) =>
              setCity(event.target.value)
            }
            placeholder="Aracaju"
            required
          />
        </div>

        <div className="property-form-field">
          <label htmlFor="neighborhood">
            Bairro
          </label>

          <input
            id="neighborhood"
            type="text"
            value={neighborhood}
            onChange={(event) =>
              setNeighborhood(event.target.value)
            }
            placeholder="Farolândia"
            required
          />
        </div>

        <div className="property-form-field property-form-full">
          <label htmlFor="address">
            Endereço
          </label>

          <input
            id="address"
            type="text"
            value={address}
            onChange={(event) =>
              setAddress(event.target.value)
            }
            placeholder="Rua, número..."
            required
          />
        </div>

        {message && (
          <p className="property-form-success">
            {message}
          </p>
        )}

        {error && (
          <p className="property-form-error">
            {error}
          </p>
        )}

        <div className="property-form-full">
          <button
            type="submit"
            className="property-form-button"
            disabled={loading}
          >
            {loading
              ? "Salvando..."
              : property
              ? "Salvar alterações"
              : "Cadastrar imóvel"}
          </button>
        </div>

      </form>
    </section>
  );
}

export default PropertyForm;