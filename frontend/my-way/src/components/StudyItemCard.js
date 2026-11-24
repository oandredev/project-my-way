import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProgressBar from "./ProgressBar";
import { useTheme } from "../contexts/ThemeContext";
import { getCategoryColor } from "../theme/theme";
import {
  HOURS_STEP,
  PRIORITY_LABELS,
  STATUS_LABELS,
  formatDate,
  formatDaysUntil,
  getDaysUntil,
  getProgress,
} from "../utils/studyItem";

const getStatusColor = (status, colors) => {
  if (status === "DONE") return colors.success;
  if (status === "IN_PROGRESS") return colors.primary;
  return colors.textMuted;
};

export default function StudyItemCard({
  item,
  category,
  onEdit,
  onAdjustHours,
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const categoryColor = category
    ? getCategoryColor(category.colorId, colors.primary)
    : colors.textMuted;
  const statusColor = getStatusColor(item.status, colors);

  const percent = getProgress(item);
  const doneHours = Number(item.doneHours) || 0;
  const totalHours = Number(item.totalHours) || 0;

  const stepButtons = [
    {
      delta: -1,
      icon: "remove",
      label: `Remover ${HOURS_STEP} hora`,
      disabled: doneHours <= 0,
    },
    {
      delta: 1,
      icon: "add",
      label: `Adicionar ${HOURS_STEP} hora`,
      disabled: doneHours >= totalHours,
    },
  ];

  const priorityLabel = PRIORITY_LABELS[item.priority];
  const priorityText = priorityLabel
    ? `Prioridade ${priorityLabel.toLowerCase()}`
    : null;

  const isDone = item.status === "DONE";
  const daysLeft = item.deadline ? getDaysUntil(item.deadline) : null;
  const isOverdue = daysLeft !== null && daysLeft < 0 && !isDone;

  const deadlineText = item.deadline
    ? `Prazo: ${formatDate(item.deadline)}${
        isDone ? "" : ` (${formatDaysUntil(daysLeft)})`
      }`
    : null;

  const completedText =
    isDone && item.completedAt
      ? `Concluído em ${formatDate(item.completedAt)}`
      : null;

  const deadlineLine = [deadlineText, completedText]
    .filter(Boolean)
    .join(" · ");

  const metaText = [item.institution, category?.name]
    .filter(Boolean)
    .join(" · ");

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
              {metaText}
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
            {doneHours}h de {totalHours}h · {percent}%
          </Text>

          {onAdjustHours && (
            <View style={styles.stepper}>
              {stepButtons.map(({ delta, icon, label, disabled }) => (
                <Pressable
                  key={delta}
                  style={[styles.stepButton, disabled && styles.stepDisabled]}
                  onPress={() => onAdjustHours(delta)}
                  disabled={disabled}
                  hitSlop={6}
                  accessibilityLabel={label}
                >
                  <Ionicons name={icon} size={20} color={colors.primary} />
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View style={styles.statusLine}>
          <View style={[styles.badge, { backgroundColor: `${statusColor}22` }]}>
            <Text style={[styles.badgeText, { color: statusColor }]}>
              {STATUS_LABELS[item.status] ?? ""}
            </Text>
          </View>
          {priorityText && <Text style={styles.details}>{priorityText}</Text>}
        </View>

        {deadlineLine !== "" && (
          <>
            <View style={styles.divider} />
            <Text
              style={[
                styles.details,
                isOverdue && { color: colors.danger ?? colors.textMuted },
              ]}
            >
              {deadlineLine}
            </Text>
          </>
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
    hours: { color: colors.text, fontSize: 14, fontWeight: "600" },
    stepper: { flexDirection: "row", gap: 8 },
    stepButton: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: colors.primarySoft,
      alignItems: "center",
      justifyContent: "center",
    },
    stepDisabled: { opacity: 0.35 },

    statusLine: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: 8,
    },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    badgeText: { fontSize: 12, fontWeight: "700" },
    details: { color: colors.textMuted, fontSize: 13, textAlign: "center" },

    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
    },
  });
