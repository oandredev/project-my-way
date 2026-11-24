import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import { lightColors, darkColors } from "../theme/theme";
import { getThemeMode, saveThemeMode } from "../storage/themeStorage";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState("system");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getThemeMode().then((saved) => {
      if (saved === "light" || saved === "dark" || saved === "system") {
        setModeState(saved);
      }
      setReady(true);
    });
  }, []);

  const setMode = useCallback((next) => {
    setModeState(next);
    saveThemeMode(next);
  }, []);

  const isDark = mode === "system" ? systemScheme === "dark" : mode === "dark";

  const value = useMemo(
    () => ({
      mode,
      setMode,
      isDark,
      colors: isDark ? darkColors : lightColors,
    }),
    [mode, setMode, isDark],
  );

  if (!ready) return null;

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
