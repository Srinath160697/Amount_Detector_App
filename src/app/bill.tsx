import { Stack, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { downloadBillPdf } from "../feature/amount_calculator/billPdf";
import type { AmountRecord } from "../feature/amount_calculator/types";
import { formatAmount } from "../feature/amount_calculator/utils";

// Edit these to match your business details.
const COMPANY = {
  initials: "AC",
  name: "YOUR COMPANY NAME",
  tagline: "Amount Calculation & Trading",
  address: "Your address, City, State - PIN code",
  phone: "+91 XXXXX XXXXX",
};

function parseRecord(
  param: string | string[] | undefined,
): AmountRecord | null {
  const json = Array.isArray(param) ? param[0] : param;

  if (!json) {
    return null;
  }

  try {
    return JSON.parse(json) as AmountRecord;
  } catch {
    return null;
  }
}

export default function BillScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ record: string }>();
  const record = parseRecord(params.record);
  const [downloading, setDownloading] = useState(false);

  if (!record) {
    return (
      <View style={styles.errorContainer}>
        <Stack.Screen options={{ title: "Bill" }} />

        <Text style={styles.errorTitle}>Bill unavailable</Text>
        <Text style={styles.errorText}>
          The selected record could not be loaded.
        </Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const billDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const billNumber = `BILL-${record.id.split("-")[0].slice(-6)}`;

  const rows: { label: string; value: string }[] = [
    { label: "Actual Amount", value: `₹ ${formatAmount(record.amount)}` },
    {
      label: `Percentage (${record.percentage}%)`,
      value: `₹ ${formatAmount(record.percentageAmount)}`,
    },
    { label: "Total Amount", value: `₹ ${formatAmount(record.total)}` },
    { label: "Weight", value: `${record.kg} kg` },
    { label: "Number of Packs", value: `${record.packs}` },
  ];

  const handleDownload = async () => {
    setDownloading(true);

    try {
      const fileName = await downloadBillPdf({
        record,
        company: COMPANY,
        billNumber,
        billDate,
      });

      Alert.alert("Bill downloaded", `${fileName} was saved to your phone.`);
    } catch {
      Alert.alert(
        "Bill not saved",
        "No folder was chosen or the file could not be saved. Please try again.",
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: "Bill Details" }} />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 16) + 16 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.bill}>
          {/* Company header */}
          <View style={styles.companyHeader}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>{COMPANY.initials}</Text>
            </View>

            <View style={styles.companyDetails}>
              <Text style={styles.companyName}>{COMPANY.name}</Text>
              <Text style={styles.companyTagline}>{COMPANY.tagline}</Text>
              <Text style={styles.companyInfo}>{COMPANY.address}</Text>
              <Text style={styles.companyInfo}>Phone: {COMPANY.phone}</Text>
            </View>
          </View>

          <View style={styles.headerDivider} />

          {/* Invoice title + meta */}
          <View style={styles.invoiceHeading}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>

            <View style={styles.metaColumn}>
              <Text style={styles.metaLabel}>Bill No.</Text>
              <Text style={styles.metaValue}>{billNumber}</Text>

              <Text style={[styles.metaLabel, styles.metaSpacing]}>Date</Text>
              <Text style={styles.metaValue}>{billDate}</Text>
            </View>
          </View>

          {/* Amount details */}
          <Text style={styles.sectionHeading}>AMOUNT DETAILS</Text>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableHeaderText, styles.descriptionColumn]}>
                Description
              </Text>
              <Text style={[styles.tableHeaderText, styles.valueColumn]}>
                Value
              </Text>
            </View>

            {rows.map((row, index) => (
              <View
                key={row.label}
                style={[
                  styles.tableRow,
                  index % 2 === 1 && styles.alternateRow,
                ]}
              >
                <Text style={[styles.cellText, styles.descriptionColumn]}>
                  {row.label}
                </Text>
                <Text style={[styles.cellValue, styles.valueColumn]}>
                  {row.value}
                </Text>
              </View>
            ))}

            <View style={[styles.tableRow, styles.lastRow]}>
              <Text style={[styles.totalText, styles.descriptionColumn]}>
                Total Bill Amount
              </Text>
              <Text style={[styles.totalText, styles.valueColumn]}>
                ₹ {formatAmount(record.finalValue)}
              </Text>
            </View>
          </View>

          {/* Signatures */}
          <View style={styles.signatureSection}>
            <View style={styles.signatureBlock}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Customer Signature</Text>
            </View>

            <View style={styles.signatureBlock}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Authorized Signature</Text>
              <Text style={styles.signatureCompany}>For {COMPANY.name}</Text>
            </View>
          </View>

          <View style={styles.footerDivider} />

          <Text style={styles.footerTitle}>Thank you for your business!</Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.printButton]}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Print bill"
          >
            <Text style={styles.printButtonText}>Print Bill</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.downloadButton]}
            onPress={handleDownload}
            disabled={downloading}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Download bill as PDF"
          >
            {downloading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.downloadButtonText}>Download PDF</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.85}
        >
          <Text style={styles.backButtonText}>Back to Amount History</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F3F6FB",
  },

  scrollContent: {
    padding: 16,
  },

  bill: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 2,
  },

  companyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  logo: {
    width: 58,
    height: 58,
    borderRadius: 12,
    backgroundColor: "#173A70",
    alignItems: "center",
    justifyContent: "center",
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },

  companyDetails: {
    flex: 1,
  },

  companyName: {
    color: "#173A70",
    fontSize: 17,
    fontWeight: "900",
  },

  companyTagline: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 3,
  },

  companyInfo: {
    color: "#64748B",
    fontSize: 11,
    marginTop: 3,
  },

  headerDivider: {
    height: 2,
    backgroundColor: "#173A70",
    marginVertical: 18,
  },

  invoiceHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 22,
  },

  invoiceTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#172554",
    letterSpacing: 1,
  },

  metaColumn: {
    alignItems: "flex-end",
  },

  metaLabel: {
    fontSize: 11,
    color: "#64748B",
  },

  metaValue: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1E293B",
    marginTop: 2,
  },

  metaSpacing: {
    marginTop: 8,
  },

  sectionHeading: {
    color: "#173A70",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.7,
    marginBottom: 10,
  },

  table: {
    borderWidth: 1,
    borderColor: "#DCE5F0",
    borderRadius: 8,
    overflow: "hidden",
  },

  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    gap: 8,
  },

  tableHeader: {
    backgroundColor: "#173A70",
  },

  alternateRow: {
    backgroundColor: "#F8FAFC",
  },

  lastRow: {
    borderBottomWidth: 0,
  },

  tableHeaderText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },

  descriptionColumn: {
    flex: 1,
  },

  valueColumn: {
    textAlign: "right",
  },

  cellText: {
    color: "#334155",
    fontSize: 13,
  },

  cellValue: {
    color: "#1E293B",
    fontSize: 13,
    fontWeight: "700",
  },

  totalText: {
    color: "#15803D",
    fontSize: 15,
    fontWeight: "900",
  },

  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    marginTop: 48,
    marginBottom: 22,
  },

  signatureBlock: {
    flex: 1,
    alignItems: "center",
  },

  signatureLine: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#64748B",
    marginBottom: 8,
  },

  signatureLabel: {
    fontSize: 11,
    color: "#475569",
    textAlign: "center",
  },

  signatureCompany: {
    fontSize: 10,
    fontWeight: "700",
    color: "#334155",
    textAlign: "center",
    marginTop: 4,
  },

  footerDivider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginBottom: 14,
  },

  footerTitle: {
    color: "#173A70",
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },

  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
  },

  actionButton: {
    flex: 1,
    height: 52,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  printButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#173A70",
  },

  printButtonText: {
    color: "#173A70",
    fontSize: 15,
    fontWeight: "800",
  },

  downloadButton: {
    backgroundColor: "#15803D",
  },

  downloadButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  backButton: {
    backgroundColor: "#173A70",
    borderRadius: 11,
    paddingVertical: 15,
    paddingHorizontal: 18,
    alignItems: "center",
    marginTop: 18,
  },

  backButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F3F6FB",
  },

  errorTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#172554",
  },

  errorText: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 8,
    textAlign: "center",
  },
});
