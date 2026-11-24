import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

export default function FormField({
  label,
  secureTextEntry = false,
  multiline = false,
  ...inputProps
}) {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.box, multiline && styles.boxMultiline]}>
        <TextInput
          style={[styles.input, multiline && styles.inputMultiline]}
          placeholderTextColor={colors.placeholder}
          keyboardAppearance={isDark ? "dark" : "light"}
          autoCapitalize="none"
          autoCorrect={false}
          multiline={multiline}
          {...inputProps}
          secureTextEntry={secureTextEntry && !visible}
        />
        {secureTextEntry && (
          <Pressable style={styles.eye} onPress={() => setVisible(!visible)}>
            <Ionicons
              name={visible ? "eye-off-outline" : "eye-outline"}
              size={24}
              color={colors.textMuted}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}

//--------------------------------------------------------------

const createStyles = (colors) =>
  StyleSheet.create({
    wrapper: { marginBottom: 20 },
    label: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "600",
      marginBottom: 8,
    },
    box: {
      flexDirection: "row",
      alignItems: "center",
      height: 56,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 14,
      paddingHorizontal: 16,
      backgroundColor: colors.surfaceAlt,
    },
    boxMultiline: {
      height: "auto",
      minHeight: 112,
      alignItems: "flex-start",
      paddingVertical: 12,
    },
    input: { flex: 1, fontSize: 18, color: colors.text },
    inputMultiline: { minHeight: 88, textAlignVertical: "top" },
    eye: { paddingLeft: 12, paddingVertical: 8 },
  });
