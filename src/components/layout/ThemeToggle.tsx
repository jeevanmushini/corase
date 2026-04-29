"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center bg-foreground/5 border border-foreground/10 rounded-full p-1 backdrop-blur-md shadow-sm">
      <button
        onClick={() => setTheme("light")}
        className={`p-2 rounded-full transition-all ${theme === "light"
            ? "bg-foreground text-background shadow-lg"
            : "text-foreground/40 hover:text-foreground"
          }`}
        aria-label="Light mode"
      >
        <Sun size={14} strokeWidth={2.5} />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-2 rounded-full transition-all ${theme === "dark"
            ? "bg-foreground text-background shadow-lg"
            : "text-foreground/40 hover:text-foreground"
          }`}
        aria-label="Dark mode"
      >
        <Moon size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
}
