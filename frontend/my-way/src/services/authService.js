import api from "../api/client";
import { parseApiError } from "../api/errors";

const SIGNUP_URL = "/user/signup";
const LOGIN_URL = "/user/login";

export async function register({ name, email, password }) {
  try {
    const { data } = await api.post(
      SIGNUP_URL,
      { name, email, password },
      { skipUnauthorized: true },
    );
    return data; // res.data = UserResponse
  } catch (e) {
    throw new Error(parseApiError(e, { 409: "Este e-mail já está em uso." }));
  }
}

export async function login({ email, password, remember }) {
  let res;
  try {
    res = await api.post(
      LOGIN_URL,
      { email, password, remember },
      { skipUnauthorized: true },
    );
  } catch (e) {
    throw new Error(parseApiError(e, { 401: "E-mail ou senha inválidos." }));
  }

  const authHeader = res.headers?.authorization;
  const token = authHeader?.replace(/^Bearer\s+/i, "");

  if (!token) {
    throw new Error("Token não retornado pelo servidor.");
  }

  return { user: res.data, token }; // res.data = UserResponse
}
