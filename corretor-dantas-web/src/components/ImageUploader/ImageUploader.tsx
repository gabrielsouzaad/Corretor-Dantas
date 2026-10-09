import { useEffect, useMemo, type ChangeEvent } from "react";
import "./ImageUploader.css";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 5;

interface ImageUploaderProps {
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles: number;
  disabled?: boolean;
  onError: (message: string) => void;
}

function ImageUploader({
  files,
  onChange,
  maxFiles,
  disabled = false,
  onError,
}: ImageUploaderProps) {
  const previews = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files]
  );

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const isFull = files.length >= maxFiles;

  function handleSelect(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = "";

    const accepted: File[] = [];
    const problems: string[] = [];

    for (const file of selected) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        problems.push(`${file.name}: formato não suportado`);
      } else if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        problems.push(`${file.name}: maior que ${MAX_SIZE_MB} MB`);
      } else {
        accepted.push(file);
      }
    }

    const available = Math.max(maxFiles - files.length, 0);

    if (accepted.length > available) {
      problems.push("Limite de imagens por imóvel atingido");
    }

    onChange([...files, ...accepted.slice(0, available)]);
    onError(problems.join(" • "));
  }

  function handleRemove(index: number) {
    onChange(files.filter((_, i) => i !== index));
    onError("");
  }

  return (
    <div className="image-uploader">

      <label
        className={
          "image-uploader-button" +
          (disabled || isFull ? " is-disabled" : "")
        }
      >
        + Adicionar imagens

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          hidden
          disabled={disabled || isFull}
          onChange={handleSelect}
        />
      </label>

      <span className="image-uploader-hint">
        JPG, PNG ou WebP, até {MAX_SIZE_MB} MB cada. Você ainda pode
        adicionar {Math.max(maxFiles - files.length, 0)} imagem(ns).
      </span>

      {previews.length > 0 && (
        <ul className="image-uploader-list">
          {previews.map((src, index) => (
            <li key={src} className="image-uploader-item">
              <img src={src} alt={`Pré-visualização ${index + 1}`} />

              <button
                type="button"
                aria-label="Remover imagem"
                disabled={disabled}
                onClick={() => handleRemove(index)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

    </div>
  );
}

export default ImageUploader;