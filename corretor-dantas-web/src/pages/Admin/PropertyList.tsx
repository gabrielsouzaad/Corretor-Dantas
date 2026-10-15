import { useEffect, useState, type ChangeEvent } from "react";
import Pagination from "../../components/Pagination/Pagination";
import {
  getAdminProperties,
  updatePropertyStatus,
} from "../../services/propertyService";
import type {
  Property,
  PropertyPage,
  PropertyStatus,
} from "../../types/property";
import { getErrorMessage } from "../../utils/errors";
import { STATUS_LABELS, TRANSACTION_LABELS } from "../../utils/labels";
import PropertyForm from "./PropertyForm";
import "./PropertyList.css";

type StatusFilter = PropertyStatus | "ALL";

interface ListResult {
  key: string;
  data?: PropertyPage;
  error?: string;
}

const PAGE_SIZE = 10;

const FILTER_OPTIONS: StatusFilter[] = [
  "ALL",
  "AVAILABLE",
  "SOLD",
  "RENTED",
  "INACTIVE",
];

function statusOptions(property: Property): PropertyStatus[] {
  const finished: PropertyStatus =
    property.transactionType === "SALE" ? "SOLD" : "RENTED";

  const base: PropertyStatus[] = ["AVAILABLE", finished, "INACTIVE"];

  return base.includes(property.status)
    ? base
    : [property.status, ...base];
}

function PropertyList() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [page, setPage] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState<ListResult | null>(null);
  const [actionError, setActionError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(
    null
  );

  const requestKey = `${statusFilter}|${page}|${reloadKey}`;
  const data = result?.data;
  const loading = result?.key !== requestKey;

  useEffect(() => {
    let cancelled = false;

    getAdminProperties({
      status: statusFilter === "ALL" ? undefined : statusFilter,
      page,
      size: PAGE_SIZE,
    })
      .then((response) => {
        if (!cancelled) {
          setResult({ key: requestKey, data: response });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setResult({
            key: requestKey,
            error: getErrorMessage(
              err,
              "Não foi possível carregar os imóveis."
            ),
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [requestKey, statusFilter, page]);

  function reload() {
    setReloadKey((key) => key + 1);
  }

  function handleFilterChange(event: ChangeEvent<HTMLSelectElement>) {
    setStatusFilter(event.target.value as StatusFilter);
    setPage(0);
  }

  async function handleStatusChange(
    property: Property,
    next: PropertyStatus
  ) {
    if (next === property.status) {
      return;
    }

    if (
      next === "INACTIVE" &&
      !window.confirm(
        "Inativar este imóvel? Ele deixará de aparecer no site."
      )
    ) {
      return;
    }

    try {
      setActionError("");
      setBusyId(property.id);

      await updatePropertyStatus(property.id, next);

      const remaining = data?.content.length ?? 0;

      // Se era o último item de uma página (com filtro ativo), volta uma.
      if (statusFilter !== "ALL" && remaining <= 1 && page > 0) {
        setPage(page - 1);
      } else {
        reload();
      }
    } catch (err) {
      setActionError(
        getErrorMessage(err, "Não foi possível alterar o status do imóvel.")
      );
    } finally {
      setBusyId(null);
    }
  }

  let content;

  if (!result || (loading && !data)) {
    content = <p>Carregando imóveis...</p>;
  } else if (result.error) {
    content = (
      <>
        <p className="property-list-error">{result.error}</p>

        <button
          type="button"
          className="property-list-retry"
          onClick={reload}
        >
          Tentar novamente
        </button>
      </>
    );
  } else if (!data || data.content.length === 0) {
    content = (
      <p className="property-list-empty">
        {statusFilter === "ALL"
          ? "Nenhum imóvel cadastrado."
          : "Nenhum imóvel com este status."}
      </p>
    );
  } else {
    content = (
      <>
        <div
          className={
            "property-list-items" + (loading ? " is-loading" : "")
          }
        >
          {data.content.map((property) => {
            const formattedPrice = property.price.toLocaleString(
              "pt-BR",
              { style: "currency", currency: "BRL" }
            );

            return (
              <article
                key={property.id}
                className="property-list-card"
              >
                <div className="property-list-content">

                  <div className="property-list-main">

                    <div className="property-list-title-row">
                      <h3>{property.title}</h3>

                      <span
                        className={`property-list-status is-${property.status.toLowerCase()}`}
                      >
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
                      <span>
                        {TRANSACTION_LABELS[property.transactionType]}
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

                    <select
                      className="property-list-status-select"
                      aria-label={`Status de ${property.title}`}
                      value={property.status}
                      disabled={busyId === property.id}
                      onChange={(event) =>
                        handleStatusChange(
                          property,
                          event.target.value as PropertyStatus
                        )
                      }
                    >
                      {statusOptions(property).map((status) => (
                        <option key={status} value={status}>
                          {STATUS_LABELS[status]}
                        </option>
                      ))}
                    </select>

                  </div>

                </div>
              </article>
            );
          })}
        </div>

        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          onChange={setPage}
        />
      </>
    );
  }

  return (
    <section className="property-list">

      <div className="property-list-header">
        <span>GERENCIAMENTO</span>

        <h2>Imóveis cadastrados</h2>

        <p>
          Gerencie os imóveis, inclusive os inativos.
        </p>
      </div>

      <div className="property-list-toolbar">
        <label htmlFor="status-filter">Status</label>

        <select
          id="status-filter"
          value={statusFilter}
          onChange={handleFilterChange}
        >
          {FILTER_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option === "ALL" ? "Todos" : STATUS_LABELS[option]}
            </option>
          ))}
        </select>

        {data && (
          <span>
            {data.totalElements}{" "}
            {data.totalElements === 1 ? "imóvel" : "imóveis"}
          </span>
        )}
      </div>

      {actionError && (
        <p className="property-list-action-error" role="alert">
          {actionError}
        </p>
      )}

      {editingProperty && (
        <div className="property-list-edit-form">

          <PropertyForm
            key={editingProperty.id}
            property={editingProperty}
            onSuccess={() => {
              setEditingProperty(null);
              reload();
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

      {content}

    </section>
  );
}

export default PropertyList;