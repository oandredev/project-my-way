import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "../components/Button";
import CategoryChips from "../components/CategoryChips";
import Logo from "../components/Logo";
import SearchBar from "../components/SearchBar";
import StudyItemCard from "../components/StudyItemCard";
import SummaryCard from "../components/SummaryCard";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { useStudyItems } from "../hooks/useStudyItems";
import { useCategories } from "../hooks/useCategories";
import { normalizeText, summarize } from "../utils/studyItem";

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const { user, signOut } = useAuth();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const {
    items,
    loading: loadingItems,
    error: itemsError,
    reload: reloadItems,
  } = useStudyItems();
  const {
    categories,
    loading: loadingCategories,
    error: categoriesError,
    reload: reloadCategories,
  } = useCategories();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null); // null = all
  const [refreshing, setRefreshing] = useState(false);

  const loading = loadingItems || loadingCategories;
  const error = itemsError || categoriesError;
  const firstName = user?.name?.split(" ")[0] ?? "";

  const categoriesById = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories],
  );

  const summary = useMemo(() => summarize(items), [items]);

  const filteredItems = useMemo(() => {
    const term = normalizeText(search.trim());
    return items.filter((item) => {
      if (selectedCategory !== null && item.categoryId !== selectedCategory) {
        return false;
      }
      return (
        !term ||
        normalizeText(`${item.title} ${item.institution ?? ""}`).includes(term)
      );
    });
  }, [items, search, selectedCategory]);

  async function handleRefresh() {
    setRefreshing(true);
    await Promise.all([reloadItems(), reloadCategories()]);
    setRefreshing(false);
  }

  // Create and edit use the same screen: with "item" it's editing; without "item" it's creation.
  function openForm(item) {
    navigation.navigate("StudyItemForm", item ? { item } : undefined);
  }

  function renderBody() {
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (error && items.length === 0) {
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
            onPress={handleRefresh}
            style={styles.retry}
          />
        </View>
      );
    }

    return (
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <StudyItemCard
            item={item}
            category={categoriesById.get(item.categoryId)}
            onEdit={() => openForm(item)}
          />
        )}
        ListHeaderComponent={<SummaryCard summary={summary} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="school-outline"
              size={48}
              color={colors.textMuted}
            />
            <Text style={styles.emptyTitle}>
              {items.length === 0 ? "Nenhum item ainda" : "Nada encontrado"}
            </Text>
            <Text style={styles.emptyText}>
              {items.length === 0
                ? "Toque no + para criar seu primeiro curso, certificação ou aula."
                : "Tente outro termo ou outra categoria."}
            </Text>
          </View>
        }
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.greetingRow}>
          <Logo size={40} />
          <View style={styles.greetingText}>
            <Text style={styles.hello}>Olá, {firstName}</Text>
            <Text style={styles.subtitle}>
              Continue sua trilha de aprendizado
            </Text>
          </View>
          <Pressable style={styles.iconButton} onPress={signOut} hitSlop={8}>
            <Ionicons
              name="log-out-outline"
              size={22}
              color={colors.textMuted}
            />
          </Pressable>
        </View>

        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar por título ou instituição..."
        />
        <CategoryChips
          categories={categories}
          selectedId={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </View>

      <View style={styles.content}>{renderBody()}</View>

      <Pressable
        style={styles.fab}
        onPress={() => openForm()}
        accessibilityLabel="Criar item"
      >
        <Ionicons name="add" size={30} color={colors.onPrimary} />
      </Pressable>
    </View>
  );
}

//--------------------------------------------------------------

const createStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    top: {
      backgroundColor: colors.surface,
      paddingTop: 56,
      paddingBottom: 12,
      gap: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    greetingRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 24,
    },
    greetingText: { flex: 1 },
    hello: { color: colors.text, fontSize: 22, fontWeight: "bold" },
    subtitle: { color: colors.textMuted, fontSize: 14 },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surfaceAlt,
      alignItems: "center",
      justifyContent: "center",
    },
    content: { flex: 1 },
    list: { paddingBottom: 110, flexGrow: 1 },
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 32,
    },
    empty: {
      alignItems: "center",
      paddingHorizontal: 32,
      paddingTop: 24,
      gap: 8,
    },
    emptyTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "700",
      marginTop: 8,
    },
    emptyText: { color: colors.textMuted, fontSize: 15, textAlign: "center" },
    retry: { marginTop: 16, alignSelf: "stretch" },
    fab: {
      position: "absolute",
      right: 24,
      bottom: 32,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      elevation: 6,
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
    },
  });
