import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import ProgressBar from "./ProgressBar";
import { useTheme } from "../contexts/ThemeContext";

export default function SummaryCard({ summary }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const stats = [
    { label: "Itens", value: summary.total },
    { label: "Em andamento", value: summary.inProgress },
    { label: "Concluídos", value: summary.done },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Seu progresso</Text>
      <Text style={styles.percent}>{summary.percent}%</Text>
      <ProgressBar percent={summary.percent} height={10} />
      <Text style={styles.hours}>
        {summary.doneHours}h de {summary.totalHours}h estudadas
      </Text>

      <View style={styles.stats}>
        {stats.map((s) => (
          <View key={s.label} style={styles.stat}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

//--------------------------------------------------------------

const createStyles = (colors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.primarySoft,
      borderRadius: 20,
      padding: 20,
      marginHorizontal: 24,
      marginTop: 16,
      marginBottom: 20,
    },
    heading: { color: colors.textMuted, fontSize: 14, fontWeight: "600" },
    percent: {
      color: colors.primary,
      fontSize: 36,
      fontWeight: "bold",
      marginBottom: 8,
    },
    hours: { color: colors.text, fontSize: 14, marginTop: 8 },
    stats: { flexDirection: "row", marginTop: 16 },
    stat: { flex: 1 },
    statValue: { color: colors.text, fontSize: 22, fontWeight: "bold" },
    statLabel: { color: colors.textMuted, fontSize: 12 },
  });
