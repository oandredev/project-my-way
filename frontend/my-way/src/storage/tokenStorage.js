import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";

const TOKEN_KEY = process.env.EXPO_PUBLIC_TOKEN_KEY;

let cachedToken = null;
let pendingRead = null;

async function authenticate() {
  const level = await LocalAuthentication.getEnrolledLevelAsync();
  if (level === LocalAuthentication.SecurityLevel.NONE) return false;

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Confirme sua identidade",
    cancelLabel: "Cancelar",
    disableDeviceFallback: false, // PIN or password
  });

  return result.success;
}

async function readToken() {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!token || !(await authenticate())) return null;

    cachedToken = token;
    return token;
  } catch {
    return null;
  }
}

export async function saveToken(token) {
  cachedToken = token;
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch {}
}

export async function getToken() {
  if (cachedToken) return cachedToken;

  pendingRead ??= readToken().finally(() => {
    pendingRead = null;
  });

  return pendingRead;
}

export async function removeToken() {
  cachedToken = null;
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {}
}
