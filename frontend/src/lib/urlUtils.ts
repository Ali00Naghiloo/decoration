// Utility to normalize URLs
export function normalizeUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_FILE_BASE_URL || "";

  // Handle relative paths
  if (!path.startsWith("http") && !path.startsWith("//")) {
    return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  }

  // Handle absolute URLs that might be missing /api
  if (path.startsWith("https://api.rokhnegar.art/uploads/")) {
    return path.replace(
      "https://api.rokhnegar.art/uploads/",
      "https://api.rokhnegar.art/api/uploads/"
    );
  }

  return path; // Already a complete and correct URL
}
