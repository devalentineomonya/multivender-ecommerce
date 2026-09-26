export interface CurrencyOption {
  code: "USD" | "KES" | "EUR" | "GBP" | "UGX" | "TSH";
  label: string;
}

const currencies: CurrencyOption[] = [
  { code: "USD", label: "USD ($)" },
  { code: "KES", label: "KES (KSh)" },
  { code: "EUR", label: "EUR (€)" },
  { code: "GBP", label: "GBP (£)" },
  { code: "UGX", label: "UGX (USh)" },
  { code: "TSH", label: "TSH (TSh)" },
];

export default currencies;