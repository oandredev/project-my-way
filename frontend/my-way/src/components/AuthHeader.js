import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import Logo from "./Logo";

export default function AuthHeader() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <>
      <View style={styles.header}>
        <Logo size={44} />
        <View style={styles.headerText}>
          <Text style={styles.brand}>
            My<Text style={styles.brandAccent}>Way</Text>
          </Text>
          <Text style={styles.brandSub}>
            Sua jornada de aprendizado, do seu jeito.
          </Text>
        </View>
      </View>
      <View style={styles.line} />
    </>
  );
}

//--------------------------------------------------------------

const createStyles = (colors) =>
  StyleSheet.create({
    header: {
      backgroundColor: colors.surface,
      flexDirection: "row",
      alignItems: "center",
      paddingTop: 56,
      paddingBottom: 20,
      paddingHorizontal: 24,
    },
    headerText: { marginLeft: 14 },
    brand: { color: colors.text, fontSize: 24, fontWeight: "bold" },
    brandAccent: { color: colors.primary },
    brandSub: {
      color: colors.textMuted,
      fontSize: 14,
    },
    line: { height: 3, backgroundColor: colors.primary },
  });
