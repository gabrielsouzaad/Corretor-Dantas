import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import Pagination from "../../components/Pagination/Pagination";
import { getProperties } from "../../services/propertyService";
import type {
  PropertyPage,
  PropertyType,
  TransactionType,
} from "../../types/property";
import { getErrorMessage } from "../../utils/errors";
import { TRANSACTION_LABELS, TYPE_LABELS } from "../../utils/labels";
import "./Properties.css";

const PAGE_SIZE = 9;
const DEFAULT_SORT = "createdAt,desc";

const SORT_OPTIONS = [
  { value: DEFAULT_SORT, label: "Mais recentes" },
  { value: "price,asc", label: "Menor preço" },
  { value: "price,desc", label: "Maior preço" },
];

const SORT_VALUES = SORT_OPTIONS.map((option) => option.value);
const TYPES = Object.keys(TYPE_LABELS) as PropertyType[];
const TRANSACTIONS = Object.keys(TRANSACTION_LABELS) as TransactionType[];

const FILTER_FIELDS = [
  "city",
  "neighborhood",
  "type",
  "transactionType",
  "minPrice",
  "maxPrice",
  "sort",
];

interface ListResult {
  key: string;
  data?: PropertyPage;
  error?: string;
}

function pick<T extends string>(
  value: string | null,
  options: readonly T[]
): T | undefined {
  return options.find((option) => option === value);
}

function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState<ListResult | null>(null);
  const [filterError, setFilterError] = useState("");

  const city = searchParams.get("city") ?? "";
  const neighborhood = searchParams.get("neighborhood") ?? "";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const type = pick(searchParams.get("type"), TYPES);
  const transactionType = pick(
    searchParams.get("transactionType"),
    TRANSACTIONS
  );
  const sort = pick(searchParams.get("sort"), SORT_VALUES) ?? DEFAULT_SORT;
  const page = Math.max(Math.floor(Number(searchParams.get("page"))) || 1, 1);

  const requestKey = `${searchParams.toString()}|${reloadKey}`;
  const data = result?.data;
  const loading = result?.key !== requestKey;

  useEffect(() => {
    let cancelled = false;

    getProperties({
      city,
      neighborhood,
      type,
      transactionType,
      minPrice,
      maxPrice,
      sort,
      page: page - 1,
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
  }, [
    requestKey,
    city,
    neighborhood,
    type,
    transactionType,
    minPrice,
    maxPrice,
    sort,
    page,
  ]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const next = new URLSearchParams();

    for (const name of FILTER_FIELDS) {
      const value = String(form.get(name) ?? "").trim();

      if (value && !(name === "sort" && value === DEFAULT_SORT)) {
        next.set(name, value);
      }
    }

    if (
      next.has("minPrice") &&
      next.has("maxPrice") &&
      Number(next.get("minPrice")) > Number(next.get("maxPrice"))
    ) {
      setFilterError("O preço mínimo não pode ser maior que o máximo.");
      return;
    }

    setFilterError("");
    setSearchParams(next);
  }

  function handleClear() {
    setFilterError("");
    setSearchParams({});
  }

  function goToPage(target: number) {
    const next = new URLSearchParams(searchParams);

    if (target <= 1) {
      next.delete("page");
    } else {
      next.set("page", String(target));
    }

    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  let body: ReactNode;

  if (!result || (loading && !data)) {
    body = <p>Carregando imóveis...</p>;
  } else if (result.error) {
    body = (
      <>
        <p className="properties-error">{result.error}</p>

        <button
          type="button"
          className="properties-filter-submit"
          onClick={() => setReloadKey((key) => key + 1)}
        >
          Tentar novamente
        </button>
      </>
    );
  } else if (!data || data.content.length === 0) {
    body = (
      <div className="properties-empty">
        <p>Nenhum imóvel encontrado com esses filtros.</p>

        <button
          type="button"
          className="properties-filter-clear"
          onClick={handleClear}
        >
          Limpar filtros
        </button>
      </div>
    );
  } else {
    body = (
      <>
        <p className="properties-summary">
          {data.totalElements}{" "}
          {data.totalElements === 1
            ? "imóvel encontrado"
            : "imóveis encontrados"}
        </p>

        <section
          className={
            "properties-grid" + (loading ? " is-loading" : "")
          }
        >
          {data.content.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </section>

        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          onChange={(target) => goToPage(target + 1)}
        />
      </>
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

      <form
        key={searchParams.toString()}
        className="properties-filters"
        onSubmit={handleSubmit}
      >

        <div className="properties-filter">
          <label htmlFor="city">Cidade</label>
          <input
            id="city"
            name="city"
            type="text"
            defaultValue={city}
            maxLength={100}
            placeholder="Ex.: Aracaju"
          />
        </div>

        <div className="properties-filter">
          <label htmlFor="neighborhood">Bairro</label>
          <input
            id="neighborhood"
            name="neighborhood"
            type="text"
            defaultValue={neighborhood}
            maxLength={100}
            placeholder="Ex.: Farolândia"
          />
        </div>

        <div className="properties-filter">
          <label htmlFor="type">Tipo</label>
          <select id="type" name="type" defaultValue={type ?? ""}>
            <option value="">Todos</option>
            {TYPES.map((value) => (
              <option key={value} value={value}>
                {TYPE_LABELS[value]}
              </option>
            ))}
          </select>
        </div>

        <div className="properties-filter">
          <label htmlFor="transactionType">Negociação</label>
          <select
            id="transactionType"
            name="transactionType"
            defaultValue={transactionType ?? ""}
          >
            <option value="">Todas</option>
            {TRANSACTIONS.map((value) => (
              <option key={value} value={value}>
                {TRANSACTION_LABELS[value]}
              </option>
            ))}
          </select>
        </div>

        <div className="properties-filter">
          <label htmlFor="minPrice">Preço mínimo</label>
          <input
            id="minPrice"
            name="minPrice"
            type="number"
            min="0"
            step="any"
            defaultValue={minPrice}
            placeholder="R$"
          />
        </div>

        <div className="properties-filter">
          <label htmlFor="maxPrice">Preço máximo</label>
          <input
            id="maxPrice"
            name="maxPrice"
            type="number"
            min="0"
            step="any"
            defaultValue={maxPrice}
            placeholder="R$"
          />
        </div>

        <div className="properties-filter">
          <label htmlFor="sort">Ordenar por</label>
          <select id="sort" name="sort" defaultValue={sort}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="properties-filter-actions">
          <button type="submit" className="properties-filter-submit">
            Filtrar
          </button>

          <button
            type="button"
            className="properties-filter-clear"
            onClick={handleClear}
          >
            Limpar
          </button>
        </div>

      </form>

      {filterError && (
        <p className="properties-error" role="alert">
          {filterError}
        </p>
      )}

      {body}

    </main>
  );
}

export default Properties;