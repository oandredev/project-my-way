import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import Logo from "../components/Logo";
import Button from "../components/Button";

export default function RestoringScreen() {
  const { colors } = useTheme();
  const { cancelRestore } = useAuth();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.logoArea}>
          <Logo size={200} />
        </View>

        <View style={styles.statusArea}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.text, { color: colors.textMuted }]}>
            Restaurando sessão anterior...
          </Text>
        </View>
      </View>

      <View style={styles.cancelArea}>
        <Button
          variant="outline"
          title="Cancelar"
          icon="close-outline"
          onPress={cancelRestore}
        />
      </View>
    </View>
  );
}

//--------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoArea: { marginBottom: 48 },
  statusArea: { alignItems: "center", gap: 12 },
  text: {
    fontSize: 15,
    textAlign: "center",
  },
  cancelArea: { width: "100%", paddingBottom: 100 },
});
