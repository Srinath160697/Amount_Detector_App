import { useState } from "react";

import type { AmountFormValues, AmountRecord } from "../types";

import { calculateRecord, validateAmountForm } from "../utils";

export default function useAmountCalculator() {
  const [amount, setAmount] = useState("");
  const [percentage, setPercentage] = useState("");
  const [selectedKg, setSelectedKg] = useState<number | null>(null);
  const [packs, setPacks] = useState("");

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [records, setRecords] = useState<AmountRecord[]>([]);

  const form: AmountFormValues = {
    amount,
    percentage,
    selectedKg,
    packs,
  };

  const openModal = () => {
    setDropdownVisible(false);
    setModalVisible(true);
  };

  const closeModal = () => {
    setDropdownVisible(false);
    setModalVisible(false);
  };

  const resetForm = () => {
    setAmount("");
    setPercentage("");
    setSelectedKg(null);
    setPacks("");
    setDropdownVisible(false);
  };

  const addRecord = (): string | null => {
    const validationError = validateAmountForm(form);

    if (validationError) {
      return validationError;
    }

    const newRecord = calculateRecord(form, `${Date.now()}-${records.length}`);

    setRecords((previousRecords) => [...previousRecords, newRecord]);

    resetForm();
    setModalVisible(false);

    return null;
  };

  return {
    // Form state
    amount,
    setAmount,
    percentage,
    setPercentage,
    selectedKg,
    setSelectedKg,
    packs,
    setPacks,

    // Dropdown and modal state
    dropdownVisible,
    setDropdownVisible,
    modalVisible,

    // Records
    records,

    // Actions
    openModal,
    closeModal,
    addRecord,
  };
}
