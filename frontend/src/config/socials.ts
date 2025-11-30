// Central social config used across the app
export const CONTACT_PHONE = "09127632321";
export const INSTAGRAM_URL = "https://www.instagram.com/safariyan_sima_art";

export type SocialItem = {
  label: string;
  icon: string;
  link: string;
};

// Only include real links; unset/empty links are intentionally left blank so
// UI code can filter them out before rendering.
export const SOCIALS: SocialItem[] = [
  { label: "Facebook", icon: "/icons/facebook.svg", link: "" },
  { label: "Instagram", icon: "/icons/instagram.svg", link: INSTAGRAM_URL },
  { label: "LinkedIn", icon: "/icons/linkedin.svg", link: "" },
  { label: "X", icon: "/icons/x.svg", link: "" },
];