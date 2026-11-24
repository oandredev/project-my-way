import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveUser(user) {
  try {
    await AsyncStorage.setItem(
      process.env.EXPO_PUBLIC_USER_KEY,
      JSON.stringify(user),
    );
  } catch {}
}

export async function getUser() {
  try {
    const raw = await AsyncStorage.getItem(process.env.EXPO_PUBLIC_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function removeUser() {
  try {
    await AsyncStorage.removeItem(process.env.EXPO_PUBLIC_USER_KEY);
  } catch {}
}
