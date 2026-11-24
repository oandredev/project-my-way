import { View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export default function ProgressBar({ percent, color, height = 8 }) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        height,
        borderRadius: height / 2,
        backgroundColor: colors.border,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          width: `${percent}%`,
          height: "100%",
          backgroundColor: color ?? colors.primary,
        }}
      />
    </View>
  );
}
