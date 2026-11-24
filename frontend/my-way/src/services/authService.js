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
    return data; // res.data = UserResponse from Backend
  } catch (e) {
    throw new Error(parseApiError(e));
  }
}

export async function login({ email, password, remember }) {
  try {
    const res = await api.post(
      LOGIN_URL,
      { email, password, remember },
      { skipUnauthorized: true },
    );

    const authHeader =
      res.headers["authorization"] || res.headers["Authorization"];
    const token = authHeader?.replace(/^Bearer\s+/i, "");

    if (!token) {
      throw new Error("Token não retornado pelo servidor.");
    }

    return { user: res.data, token }; // res.data = UserResponse from Backend
  } catch (e) {
    throw new Error(parseApiError(e));
  }
}
