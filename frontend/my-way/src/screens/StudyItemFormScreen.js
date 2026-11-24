import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export default function StudyItemFormScreen({ route }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const item = route.params?.item;
  const isEditing = Boolean(item);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isEditing ? `Editando: ${item.title}` : "Criando um novo item"}
      </Text>
      <Text style={styles.subtitle}>Em desenvolvimento</Text>
    </View>
  );
}

//--------------------------------------------------------------

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 24,
    },
    title: { color: colors.text, fontSize: 18, fontWeight: "600" },
    subtitle: { color: colors.textMuted, fontSize: 15, marginTop: 8 },
  });
