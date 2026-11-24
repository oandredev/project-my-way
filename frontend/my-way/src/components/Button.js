import { useMemo } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

export default function Button({
  title,
  icon,
  onPress,
  variant = "primary", // primary | outline | danger
  disabled = false,
  style,
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const textColor =
    variant === "primary"
      ? colors.onPrimary
      : variant === "danger"
        ? colors.error
        : colors.primary;

  const variantStyle =
    variant === "primary"
      ? styles.primary
      : variant === "danger"
        ? styles.danger
        : styles.outline;

  return (
    <Pressable
      style={[styles.base, variantStyle, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      {icon && <Ionicons name={icon} size={22} color={textColor} />}
    </Pressable>
  );
}

//--------------------------------------------------------------

const createStyles = (colors) =>
  StyleSheet.create({
    base: {
      height: 56,
      borderRadius: 28,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    primary: { backgroundColor: colors.primary },
    outline: { borderWidth: 1.5, borderColor: colors.primary },
    danger: { borderWidth: 1.5, borderColor: colors.error },
    disabled: { opacity: 0.6 },
    text: { fontSize: 18, fontWeight: "600" },
  });
