import "server-only";

// We can use a simple Map for caching
const dictionaries = new Map<string, () => Promise<any>>();

dictionaries.set("en", () =>
  import("../messages/en.json").then((module) => module.default)
);
dictionaries.set("fa", () =>
  import("../messages/fa.json").then((module) => module.default)
);

export const getDictionary = async (locale: string) => {
  const load = dictionaries.get(locale);
  if (!load) {
    throw new Error(`Dictionary for locale "${locale}" not found.`);
  }
  return load();
};
