import type { TranslationKey } from "@/lib/i18n/translations";

export interface NavItem {
  key: string;
  titleKey: TranslationKey;
  href: string;
}

const navItems: NavItem[] = [
  {
    key: "1-home",
    titleKey: "nav.home",
    href: "/",
  },
  {
    key: "2-deals",
    titleKey: "nav.deals",
    href: "/deals",
  },
  {
    key: "3-new",
    titleKey: "nav.whatIsNew",
    // The label enum value is "New" (capitalized); the API match is case-sensitive.
    href: "/shop?label=New",
  },
  {
    key: "4-deliveries",
    titleKey: "nav.delivery",
    // /user/deliveries doesn't exist; deliveries are tracked from the user dashboard.
    href: "/user/dashboard",
  },
];

export default navItems;
