import type { AmountFormValues, AmountRecord } from "./types";

export const KG_OPTIONS = [29, 30, 49, 50];

export const formatAmount = (value: number): string => {
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const validateAmountForm = (form: AmountFormValues): string | null => {
  const actualAmount = Number(form.amount);
  const percentage = Number(form.percentage);
  const packCount = Number(form.packs);

  if (
    form.amount.trim() === "" ||
    form.percentage.trim() === "" ||
    form.packs.trim() === "" ||
    form.selectedKg === null ||
    !Number.isFinite(actualAmount) ||
    !Number.isFinite(percentage) ||
    !Number.isInteger(packCount) ||
    actualAmount < 0 ||
    percentage < 0 ||
    percentage > 100 ||
    packCount <= 0
  ) {
    return (
      "Enter a valid amount, percentage between 0 and 100, " +
      "select a weight, and enter a positive whole number of packs."
    );
  }

  return null;
};

export const calculateRecord = (
  form: AmountFormValues,
  id: string,
): AmountRecord => {
  const amount = Number(form.amount);
  const percentage = Number(form.percentage);
  const packs = Number(form.packs);
  const kg = form.selectedKg!;

  const percentageAmount = (amount * percentage) / 100;
  const total = amount + percentageAmount;
  const finalValue = (total * kg * packs) / 10;

  return {
    id,
    amount,
    percentage,
    percentageAmount,
    total,
    kg,
    packs,
    finalValue,
  };
};

export const calculatePreview = (form: AmountFormValues): number | null => {
  if (
    form.amount.trim() === "" ||
    form.percentage.trim() === "" ||
    form.packs.trim() === "" ||
    form.selectedKg === null
  ) {
    return null;
  }

  const amount = Number(form.amount);
  const percentage = Number(form.percentage);
  const packs = Number(form.packs);

  if (
    !Number.isFinite(amount) ||
    !Number.isFinite(percentage) ||
    !Number.isFinite(packs) ||
    amount < 0 ||
    percentage < 0 ||
    percentage > 100 ||
    !Number.isInteger(packs) ||
    packs <= 0
  ) {
    return null;
  }

  const total = amount + (amount * percentage) / 100;

  return (total * form.selectedKg * packs) / 10;
};
