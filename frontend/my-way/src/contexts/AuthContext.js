import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { setAuthToken, setUnauthorizedHandler } from "../api/client";
import { getToken, saveToken, removeToken } from "../storage/tokenStorage";
import { getUser, saveUser, removeUser } from "../storage/userStorage";
import { login } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [restoring, setRestoring] = useState(true);
  const cancelledRef = useRef(false);

  const signOut = useCallback(async () => {
    setAuthToken(null);
    setUser(null);
    await Promise.all([removeToken(), removeUser()]);
  }, []);

  const cancelRestore = useCallback(() => {
    cancelledRef.current = true;
    setAuthToken(null);
    setUser(null);
    signOut();

    setRestoring(false);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(signOut);

    (async () => {
      const [token, savedUser] = await Promise.all([getToken(), getUser()]);
      if (cancelledRef.current) return;

      if (token && savedUser) {
        setAuthToken(token);
        setUser(savedUser);
      }

      await new Promise((r) => setTimeout(r, 3000)); // ONLY TESTs

      if (cancelledRef.current) return;

      setRestoring(false);
    })();
  }, [signOut]);

  //--------------------------------------------------------------

  const signIn = useCallback(async ({ email, password, remember }) => {
    const { user: loggedUser, token } = await login({
      email,
      password,
      remember,
    });

    setAuthToken(token);
    if (remember) {
      await Promise.all([saveToken(token), saveUser(loggedUser)]);
    } else {
      await Promise.all([removeToken(), removeUser()]);
    }
    setUser(loggedUser);
  }, []);

  const value = useMemo(
    () => ({ user, restoring, signIn, signOut, cancelRestore }),
    [user, restoring, signIn, signOut, cancelRestore],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

//--------------------------------------------------------------

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return ctx;
}
