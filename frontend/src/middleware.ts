import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "fa"],
  defaultLocale: "fa",
});

export const config = {
  // This is the crucial change.
  // We are explicitly telling the middleware to run on the root (`/`)
  // and on all paths that have a locale prefix.
  matcher: ["/", "/(fa|en)/:path*"],
};
