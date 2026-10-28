import { StyleSheet, Text, View } from "react-native";

import type { AmountRecord } from "../types";
import { formatAmount } from "../utils";

type Props = {
  records: AmountRecord[];
  isSmallScreen: boolean;
};

export default function AmountSummary({ records, isSmallScreen }: Props) {
  const latestRecord = records[records.length - 1];

  return (
    <View
      style={[styles.summaryCard, isSmallScreen && styles.summaryCardSmall]}
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
          {latestRecord ? `₹${formatAmount(latestRecord.finalValue)}` : "₹0.00"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
