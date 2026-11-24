import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../components/Button";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user, signOut } = useAuth();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Olá, {user?.name}!</Text>
      <Text style={styles.subtitle}>{user?.email}</Text>
      <Button
        variant="outline"
        title="Sair"
        icon="log-out-outline"
        onPress={signOut}
        style={styles.button}
      />
    </View>
  );
}

//--------------------------------------------------------------

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 24,
      justifyContent: "center",
    },
    title: { color: colors.text, fontSize: 26, fontWeight: "bold" },
    subtitle: { color: colors.textMuted, fontSize: 16, marginTop: 4 },
    button: { marginTop: 32 },
  });
