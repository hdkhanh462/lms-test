import type { PropsWithChildren } from "react";

import { ThemeProvider } from "@/components/providers/theme.provider";

export default function AppProvider({ children }: PropsWithChildren) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {children}
    </ThemeProvider>
  );
}
