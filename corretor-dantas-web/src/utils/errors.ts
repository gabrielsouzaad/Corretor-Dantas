import axios from "axios";

interface ApiErrorBody {
  status?: number;
  message?: string;
  errors?: string[];
}

export function getErrorMessage(
  error: unknown,
  fallback = "Ocorreu um erro inesperado. Tente novamente."
): string {
  if (!axios.isAxiosError<ApiErrorBody>(error)) {
    return fallback;
  }

  if (!error.response) {
    return "Não foi possível conectar ao servidor. Verifique se a API está em execução.";
  }

  const { status, data } = error.response;

  if (status === 401) {
    return "Sua sessão expirou. Entre novamente.";
  }

  if (status === 403) {
    return "Você não tem permissão para realizar esta ação.";
  }

  if (status === 413) {
    return "O arquivo enviado é maior que o limite permitido.";
  }

  if (status >= 500) {
    return "O servidor encontrou um problema. Tente novamente em instantes.";
  }

  const details = (data?.errors ?? []).map((item) =>
    item.replace(/^[^:]+:\s*/, "")
  );

  if (details.length > 0) {
    return details.join(" • ");
  }

  return data?.message ?? fallback;
}