import { useState } from "react";
import type { PropertyImage } from "../../types/property";
import { getImageUrl } from "../../utils/images";
import "./ImageGallery.css";

interface ImageGalleryProps {
  images: PropertyImage[];
  alt: string;
  badge?: string;
}

function ImageGallery({ images, alt, badge }: ImageGalleryProps) {
  const [selected, setSelected] = useState(0);

  const current = images[selected] ?? images[0];

  return (
    <div className="gallery">

      <div className="gallery-main">
        {current ? (
          <img src={getImageUrl(current.url)} alt={alt} />
        ) : (
          <strong className="gallery-placeholder">Imóvel</strong>
        )}

        {badge && <span className="gallery-badge">{badge}</span>}
      </div>

      {images.length > 1 && (
        <div className="gallery-thumbs">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              className={
                "gallery-thumb" +
                (image.id === current?.id ? " is-active" : "")
              }
              aria-label={`Ver imagem ${index + 1}`}
              onClick={() => setSelected(index)}
            >
              <img
                src={getImageUrl(image.url)}
                alt=""
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

    </div>
  );
}

export default ImageGallery;