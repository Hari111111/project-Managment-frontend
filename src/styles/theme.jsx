import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ColorModeContext = createContext({
  mode: "light",
  toggleMode: () => {},
});

export function ColorModeProvider({ children }) {
  const [mode, setMode] = useState(localStorage.getItem("pms_theme") || "light");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", mode === "dark");
    root.style.colorScheme = mode;
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      toggleMode: () => {
        setMode((currentMode) => {
          const nextMode = currentMode === "light" ? "dark" : "light";
          localStorage.setItem("pms_theme", nextMode);
          return nextMode;
        });
      },
    }),
    [mode]
  );

  return <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>;
}

export function useColorMode() {
  return useContext(ColorModeContext);
}
