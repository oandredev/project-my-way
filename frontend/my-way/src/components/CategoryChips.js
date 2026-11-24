import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { getCategoryColor } from "../theme/theme";

export default function CategoryChips({ categories, selectedId, onSelect }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  function renderChip(key, label, selected, onPress, dotColor) {
    return (
      <Pressable
        key={key}
        style={[styles.chip, selected && styles.chipSelected]}
        onPress={onPress}
      >
        {dotColor && (
          <View style={[styles.dot, { backgroundColor: dotColor }]} />
        )}
        <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
          {label}
        </Text>
      </Pressable>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {renderChip("all", "Todas", selectedId === null, () => onSelect(null))}
      {categories.map((c) =>
        renderChip(
          c.id,
          c.name,
          selectedId === c.id,
          () => onSelect(c.id),
          getCategoryColor(c.colorId, colors.primary),
        ),
      )}
    </ScrollView>
  );
}

//--------------------------------------------------------------

const createStyles = (colors) =>
  StyleSheet.create({
    row: { paddingHorizontal: 24, paddingVertical: 4, gap: 8 },
    chip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      height: 38,
      paddingHorizontal: 14,
      borderRadius: 19,
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    chipSelected: {
      backgroundColor: colors.primarySoft,
      borderColor: colors.primary,
    },
    dot: { width: 10, height: 10, borderRadius: 5 },
    chipText: { color: colors.text, fontSize: 14 },
    chipTextSelected: { fontWeight: "700" },
  });
