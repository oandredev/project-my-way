import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

const THEME_OPTIONS = [
  { value: "light", label: "Claro", icon: "sunny-outline" },
  { value: "dark", label: "Escuro", icon: "moon-outline" },
  { value: "system", label: "Sistema", icon: "phone-portrait-outline" },
];

export default function SettingsScreen() {
  const { colors, mode, setMode } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Tema do aplicativo</Text>
        <View style={styles.options}>
          {THEME_OPTIONS.map((option) => {
            const selected = mode === option.value;
            const color = selected ? colors.primary : colors.textMuted;

            return (
              <Pressable
                key={option.value}
                style={[styles.option, selected && styles.optionSelected]}
                onPress={() => setMode(option.value)}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
              >
                <Ionicons name={option.icon} size={28} color={color} />
                <Text style={styles.optionLabel}>{option.label}</Text>
                <Ionicons
                  name={selected ? "radio-button-on" : "radio-button-off"}
                  size={20}
                  color={color}
                />
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

//--------------------------------------------------------------

const createStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: 24, gap: 12 },
    sectionTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "700",
      marginTop: 8,
    },
    options: { flexDirection: "row", gap: 12 },
    option: {
      flex: 1,
      alignItems: "center",
      gap: 8,
      padding: 16,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    optionSelected: { borderColor: colors.primary },
    optionLabel: { color: colors.text, fontSize: 16, fontWeight: "600" },
  });
