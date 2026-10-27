import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type AmountRecord = {
  id: string;
  amount: number;
  percentage: number;
  percentageAmount: number;
  total: number;
  kg: number;
  packs: number;
  finalValue: number;
};

export default function Index() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const [amount, setAmount] = useState("");
  const [percentage, setPercentage] = useState("");
  const [selectedKg, setSelectedKg] = useState<number | null>(null);
  const [packs, setPacks] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [records, setRecords] = useState<AmountRecord[]>([]);

  const kgOptions = [29, 30, 49, 50];
  const isSmallScreen = width < 380;

  const formatAmount = (value: number) =>
    value.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handleAdd = () => {
    const actualAmount = Number(amount);
    const percent = Number(percentage);
    const packCount = Number(packs);

    if (
      amount.trim() === "" ||
      percentage.trim() === "" ||
      packs.trim() === "" ||
      selectedKg === null ||
      !Number.isFinite(actualAmount) ||
      !Number.isFinite(percent) ||
      !Number.isInteger(packCount) ||
      actualAmount < 0 ||
      percent < 0 ||
      percent > 100 ||
      packCount <= 0
    ) {
      Alert.alert(
        "Invalid Input",
        "Enter a valid amount, percentage between 0 and 100, select a weight, and enter a positive whole number of packs.",
      );
      return;
    }

    const percentageAmount = (actualAmount * percent) / 100;
    const total = actualAmount + percentageAmount;
    const finalValue = (total * selectedKg * packCount) / 10;

    const newRecord: AmountRecord = {
      id: `${Date.now()}-${records.length}`,
      amount: actualAmount,
      percentage: percent,
      percentageAmount,
      total,
      kg: selectedKg,
      packs: packCount,
      finalValue,
    };

    setRecords((previousRecords) => [...previousRecords, newRecord]);

    setAmount("");
    setPercentage("");
    setSelectedKg(null);
    setPacks("");
    setDropdownVisible(false);
    setModalVisible(false);
  };

  const openModal = () => {
    setDropdownVisible(false);
    setModalVisible(true);
  };

  const closeModal = () => {
    setDropdownVisible(false);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
      {/* Main screen */}
      <View style={styles.screenContent}>
        <ScrollView
          style={styles.mainScroll}
          contentContainerStyle={[
            styles.container,
            {
              paddingBottom: 24 + 78 + Math.max(insets.bottom, 12),
            },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Amount Calculator</Text>
          <Text style={styles.subtitle}>
            Manage your amount calculations and records
          </Text>

          {/* Summary cards */}
          <View
            style={[
              styles.summaryCard,
              isSmallScreen && styles.summaryCardSmall,
            ]}
          >
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Records</Text>
              <Text style={styles.summaryCount}>{records.length}</Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryRight}>
              <Text style={styles.summaryLabel}>Latest Final Value</Text>
              <Text
                style={[
                  styles.summaryValue,
                  isSmallScreen && styles.summaryValueSmall,
                ]}
              >
                {records.length > 0
                  ? `₹${formatAmount(records[records.length - 1].finalValue)}`
                  : "₹0.00"}
              </Text>
            </View>
          </View>

          {/* Table */}
          <View style={styles.tableTitleRow}>
            <Text style={styles.sectionTitle}>Amount History</Text>
            <Text style={styles.recordBadge}>{records.length} records</Text>
          </View>

          <View style={styles.tableCard}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator
              nestedScrollEnabled
            >
              <View>
                <View style={styles.tableHeader}>
                  <Text style={[styles.headerCell, styles.slColumn]}>
                    Sl.No
                  </Text>
                  <Text style={[styles.headerCell, styles.amountColumn]}>
                    Amount (₹)
                  </Text>
                  <Text style={[styles.headerCell, styles.percentColumn]}>
                    Percentage
                  </Text>
                  <Text style={[styles.headerCell, styles.kgColumn]}>KG</Text>
                  <Text style={[styles.headerCell, styles.packsColumn]}>
                    Packs
                  </Text>
                  <Text style={[styles.headerCell, styles.totalColumn]}>
                    Total (₹)
                  </Text>
                  <Text style={[styles.headerCell, styles.finalColumn]}>
                    Final Value (₹)
                  </Text>
                </View>

                {records.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>＋</Text>
                    <Text style={styles.emptyTitle}>No records yet</Text>
                    <Text style={styles.emptyText}>
                      Tap the Add Record button to create your first record.
                    </Text>
                  </View>
                ) : (
                  records.map((item, index) => (
                    <View
                      key={item.id}
                      style={[
                        styles.tableRow,
                        index % 2 === 0 && styles.alternateRow,
                      ]}
                    >
                      <Text style={[styles.cell, styles.slColumn]}>
                        {index + 1}
                      </Text>

                      <Text style={[styles.cell, styles.amountColumn]}>
                        {formatAmount(item.amount)}
                      </Text>

                      <View style={[styles.percentColumn, styles.percentCell]}>
                        <Text style={styles.cell}>{item.percentage}%</Text>
                        <Text style={styles.smallText}>
                          +{formatAmount(item.percentageAmount)}
                        </Text>
                      </View>

                      <Text style={[styles.cell, styles.kgColumn]}>
                        {item.kg} kg
                      </Text>

                      <Text style={[styles.cell, styles.packsColumn]}>
                        {item.packs}
                      </Text>

                      <Text style={[styles.cell, styles.totalColumn]}>
                        {formatAmount(item.total)}
                      </Text>

                      <View style={styles.finalColumn}>
                        <Text style={styles.finalValueText}>
                          {formatAmount(item.finalValue)}
                        </Text>
                      </View>
                    </View>
                  ))
                )}
              </View>
            </ScrollView>
          </View>

          <Text style={styles.footerText}>
            All amounts are calculated automatically.
          </Text>
        </ScrollView>

        {/* Safe-area-aware floating button */}
        <View
          style={[
            styles.fabContainer,
            {
              bottom: Math.max(insets.bottom, 12) + 12,
              right: 16,
            },
          ]}
          pointerEvents="box-none"
        >
          <TouchableOpacity
            style={styles.fab}
            onPress={openModal}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Add new amount record"
          >
            <Text style={styles.fabIcon}>＋</Text>
            <Text style={styles.fabText}>Add Record</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Add record modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          {/* Explicit positioning avoids absoluteFillObject */}
          <Pressable style={styles.modalBackdrop} onPress={closeModal} />

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalKeyboard}
          >
            <View
              style={[
                styles.modalCard,
                {
                  paddingBottom: Math.max(insets.bottom, 16),
                },
              ]}
            >
              <View style={styles.modalHandle} />

              <View style={styles.modalHeader}>
                <View style={styles.modalHeadingContent}>
                  <Text style={styles.modalTitle}>Add New Record</Text>
                  <Text style={styles.modalSubtitle}>
                    Enter the details below
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={closeModal}
                  style={styles.closeButton}
                  accessibilityRole="button"
                  accessibilityLabel="Close form"
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
                contentContainerStyle={styles.formContent}
              >
                <Text style={styles.label}>Actual Amount (₹)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter actual amount"
                  placeholderTextColor="#94A3B8"
                  keyboardType="decimal-pad"
                  value={amount}
                  onChangeText={setAmount}
                />

                <Text style={styles.label}>Percentage (%)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter percentage, e.g. 10"
                  placeholderTextColor="#94A3B8"
                  keyboardType="decimal-pad"
                  value={percentage}
                  onChangeText={setPercentage}
                />

                <Text style={styles.label}>Select Weight (KG)</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setDropdownVisible(!dropdownVisible)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.dropdownText,
                      selectedKg === null && styles.placeholderText,
                    ]}
                  >
                    {selectedKg === null ? "Select weight" : `${selectedKg} kg`}
                  </Text>

                  <Text style={styles.arrow}>
                    {dropdownVisible ? "▲" : "▼"}
                  </Text>
                </TouchableOpacity>

                {dropdownVisible && (
                  <View style={styles.dropdownOptions}>
                    {kgOptions.map((kg) => (
                      <TouchableOpacity
                        key={kg}
                        style={[
                          styles.dropdownOption,
                          selectedKg === kg && styles.selectedOption,
                        ]}
                        onPress={() => {
                          setSelectedKg(kg);
                          setDropdownVisible(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            selectedKg === kg && styles.selectedOptionText,
                          ]}
                        >
                          {kg} kg
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <Text style={styles.label}>Number of Packs</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter number of packs"
                  placeholderTextColor="#94A3B8"
                  keyboardType="number-pad"
                  value={packs}
                  onChangeText={setPacks}
                />

                {/* Live calculation preview */}
                {amount.trim() !== "" &&
                  percentage.trim() !== "" &&
                  selectedKg !== null &&
                  packs.trim() !== "" &&
                  Number.isFinite(Number(amount)) &&
                  Number.isFinite(Number(percentage)) &&
                  Number.isFinite(Number(packs)) &&
                  Number(amount) >= 0 &&
                  Number(percentage) >= 0 &&
                  Number(percentage) <= 100 &&
                  Number.isInteger(Number(packs)) &&
                  Number(packs) > 0 && (
                    <View style={styles.previewCard}>
                      <Text style={styles.previewLabel}>
                        Calculated Final Value
                      </Text>
                      <Text style={styles.previewValue}>
                        ₹
                        {formatAmount(
                          (Number(amount) *
                            (1 + Number(percentage) / 100) *
                            selectedKg *
                            Number(packs)) /
                            10,
                        )}
                      </Text>
                      <Text style={styles.previewFormula}>
                        Total × {selectedKg} kg × {packs} packs ÷ 10
                      </Text>
                    </View>
                  )}

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={closeModal}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleAdd}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.saveButtonText}>Save Record</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F3F6FB",
  },
  screenContent: {
    flex: 1,
  },
  mainScroll: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#172554",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#64748B",
    marginTop: 7,
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 2,
  },
  summaryCardSmall: {
    padding: 13,
  },
  summaryItem: {
    flexShrink: 0,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
    marginBottom: 8,
  },
  summaryCount: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1D4ED8",
  },
  summaryDivider: {
    width: 1,
    height: 48,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 16,
  },
  summaryRight: {
    flex: 1,
    minWidth: 0,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#15803D",
  },
  summaryValueSmall: {
    fontSize: 15,
  },
  tableTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#172554",
    flexShrink: 1,
  },
  recordBadge: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1D4ED8",
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
  },
  tableCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#D7E0EC",
    elevation: 2,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#173A70",
    paddingVertical: 16,
  },
  headerCell: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 6,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    minHeight: 70,
    borderBottomWidth: 1,
    borderBottomColor: "#DCE5F0",
  },
  alternateRow: {
    backgroundColor: "#F0F6FF",
  },
  cell: {
    fontSize: 14,
    fontWeight: "600",
    color: "#26364B",
    textAlign: "center",
    paddingHorizontal: 6,
  },
  slColumn: {
    width: 65,
  },
  amountColumn: {
    width: 130,
  },
  percentColumn: {
    width: 130,
  },
  kgColumn: {
    width: 85,
  },
  packsColumn: {
    width: 85,
  },
  totalColumn: {
    width: 140,
  },
  finalColumn: {
    width: 155,
    justifyContent: "center",
    alignItems: "center",
  },
  percentCell: {
    alignItems: "center",
    justifyContent: "center",
  },
  smallText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
    marginTop: 5,
  },
  finalValueText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#15803D",
    textAlign: "center",
    paddingHorizontal: 5,
  },
  emptyContainer: {
    width: 790,
    paddingVertical: 45,
    paddingHorizontal: 24,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  emptyIcon: {
    fontSize: 36,
    color: "#2563EB",
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E293B",
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#64748B",
    textAlign: "center",
    marginTop: 7,
  },
  footerText: {
    marginTop: 16,
    fontSize: 13,
    color: "#64748B",
  },

  // Floating button
  fabContainer: {
    position: "absolute",
    zIndex: 10,
    elevation: 10,
  },
  fab: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    borderRadius: 30,
    backgroundColor: "#2563EB",
    elevation: 7,
    shadowColor: "#1E3A8A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  fabIcon: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "500",
    marginRight: 7,
  },
  fabText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15, 23, 42, 0.50)",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  modalKeyboard: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 22,
    paddingTop: 12,
    maxHeight: "90%",
  },
  modalHandle: {
    width: 42,
    height: 5,
    borderRadius: 5,
    backgroundColor: "#CBD5E1",
    alignSelf: "center",
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  modalHeadingContent: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: "#172554",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 5,
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  closeButtonText: {
    fontSize: 17,
    color: "#475569",
    fontWeight: "700",
  },
  formContent: {
    paddingBottom: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 9,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 11,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#0F172A",
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
  },
  dropdown: {
    height: 52,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 11,
    paddingHorizontal: 15,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },
  dropdownText: {
    fontSize: 16,
    color: "#0F172A",
  },
  placeholderText: {
    color: "#94A3B8",
  },
  arrow: {
    color: "#64748B",
    fontSize: 13,
  },
  dropdownOptions: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 11,
    marginTop: -14,
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  dropdownOption: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  selectedOption: {
    backgroundColor: "#DBEAFE",
  },
  optionText: {
    fontSize: 16,
    color: "#334155",
  },
  selectedOptionText: {
    color: "#1D4ED8",
    fontWeight: "800",
  },
  previewCard: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    padding: 16,
    borderRadius: 12,
    marginBottom: 22,
  },
  previewLabel: {
    color: "#166534",
    fontSize: 13,
    fontWeight: "700",
  },
  previewValue: {
    color: "#15803D",
    fontSize: 26,
    fontWeight: "800",
    marginTop: 7,
  },
  previewFormula: {
    color: "#166534",
    fontSize: 12,
    marginTop: 6,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  cancelButton: {
    flex: 1,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
  },
  cancelButtonText: {
    color: "#475569",
    fontSize: 15,
    fontWeight: "700",
  },
  saveButton: {
    flex: 1.5,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    backgroundColor: "#2563EB",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});
