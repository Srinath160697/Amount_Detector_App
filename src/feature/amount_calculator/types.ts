export type AmountRecord = {
  id: string;
  amount: number;
  percentage: number;
  percentageAmount: number;
  total: number;
  kg: number;
  packs: number;
  finalValue: number;
};

export type AmountFormValues = {
  amount: string;
  percentage: string;
  selectedKg: number | null;
  packs: string;
};

export type AddRecordResult = {
  success: boolean;
  error?: string;
};
