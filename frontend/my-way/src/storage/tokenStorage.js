import * as SecureStore from "expo-secure-store";

export async function saveToken(token) {
  try {
    await SecureStore.setItemAsync(process.env.EXPO_PUBLIC_TOKEN_KEY, token);
  } catch {}
}

export async function getToken() {
  try {
    return await SecureStore.getItemAsync(process.env.EXPO_PUBLIC_TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function removeToken() {
  try {
    await SecureStore.deleteItemAsync(process.env.EXPO_PUBLIC_TOKEN_KEY);
  } catch {}
}
