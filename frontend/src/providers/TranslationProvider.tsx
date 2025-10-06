"use client";
import { createContext, ReactNode } from "react";

// Define a generic type for our dictionary. It's an object with string keys and any value.
type Dictionary = { [key: string]: any };

// 1. Create the context with a null default value
export const TranslationsContext = createContext<Dictionary | null>(null);

// 2. Create the Provider component
export function TranslationsProvider({
  children,
  dictionary,
}: {
  children: ReactNode;
  dictionary: Dictionary;
}) {
  return (
    <TranslationsContext.Provider value={dictionary}>
      {children}
    </TranslationsContext.Provider>
  );
}
