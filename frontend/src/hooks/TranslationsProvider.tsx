"use client";

import { createContext, useContext, ReactNode } from "react";

// Define a generic type for our dictionary. It's an object with string keys and any value.
type Dictionary = { [key: string]: any };

// 1. Create the context with a null default value
const TranslationsContext = createContext<Dictionary | null>(null);

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

// 3. Create the custom hook
export const useTranslation = () => {
  const dictionary = useContext(TranslationsContext);

  // Throw an error if the hook is used outside of the provider
  if (dictionary === null) {
    throw new Error(
      "useTranslation must be used within a TranslationsProvider"
    );
  }

  // This is the translation function that the hook will return
  const t = (key: string): string => {
    // Split the key by dots (e.g., "Index.title")
    const keys = key.split(".");

    // Use reduce to navigate through the nested dictionary object
    const result = keys.reduce((acc, currentKey) => {
      // If accumulator is valid and has the current key, go deeper
      if (acc && typeof acc === "object" && currentKey in acc) {
        return acc[currentKey];
      }
      // Otherwise, the path is broken
      return undefined;
    }, dictionary);

    // If the result is a string, return it. Otherwise, return the key as a fallback.
    return typeof result === "string" ? result : key;
  };

  return { t };
};
