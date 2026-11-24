import { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { categoryColors } from "../theme/theme";

export default function ColorPicker({ value, onChange }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.grid}>
      {categoryColors.map((color, index) => {
        const colorId = index + 1;
        const selected = value === colorId;

        return (
          <Pressable
            key={colorId}
            style={[
              styles.swatch,
              { backgroundColor: color },
              selected && styles.swatchSelected,
            ]}
            onPress={() => onChange(colorId)}
            accessibilityLabel={`Cor ${colorId}`}
          >
            {selected && (
              <Ionicons name="checkmark" size={22} color="#FFFFFF" />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

//--------------------------------------------------------------

const createStyles = (colors) =>
  StyleSheet.create({
    grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
    swatch: {
      width: 48,
      height: 48,
      borderRadius: 24,
      borderWidth: 3,
      borderColor: "transparent",
      alignItems: "center",
      justifyContent: "center",
    },
    swatchSelected: { borderColor: colors.text },
  });
