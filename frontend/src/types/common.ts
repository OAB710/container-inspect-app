export interface SelectOption {
  label: string;
  value: string;
  subtitle?: string;
  meta?: string;
  status?: string;
  disabled?: boolean;
  disabledReason?: string;
}
