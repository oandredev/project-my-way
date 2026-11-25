import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import AuthHeader from "../components/AuthHeader";
import FormField from "../components/FormField";
import Button from "../components/Button";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

export default function LoginScreen({ navigation }) {
  const { colors } = useTheme();
  const { signIn } = useAuth();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      setError("Digite o e-mail e a senha.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await signIn({ email: email.trim(), password, remember });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "android" ? "padding" : undefined}
    >
      <AuthHeader />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        keyboardDismissMode="on-drag"
      >
        <FormField
          label="E-mail"
          placeholder="Digite seu e-mail"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <FormField
          label="Senha"
          placeholder="Digite sua senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <View style={styles.rememberRow}>
          <Text style={styles.rememberText}>Lembrar de mim</Text>
          <Switch
            value={remember}
            onValueChange={setRemember}
            trackColor={{ false: colors.border, true: colors.primarySoft }}
            thumbColor={remember ? colors.primary : colors.textMuted}
          />
        </View>

        {error !== "" && <Text style={styles.error}>{error}</Text>}

        <Button
          title={loading ? "Entrando..." : "Entrar"}
          icon={loading ? undefined : "log-in-outline"}
          onPress={handleLogin}
          disabled={loading}
        />

        <Text style={styles.footerText}>Ainda não é cadastrado?</Text>
        <Button
          variant="outline"
          title="Fazer cadastro"
          icon="person-add-outline"
          onPress={() => navigation.navigate("SignUp")}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

//--------------------------------------------------------------

const createStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { padding: 24, paddingBottom: 40 },
    rememberRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    rememberText: { color: colors.text, fontSize: 16 },
    error: {
      color: colors.error,
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 12,
    },
    footerText: {
      color: colors.textMuted,
      fontSize: 16,
      marginTop: 28,
      marginBottom: 12,
    },
  });
