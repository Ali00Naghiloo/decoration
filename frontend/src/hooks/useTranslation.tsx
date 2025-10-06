"use client";

import { useContext } from "react";
import { TranslationsContext } from "../providers/TranslationProvider";

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
