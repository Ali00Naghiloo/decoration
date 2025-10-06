"use client";

import { useTranslations } from "next-intl";

/**
 * A custom hook that wraps the official `useTranslations` hook from `next-intl`.
 * This allows us to use it without a namespace, matching the behavior of our previous custom hook.
 */
export const useTranslation = () => {
  // 1. Call the official hook from `next-intl`.
  // By calling it WITHOUT an argument, we tell it that the `t` function
  // will expect the full path to a key (e.g., 'Index.title').
  const t = useTranslations();

  // 2. Return the `t` function in the same shape as your old hook ({ t }).
  // This means you don't have to change any of the components that use this hook!
  return { t };
};
