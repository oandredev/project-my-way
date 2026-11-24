import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { getCategoryColor } from "../theme/theme";

export default function CategoryChips({
  categories,
  selectedId,
  onSelect,
  allLabel = "Todas",
  onAdd,
  onManage,
  onEditCategory,
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  function renderChip({
    key,
    label,
    selected,
    onPress,
    onLongPress,
    tint,
    actionIcon,
  }) {
    const isAction = Boolean(actionIcon);

    const tintStyle = tint
      ? {
          borderColor: tint,
          borderWidth: selected ? 2 : 1.5,
          backgroundColor: `${tint}${selected ? "55" : "22"}`, // transparency
        }
      : null;

    return (
      <Pressable
        key={key}
        style={[
          styles.chip,
          selected && styles.chipSelected,
          isAction && styles.chipAction,
          tintStyle,
        ]}
        onPress={onPress}
        onLongPress={onLongPress}
      >
        {isAction && (
          <Ionicons name={actionIcon} size={18} color={colors.primary} />
        )}
        <Text
          style={[
            styles.chipText,
            selected && styles.chipTextSelected,
            isAction && styles.chipTextAction,
          ]}
        >
          {label}
        </Text>
      </Pressable>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.row}
    >
      {renderChip({
        key: "all",
        label: allLabel,
        selected: selectedId === null,
        onPress: () => onSelect(null),
      })}

      {categories.map((c) =>
        renderChip({
          key: c.id,
          label: c.name,
          selected: selectedId === c.id,
          onPress: () => onSelect(c.id),
          onLongPress: onEditCategory ? () => onEditCategory(c) : undefined,
          tint: getCategoryColor(c.colorId, colors.primary),
        }),
      )}

      {onAdd &&
        renderChip({
          key: "add",
          label: "Nova",
          onPress: onAdd,
          actionIcon: "add",
        })}
      {onManage &&
        renderChip({
          key: "manage",
          label: "Gerenciar",
          onPress: onManage,
          actionIcon: "create-outline",
        })}
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
    chipAction: { borderStyle: "dashed", borderColor: colors.primary },
    chipText: { color: colors.text, fontSize: 14 },
    chipTextSelected: { fontWeight: "700" },
    chipTextAction: { color: colors.primary, fontWeight: "600" },
  });
