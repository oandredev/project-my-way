import { useEffect } from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import HomeScreen from "../screens/HomeScreen";
import RestoringScreen from "../screens/RestoringScreen";
import StudyItemFormScreen from "../screens/StudyItemFormScreen";
import CategoryFormScreen from "../screens/CategoryFormScreen";
import CategoriesScreen from "../screens/CategoriesScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { colors, isDark } = useTheme();
  const { user, restoring } = useAuth();

  const formHeader = {
    headerShown: true,
    headerTintColor: colors.primary,
    headerTitleStyle: { color: colors.text },
    headerShadowVisible: false,
    headerBackTitle: "Voltar",
    animation: "slide_from_right",
    animationDuration: 250,
  };

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background);
  }, [colors.background]);

  const base = isDark ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "fade",
          animationDuration: 100,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        {restoring ? (
          <Stack.Screen name="Restoring" component={RestoringScreen} />
        ) : user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="StudyItemForm"
              component={StudyItemFormScreen}
              options={({ route }) => ({
                ...formHeader,
                title: route.params?.item ? "Editar item" : "Novo item",
              })}
            />
            <Stack.Screen
              name="CategoryForm"
              component={CategoryFormScreen}
              options={({ route }) => ({
                ...formHeader,
                title: route.params?.category
                  ? "Editar categoria"
                  : "Nova categoria",
              })}
            />
            <Stack.Screen
              name="Categories"
              component={CategoriesScreen}
              options={{ ...formHeader, title: "Categorias" }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
