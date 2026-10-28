import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import AddRecordModal from "../feature/amount_calculator/components/AddRecordModal";
import AmountHistoryTable from "../feature/amount_calculator/components/AmountHistoryTable";
import AmountSummary from "../feature/amount_calculator/components/amountSummary";
import useAmountCalculator from "../feature/amount_calculator/hooks/useAmountCalculator";

export default function Index() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 380;

  const calculator = useAmountCalculator();

  const handleSave = () => {
    const error = calculator.addRecord();

    if (error) {
      Alert.alert("Invalid Input", error);
    }
  };

  const handleSelectKg = (kg: number) => {
    calculator.setSelectedKg(kg);
    calculator.setDropdownVisible(false);
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
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

          <AmountSummary
            records={calculator.records}
            isSmallScreen={isSmallScreen}
          />

          <AmountHistoryTable records={calculator.records} />
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
            onPress={calculator.openModal}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Add new amount record"
          >
            <Text style={styles.fabIcon}>＋</Text>
            <Text style={styles.fabText}>Add Record</Text>
          </TouchableOpacity>
        </View>
      </View>

      <AddRecordModal
        visible={calculator.modalVisible}
        form={{
          amount: calculator.amount,
          percentage: calculator.percentage,
          selectedKg: calculator.selectedKg,
          packs: calculator.packs,
        }}
        amount={calculator.amount}
        percentage={calculator.percentage}
        selectedKg={calculator.selectedKg}
        packs={calculator.packs}
        dropdownVisible={calculator.dropdownVisible}
        onChangeAmount={calculator.setAmount}
        onChangePercentage={calculator.setPercentage}
        onChangePacks={calculator.setPacks}
        onSelectKg={handleSelectKg}
        onToggleDropdown={() =>
          calculator.setDropdownVisible((previous) => !previous)
        }
        onSave={handleSave}
        onClose={calculator.closeModal}
      />
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
});
