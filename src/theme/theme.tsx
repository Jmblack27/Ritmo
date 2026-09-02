import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";

export type ThemeMode = "light" | "dark";
const palettes = {
  light: {
    background: "#F6F7F3",
    surface: "#FFFFFF",
    surfaceMuted: "#EEF0EA",
    text: "#18201B",
    textMuted: "#68716B",
    border: "#DDE2DC",
    primary: "#236B4A",
    primarySoft: "#DCEFE5",
    onPrimary: "#FFFFFF",
    danger: "#BA3A3A",
    dangerSoft: "#FCE8E7",
    shadow: "#10231A",
  },
  dark: {
    background: "#101512",
    surface: "#19201C",
    surfaceMuted: "#222B26",
    text: "#F1F5F2",
    textMuted: "#A6B0A9",
    border: "#303B34",
    primary: "#6DD6A2",
    primarySoft: "#173C2B",
    onPrimary: "#0B2719",
    danger: "#FFB4AB",
    dangerSoft: "#4A2020",
    shadow: "#000000",
  },
} as const;
export type ThemeColors = (typeof palettes)[ThemeMode];
type ThemeValue = {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleMode: () => void;
};
const ThemeContext = createContext<ThemeValue | null>(null);
export function ThemeProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(() =>
    systemScheme === "dark" ? "dark" : "light",
  );
  const value = useMemo(
    () => ({
      mode,
      colors: palettes[mode],
      toggleMode: () =>
        setMode((current) => (current === "dark" ? "light" : "dark")),
    }),
    [mode],
  );
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
export function useAppTheme() {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error("useAppTheme must be used inside ThemeProvider");
  return theme;
}
