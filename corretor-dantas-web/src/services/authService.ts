import api from "./api";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {

  const request: LoginRequest = {
    email,
    password,
  };

  const response = await api.post<LoginResponse>(
    "/auth/login",
    request
  );

  return response.data;
}