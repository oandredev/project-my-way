import { useMemo, useState } from "react";
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
import ColorPicker from "../components/ColorPicker";
import FormField from "../components/FormField";
import { useTheme } from "../contexts/ThemeContext";
import { createCategory, updateCategory } from "../services/categoryService";
import { normalizeSpaces } from "../utils/studyItemForm";

export default function CategoryFormScreen({ route, navigation }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const category = route.params?.category;
  const isEditing = Boolean(category);

  const [name, setName] = useState(category?.name ?? "");
  const [colorId, setColorId] = useState(category?.colorId ?? null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    const n = normalizeSpaces(name);
    if (!n) return "Digite o nome da categoria.";
    if (n.length > 255) return "O nome deve ter no máximo 255 caracteres.";
    if (colorId === null) return "Escolha uma cor.";
    return "";
  }

  async function handleSave() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);
    try {
      const payload = { name: normalizeSpaces(name), colorId };
      if (isEditing) {
        await updateCategory(category.id, { ...payload, active: true });
      } else {
        await createCategory(payload);
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
      "Arquivar categoria",
      "Ela deixará de aparecer nos filtros, e os itens dela ficarão sem categoria na lista. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Arquivar", style: "destructive", onPress: archive },
      ],
    );
  }

  async function archive() {
    setError("");
    setLoading(true);
    try {
      await updateCategory(category.id, {
        name: category.name,
        colorId: category.colorId,
        active: false,
      });
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
          label="Nome"
          placeholder="Ex.: Programação, Idiomas"
          autoCapitalize="sentences"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Cor</Text>
        <View style={styles.block}>
          <ColorPicker value={colorId} onChange={setColorId} />
        </View>

        {error !== "" && <Text style={styles.error}>{error}</Text>}

        <Button
          title={
            loading
              ? "Salvando..."
              : isEditing
                ? "Salvar alterações"
                : "Criar categoria"
          }
          icon={loading ? undefined : "checkmark-outline"}
          onPress={handleSave}
          disabled={loading}
        />

        {isEditing && (
          <Button
            variant="danger"
            title="Arquivar categoria"
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
      marginBottom: 12,
    },
    block: { marginBottom: 24 },
    error: {
      color: colors.error,
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 12,
    },
    archive: { marginTop: 16 },
  });
