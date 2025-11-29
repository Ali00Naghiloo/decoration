// Central social config used across the app
export const CONTACT_PHONE = "09127632321";
export const INSTAGRAM_URL = "https://www.instagram.com/safariyan_sima_art";

export type SocialItem = {
  label: string;
  icon: string;
  link: string;
};

export const SOCIALS: SocialItem[] = [
  { label: "Facebook", icon: "/icons/facebook.svg", link: "https://facebook.com" },
  { label: "Instagram", icon: "/icons/instagram.svg", link: INSTAGRAM_URL },
  { label: "LinkedIn", icon: "/icons/linkedin.svg", link: "https://linkedin.com" },
  { label: "X", icon: "/icons/x.svg", link: "https://twitter.com" },
];