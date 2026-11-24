import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "../components/Button";
import { useTheme } from "../contexts/ThemeContext";
import { useCategories } from "../hooks/useCategories";
import { updateCategory } from "../services/categoryService";
import { getCategoryColor } from "../theme/theme";

export default function CategoriesScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { categories, loading, error, reload } = useCategories();
  const [busyId, setBusyId] = useState(null);
  const [actionError, setActionError] = useState("");

  function confirmDelete(category) {
    Alert.alert(
      "Excluir categoria",
      `Excluir "${category.name}"? Ela deixará de aparecer nos filtros e os itens dela ficarão sem categoria.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => remove(category),
        },
      ],
    );
  }

  async function remove(category) {
    setActionError("");
    setBusyId(category.id);
    try {
      await updateCategory(category.id, {
        name: category.name,
        colorId: category.colorId,
        active: false,
      });
      await reload();
    } catch (e) {
      setActionError(e.message);
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error && categories.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons
          name="cloud-offline-outline"
          size={48}
          color={colors.textMuted}
        />
        <Text style={styles.emptyTitle}>Não foi possível carregar</Text>
        <Text style={styles.emptyText}>{error}</Text>
        <Button
          variant="outline"
          title="Tentar novamente"
          icon="refresh-outline"
          onPress={reload}
          style={styles.retry}
        />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.list}
      data={categories}
      keyExtractor={(category) => String(category.id)}
      ListHeaderComponent={
        <View style={styles.header}>
          <Button
            title="Nova categoria"
            icon="add"
            onPress={() => navigation.navigate("CategoryForm")}
          />
          {actionError !== "" && (
            <Text style={styles.error}>{actionError}</Text>
          )}
        </View>
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Ionicons
            name="pricetags-outline"
            size={48}
            color={colors.textMuted}
          />
          <Text style={styles.emptyTitle}>Nenhuma categoria ainda</Text>
          <Text style={styles.emptyText}>
            Crie categorias para organizar seus cursos e certificações.
          </Text>
        </View>
      }
      renderItem={({ item: category }) => {
        const busy = busyId === category.id;
        const tint = getCategoryColor(category.colorId, colors.primary);

        return (
          <View
            style={[
              styles.row,
              { borderColor: tint, backgroundColor: `${tint}22` },
            ]}
          >
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: getCategoryColor(
                    category.colorId,
                    colors.primary,
                  ),
                },
              ]}
            />
            <Text style={styles.name} numberOfLines={1}>
              {category.name}
            </Text>

            <Pressable
              style={[styles.iconButton, styles.editButton]}
              onPress={() => navigation.navigate("CategoryForm", { category })}
              disabled={busy}
              accessibilityLabel={`Editar ${category.name}`}
            >
              <Ionicons
                name="create-outline"
                size={20}
                color={colors.primary}
              />
            </Pressable>

            <Pressable
              style={[styles.iconButton, styles.deleteButton]}
              onPress={() => confirmDelete(category)}
              disabled={busy}
              accessibilityLabel={`Excluir ${category.name}`}
            >
              {busy ? (
                <ActivityIndicator size="small" color={colors.error} />
              ) : (
                <Ionicons name="trash-outline" size={20} color={colors.error} />
              )}
            </Pressable>
          </View>
        );
      }}
    />
  );
}

//--------------------------------------------------------------

const createStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    list: { padding: 24, paddingBottom: 48, flexGrow: 1 },
    header: { marginBottom: 20 },
    error: {
      color: colors.error,
      fontSize: 15,
      fontWeight: "600",
      marginTop: 12,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
      marginBottom: 10,
    },
    dot: { width: 16, height: 16, borderRadius: 8 },
    name: { flex: 1, color: colors.text, fontSize: 16, fontWeight: "600" },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    editButton: { backgroundColor: colors.primarySoft },
    deleteButton: { backgroundColor: `${colors.error}22` },
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 32,
      backgroundColor: colors.background,
    },
    empty: { alignItems: "center", paddingTop: 24, gap: 8 },
    emptyTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "700",
      marginTop: 8,
    },
    emptyText: { color: colors.textMuted, fontSize: 15, textAlign: "center" },
    retry: { marginTop: 16, alignSelf: "stretch" },
  });
