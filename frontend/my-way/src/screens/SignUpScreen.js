// src/screens/SignUpScreen.js
import { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import AuthHeader from "../components/AuthHeader";
import FormField from "../components/FormField";
import Button from "../components/Button";
import { useTheme } from "../contexts/ThemeContext";
import { register as registerRequest } from "../services/authService";
import {
  normalizeName,
  validateName,
  validateEmail,
  validatePassword,
} from "../utils/validators";

export default function SignUpScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    return (
      validateName(name) ||
      validateEmail(email) ||
      validatePassword(password) ||
      (password !== confirmPassword ? "As senhas não conferem." : "")
    );
  }

  async function handleSignUp() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setLoading(true);
    try {
      await registerRequest({
        name: normalizeName(name),
        email: email.trim(),
        password,
      });
      Alert.alert(
        "Conta criada!",
        "Agora é só entrar com seu e-mail e senha.",
        [{ text: "OK", onPress: () => navigation.navigate("Login") }],
      );
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
        <Text style={styles.title}>Criar conta</Text>

        <FormField
          label="Nome"
          placeholder="Digite seu nome"
          autoCapitalize="words"
          value={name}
          onChangeText={setName}
        />
        <FormField
          label="E-mail"
          placeholder="Digite seu e-mail"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <FormField
          label="Senha"
          placeholder="Mínimo de 8 caracteres"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Text style={styles.hint}>
          Use maiúscula, minúscula, número e caractere especial, sem espaços.
        </Text>
        <FormField
          label="Confirmar senha"
          placeholder="Digite a senha novamente"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {error !== "" && <Text style={styles.error}>{error}</Text>}

        <Button
          title={loading ? "Criando..." : "Criar conta"}
          icon={loading ? undefined : "person-add-outline"}
          onPress={handleSignUp}
          disabled={loading}
        />

        <Text style={styles.footerText}>Já tem uma conta?</Text>
        <Button
          variant="outline"
          title="Voltar para o login"
          icon="arrow-back-outline"
          onPress={() => navigation.navigate("Login")}
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
    title: {
      color: colors.text,
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 20,
    },
    hint: {
      color: colors.textMuted,
      fontSize: 13,
      marginTop: -12,
      marginBottom: 20,
    },
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
