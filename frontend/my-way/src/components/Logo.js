import { useMemo } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export default function Logo({ size = 44 }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(size, colors), [size, colors]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/logo-icon.png")}
        style={styles.icon}
        resizeMode="contain"
      />
    </View>
  );
}

//--------------------------------------------------------------

const createStyles = (size, colors) =>
  StyleSheet.create({
    container: {
      width: size,
      height: size,
      borderRadius: size * 0.25,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    icon: {
      width: size * 0.6,
      height: size * 0.6,
      tintColor: colors.onS,
    },
  });
