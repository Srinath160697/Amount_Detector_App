import { ScrollView, StyleSheet, Text, View } from "react-native";

import type { AmountRecord } from "../types";
import { formatAmount } from "../utils";

type Props = {
  records: AmountRecord[];
};

export default function AmountHistoryTable({ records }: Props) {
  return (
    <>
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
              <Text style={[styles.headerCell, styles.slColumn]}>Sl.No</Text>

              <Text style={[styles.headerCell, styles.amountColumn]}>
                Amount (₹)
              </Text>

              <Text style={[styles.headerCell, styles.percentColumn]}>
                Percentage
              </Text>

              <Text style={[styles.headerCell, styles.kgColumn]}>KG</Text>

              <Text style={[styles.headerCell, styles.packsColumn]}>Packs</Text>

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
    </>
  );
}

const styles = StyleSheet.create({
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
});
