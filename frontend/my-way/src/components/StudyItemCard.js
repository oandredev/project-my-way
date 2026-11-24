import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProgressBar from "./ProgressBar";
import { useTheme } from "../contexts/ThemeContext";
import { getCategoryColor } from "../theme/theme";
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  formatDate,
  getProgress,
} from "../utils/studyItem";

export default function StudyItemCard({ item, category, onEdit }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const categoryColor = category
    ? getCategoryColor(category.colorId, colors.primary)
    : colors.textMuted;
  const percent = getProgress(item);
  const statusColor =
    item.status === "DONE"
      ? colors.success
      : item.status === "IN_PROGRESS"
        ? colors.primary
        : colors.textMuted;

  const details = [
    PRIORITY_LABELS[item.priority] &&
      `Prioridade ${PRIORITY_LABELS[item.priority].toLowerCase()}`,
    item.deadline && `Prazo: ${formatDate(item.deadline)}`,
  ].filter(Boolean);

  return (
    <View style={styles.card}>
      <View style={[styles.stripe, { backgroundColor: categoryColor }]} />

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <View style={styles.titleBox}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.meta} numberOfLines={1}>
              {[item.institution, category?.name].filter(Boolean).join(" · ")}
            </Text>
          </View>

          <Pressable
            style={styles.editButton}
            onPress={onEdit}
            hitSlop={8}
            accessibilityLabel="Editar item"
          >
            <Ionicons name="create-outline" size={20} color={colors.primary} />
          </Pressable>
        </View>

        <ProgressBar percent={percent} color={categoryColor} />

        <View style={styles.footer}>
          <Text style={styles.hours}>
            {Number(item.doneHours) || 0}h de {Number(item.totalHours) || 0}h ·{" "}
            {percent}%
          </Text>
          <View style={[styles.badge, { backgroundColor: `${statusColor}22` }]}>
            <Text style={[styles.badgeText, { color: statusColor }]}>
              {STATUS_LABELS[item.status] ?? ""}
            </Text>
          </View>
        </View>

        {details.length > 0 && (
          <Text style={styles.details}>{details.join(" · ")}</Text>
        )}
      </View>
    </View>
  );
}

//--------------------------------------------------------------

const createStyles = (colors) =>
  StyleSheet.create({
    card: {
      flexDirection: "row",
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
      marginHorizontal: 24,
      marginBottom: 12,
    },
    stripe: { width: 6 },
    body: { flex: 1, padding: 16, gap: 10 },
    titleRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
    titleBox: { flex: 1 },
    title: { color: colors.text, fontSize: 17, fontWeight: "700" },
    meta: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
    editButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primarySoft,
      alignItems: "center",
      justifyContent: "center",
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    hours: { color: colors.textMuted, fontSize: 13 },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    badgeText: { fontSize: 12, fontWeight: "700" },
    details: { color: colors.textMuted, fontSize: 13 },
  });
