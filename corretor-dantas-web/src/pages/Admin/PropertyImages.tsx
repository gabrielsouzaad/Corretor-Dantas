import { useState } from "react";
import {
  deletePropertyImage,
  setCoverImage,
} from "../../services/propertyImageService";
import type { PropertyImage } from "../../types/property";
import { getErrorMessage } from "../../utils/errors";
import { getImageUrl } from "../../utils/images";
import "./PropertyImages.css";

interface PropertyImagesProps {
  propertyId: number;
  images: PropertyImage[];
  onChange: (images: PropertyImage[]) => void;
}

function PropertyImages({
  propertyId,
  images,
  onChange,
}: PropertyImagesProps) {
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function run(
    imageId: number,
    action: () => Promise<PropertyImage[]>,
    fallback: string
  ) {
    try {
      setError("");
      setBusyId(imageId);
      onChange(await action());
    } catch (err) {
      setError(getErrorMessage(err, fallback));
    } finally {
      setBusyId(null);
    }
  }

  function handleRemove(imageId: number) {
    if (!window.confirm("Remover esta imagem?")) {
      return;
    }

    run(
      imageId,
      () => deletePropertyImage(propertyId, imageId),
      "Não foi possível remover a imagem."
    );
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="property-images">

      {error && (
        <p className="property-images-error" role="alert">
          {error}
        </p>
      )}

      <ul className="property-images-list">
        {images.map((image) => (
          <li key={image.id} className="property-images-item">

            <img
              src={getImageUrl(image.url)}
              alt="Imagem do imóvel"
              loading="lazy"
            />

            {image.cover && (
              <span className="property-images-badge">Capa</span>
            )}

            <div className="property-images-actions">
              {!image.cover && (
                <button
                  type="button"
                  className="property-images-cover"
                  disabled={busyId === image.id}
                  onClick={() =>
                    run(
                      image.id,
                      () => setCoverImage(propertyId, image.id),
                      "Não foi possível definir a capa."
                    )
                  }
                >
                  Definir capa
                </button>
              )}

              <button
                type="button"
                className="property-images-remove"
                disabled={busyId === image.id}
                onClick={() => handleRemove(image.id)}
              >
                Remover
              </button>
            </div>

          </li>
        ))}
      </ul>

    </div>
  );
}

export default PropertyImages;