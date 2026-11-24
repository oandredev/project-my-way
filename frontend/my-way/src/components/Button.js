import { useMemo } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

export default function Button({
  title,
  icon,
  onPress,
  variant = "primary",
  disabled = false,
  style,
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const isPrimary = variant === "primary";
  const textColor = isPrimary ? colors.onPrimary : colors.primary;

  return (
    <Pressable
      style={[
        styles.base,
        isPrimary ? styles.primary : styles.outline,
        disabled && styles.disabled,
        style,
      ]}
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
    disabled: { opacity: 0.6 },
    text: { fontSize: 18, fontWeight: "600" },
  });
