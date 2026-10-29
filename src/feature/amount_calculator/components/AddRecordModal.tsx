import { useEffect, useRef, useState } from "react";
import {
    Keyboard,
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
} from "react-native";
import type { ScrollViewInstance } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { AmountFormValues } from "../types";
import { calculatePreview, formatAmount, KG_OPTIONS } from "../utils";

type Props = {
  visible: boolean;
  form: AmountFormValues;
  amount: string;
  percentage: string;
  selectedKg: number | null;
  packs: string;
  dropdownVisible: boolean;

  onChangeAmount: (value: string) => void;
  onChangePercentage: (value: string) => void;
  onChangePacks: (value: string) => void;
  onSelectKg: (kg: number) => void;
  onToggleDropdown: () => void;

  onSave: () => void;
  onClose: () => void;
};

export default function AddRecordModal({
  visible,
  form,
  amount,
  percentage,
  selectedKg,
  packs,
  dropdownVisible,
  onChangeAmount,
  onChangePercentage,
  onChangePacks,
  onSelectKg,
  onToggleDropdown,
  onSave,
  onClose,
}: Props) {
  const insets = useSafeAreaInsets();
  const preview = calculatePreview(form);

  const scrollRef = useRef<ScrollViewInstance>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Android edge-to-edge modals are not resized for the keyboard,
  // so reserve space under the content to let it scroll above the keyboard.
  useEffect(() => {
    if (Platform.OS !== "android") return;

    const showSub = Keyboard.addListener("keyboardDidShow", (e) =>
      setKeyboardHeight(e.endCoordinates.height),
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardHeight(0),
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const packsFocused = useRef(false);

  const scrollToBottom = () => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  // Scroll once the keyboard space has been added, if the packs input is focused.
  useEffect(() => {
    if (keyboardHeight > 0 && packsFocused.current) {
      scrollToBottom();
    }
  }, [keyboardHeight]);

  const handlePacksFocus = () => {
    packsFocused.current = true;
    // Keyboard may already be open (moving from another input).
    if (keyboardHeight > 0) scrollToBottom();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalKeyboard}
        >
          <ScrollView
            ref={scrollRef}
            style={styles.modalScroll}
            contentContainerStyle={[
              styles.modalScrollContent,
              { paddingBottom: keyboardHeight },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
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
                  onPress={onClose}
                  style={styles.closeButton}
                  accessibilityRole="button"
                  accessibilityLabel="Close form"
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.formContent}>
                <Text style={styles.label}>Actual Amount (₹)</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Enter actual amount"
                  placeholderTextColor="#94A3B8"
                  keyboardType="decimal-pad"
                  value={amount}
                  onChangeText={onChangeAmount}
                />

                <Text style={styles.label}>Percentage (%)</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Enter percentage, e.g. 10"
                  placeholderTextColor="#94A3B8"
                  keyboardType="decimal-pad"
                  value={percentage}
                  onChangeText={onChangePercentage}
                />

                <Text style={styles.label}>Select Weight (KG)</Text>

                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={onToggleDropdown}
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
                    {KG_OPTIONS.map((kg) => (
                      <TouchableOpacity
                        key={kg}
                        style={[
                          styles.dropdownOption,
                          selectedKg === kg && styles.selectedOption,
                        ]}
                        onPress={() => onSelectKg(kg)}
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
                  onChangeText={onChangePacks}
                  onFocus={handlePacksFocus}
                  onBlur={() => {
                    packsFocused.current = false;
                  }}
                />

                {preview !== null && (
                  <View style={styles.previewCard}>
                    <Text style={styles.previewLabel}>
                      Calculated Final Value
                    </Text>

                    <Text style={styles.previewValue}>
                      ₹{formatAmount(preview)}
                    </Text>

                    <Text style={styles.previewFormula}>
                      Total × {selectedKg} kg × {packs} packs ÷ 10
                    </Text>
                  </View>
                )}

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={onClose}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={onSave}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.saveButtonText}>Save Record</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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

  modalScroll: {
    flex: 1,
  },

  modalScrollContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingTop: 20,
  },

  modalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 22,
    paddingTop: 12,
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
