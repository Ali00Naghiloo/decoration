import { i18nRouter } from "next-i18n-router";
import i18nConfig from "./i18nConfig";

export function middleware(request: Request) {
  return i18nRouter(request, i18nConfig);
}

// applies this middleware to all routes
export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
