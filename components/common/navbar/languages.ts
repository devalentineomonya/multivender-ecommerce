export interface LanguageOption {
  code: "en" | "fr" | "de" | "es" | "sw";
  label: string;
}

const languages: LanguageOption[] = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "es", label: "Español" },
  { code: "sw", label: "Kiswahili" },
];

export default languages;