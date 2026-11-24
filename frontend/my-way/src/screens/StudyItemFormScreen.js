import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Button from "../components/Button";
import CategoryChips from "../components/CategoryChips";
import FormField from "../components/FormField";
import SegmentedControl from "../components/SegmentedControl";
import { useTheme } from "../contexts/ThemeContext";
import { useCategories } from "../hooks/useCategories";
import { createStudyItem, updateStudyItem } from "../services/studyItemService";
import {
  buildItemPayload,
  itemToValues,
  maskDate,
  validateItemForm,
} from "../utils/studyItemForm";

const PRIORITY_OPTIONS = [
  { value: "LOW", label: "Baixa" },
  { value: "MEDIUM", label: "Média" },
  { value: "HIGH", label: "Alta" },
];

export default function StudyItemFormScreen({ route, navigation }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const item = route.params?.item;
  const isEditing = Boolean(item);
  const initial = useMemo(() => itemToValues(item), [item]);

  const { categories, loading: loadingCategories } = useCategories();

  const [title, setTitle] = useState(initial.title);
  const [institution, setInstitution] = useState(initial.institution);
  const [categoryId, setCategoryId] = useState(initial.categoryId);
  const [priority, setPriority] = useState(initial.priority);
  const [totalHours, setTotalHours] = useState(initial.totalHours);
  const [doneHours, setDoneHours] = useState(initial.doneHours);
  const [deadline, setDeadline] = useState(initial.deadline);
  const [link, setLink] = useState(initial.link);
  const [notes, setNotes] = useState(initial.notes);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const awaitingNewCategory = useRef(false);
  const knownCategoryIds = useRef(null);

  useEffect(() => {
    if (loadingCategories) return;

    if (awaitingNewCategory.current && knownCategoryIds.current) {
      const created = categories.find(
        (c) => !knownCategoryIds.current.has(c.id),
      );
      if (created) {
        setCategoryId(created.id);
        awaitingNewCategory.current = false;
      }
    }
    knownCategoryIds.current = new Set(categories.map((c) => c.id));
  }, [categories, loadingCategories]);

  useEffect(() => {
    if (
      !loadingCategories &&
      categoryId !== null &&
      !categories.some((c) => c.id === categoryId)
    ) {
      setCategoryId(null);
    }
  }, [categories, loadingCategories, categoryId]);

  function handleNewCategory() {
    awaitingNewCategory.current = true;
    navigation.navigate("CategoryForm");
  }

  async function handleSave() {
    const values = {
      title,
      institution,
      link,
      notes,
      priority,
      totalHours,
      doneHours,
      deadline,
      categoryId,
    };

    const validationError = validateItemForm(values, isEditing);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);
    try {
      const payload = buildItemPayload(values, isEditing);
      if (isEditing) {
        await updateStudyItem(item.id, payload);
      } else {
        await createStudyItem(payload);
      }
      navigation.goBack();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleArchive() {
    Alert.alert(
      "Excluir item",
      "Ele será removido permanentemente. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: archive },
      ],
    );
  }

  async function archive() {
    setError("");
    setLoading(true);
    try {
      const payload = buildItemPayload({ ...initial, categoryId }, true, false);
      await updateStudyItem(item.id, payload);
      navigation.goBack();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "android" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        keyboardDismissMode="on-drag"
      >
        <FormField
          label="Título"
          placeholder="Ex.: Curso de React Native"
          autoCapitalize="sentences"
          value={title}
          onChangeText={setTitle}
        />
        <FormField
          label="Instituição"
          placeholder="Ex.: Alura, Udemy, SENAC"
          autoCapitalize="words"
          value={institution}
          onChangeText={setInstitution}
        />

        <Text style={styles.label}>Categoria (opcional)</Text>
        <View style={styles.chipsBleed}>
          <CategoryChips
            categories={categories}
            selectedId={categoryId}
            onSelect={setCategoryId}
            allLabel="Sem categoria"
            onAdd={handleNewCategory}
          />
        </View>

        <Text style={styles.label}>Prioridade</Text>
        <View style={styles.block}>
          <SegmentedControl
            options={PRIORITY_OPTIONS}
            value={priority}
            onChange={setPriority}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.rowItem}>
            <FormField
              label="Total de horas"
              placeholder="Ex.: 40"
              keyboardType="decimal-pad"
              value={totalHours}
              onChangeText={setTotalHours}
            />
          </View>
          {isEditing && (
            <View style={styles.rowItem}>
              <FormField
                label="Horas feitas"
                placeholder="Ex.: 12"
                keyboardType="decimal-pad"
                value={doneHours}
                onChangeText={setDoneHours}
              />
            </View>
          )}
        </View>
        {isEditing && (
          <Text style={styles.hint}>
            O status (a fazer, em andamento ou concluído) é calculado pelas
            horas feitas.
          </Text>
        )}

        <FormField
          label="Prazo (opcional)"
          placeholder="dd/mm/aaaa"
          keyboardType="number-pad"
          maxLength={10}
          value={deadline}
          onChangeText={(text) => setDeadline(maskDate(text))}
        />
        <FormField
          label="Link (opcional)"
          placeholder="https://..."
          keyboardType="url"
          value={link}
          onChangeText={setLink}
        />
        <FormField
          label="Notas (opcional)"
          placeholder="Anotações sobre este item"
          autoCapitalize="sentences"
          multiline
          value={notes}
          onChangeText={setNotes}
        />

        {error !== "" && <Text style={styles.error}>{error}</Text>}

        <Button
          title={
            loading
              ? "Salvando..."
              : isEditing
                ? "Salvar alterações"
                : "Criar item"
          }
          icon={loading ? undefined : "checkmark-outline"}
          onPress={handleSave}
          disabled={loading}
        />

        {isEditing && (
          <Button
            variant="danger"
            title="Excluir item"
            icon="archive-outline"
            onPress={handleArchive}
            disabled={loading}
            style={styles.archive}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

//--------------------------------------------------------------

const createStyles = (colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { padding: 24, paddingBottom: 48 },
    label: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "600",
      marginBottom: 8,
    },
    chipsBleed: { marginHorizontal: -24, marginBottom: 20 },
    block: { marginBottom: 20 },
    row: { flexDirection: "row", gap: 12 },
    rowItem: { flex: 1 },
    hint: {
      color: colors.textMuted,
      fontSize: 13,
      marginTop: -12,
      marginBottom: 20,
    },
    error: {
      color: colors.error,
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 12,
    },
    archive: { marginTop: 16 },
  });
