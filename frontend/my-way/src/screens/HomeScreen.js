import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { updateStudyItem } from "../services/studyItemService";
import {
  HOURS_STEP,
  adjustHours,
  deriveStatus,
  normalizeText,
  summarize,
} from "../utils/studyItem";
import { buildItemPayload, itemToValues } from "../utils/studyItemForm";

const SAVE_DELAY_MS = 600;

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const { user, signOut } = useAuth();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const {
    items,
    setItems,
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
  const [selectedCategory, setSelectedCategory] = useState(null);
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

  const latest = useRef({ items, categoriesById });
  latest.current = { items, categoriesById };

  const saveTimers = useRef({});

  useEffect(() => {
    const timers = saveTimers.current;
    return () => Object.values(timers).forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (
      !loadingCategories &&
      !categoriesError &&
      selectedCategory !== null &&
      !categories.some((c) => c.id === selectedCategory)
    ) {
      setSelectedCategory(null);
    }
  }, [categories, loadingCategories, categoriesError, selectedCategory]);

  function handleAdjustHours(item, direction) {
    const total = Number(item.totalHours) || 0;
    const done = Number(item.doneHours) || 0;
    const next = adjustHours(done, total, direction * HOURS_STEP);
    if (next === done) return;

    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? { ...i, doneHours: next, status: deriveStatus(next, total) }
          : i,
      ),
    );

    clearTimeout(saveTimers.current[item.id]);
    saveTimers.current[item.id] = setTimeout(
      () => saveHours(item.id),
      SAVE_DELAY_MS,
    );
  }

  async function saveHours(itemId) {
    const { items: currentItems, categoriesById: currentCategories } =
      latest.current;

    const item = currentItems.find((i) => i.id === itemId);
    if (!item) return;

    try {
      const categoryId = currentCategories.has(item.categoryId)
        ? item.categoryId
        : null;
      const payload = buildItemPayload(
        { ...itemToValues(item), categoryId },
        true,
      );
      await updateStudyItem(item.id, payload);
    } catch (e) {
      Alert.alert("Não foi possível salvar as horas", e.message);
      reloadItems();
    }
  }

  //--------------------------------------------------------------

  function handleSignOut() {
    Alert.alert(
      "Sair da conta",
      "Tem certeza de que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sair", style: "destructive", onPress: signOut },
      ],
      { cancelable: true },
    );
  }

  async function handleRefresh() {
    setRefreshing(true);
    await Promise.all([reloadItems(), reloadCategories()]);
    setRefreshing(false);
  }

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
            onAdjustHours={(direction) => handleAdjustHours(item, direction)}
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
          <Pressable
            style={styles.iconButton}
            onPress={() => navigation.navigate("Settings")}
            hitSlop={8}
            accessibilityLabel="Configurações"
          >
            <Ionicons
              name="settings-outline"
              size={22}
              color={colors.textMuted}
            />
          </Pressable>
          <Pressable
            style={styles.iconButton}
            onPress={handleSignOut}
            hitSlop={8}
          >
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
          onAdd={() => navigation.navigate("CategoryForm")}
          onManage={() => navigation.navigate("Categories")}
          onEditCategory={(category) =>
            navigation.navigate("CategoryForm", { category })
          }
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
