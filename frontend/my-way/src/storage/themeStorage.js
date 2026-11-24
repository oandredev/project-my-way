import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getThemeMode() {
  try {
    return await AsyncStorage.getItem(process.env.EXPO_PUBLIC_THEME_KEY);
  } catch {
    return null;
  }
}

export async function saveThemeMode(mode) {
  try {
    await AsyncStorage.setItem(process.env.EXPO_PUBLIC_THEME_KEY, mode);
  } catch {}
}
