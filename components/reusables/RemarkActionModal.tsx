import { useTheme } from "@/theme/ThemeContext";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RemixIcon from "react-native-remix-icon";

interface Ticket {
  id: number;
  transactionNumber: string;
  name: string;
  caseStatusId: number;
  subStatusId: number;
}

interface RemarkActionModalProps {
  visible: boolean;
  title: string;
  buttonText: string;
  onClose: () => void;
  onSubmit: (remark: string, selectedTicketId?: number) => void;
  tickets?: Ticket[]; // Optional tickets to show in dropdown
  requireTicketSelection?: boolean; // Whether ticket selection is required
  isLoading?: boolean; // Loading state for fetching tickets
}

export default function RemarkActionModal({
  visible,
  title,
  buttonText,
  onClose,
  onSubmit,
  tickets = [],
  requireTicketSelection = false,
  isLoading = false,
}: RemarkActionModalProps) {
  const { theme } = useTheme();
  const [remark, setRemark] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      setRemark("");
      setSelectedTicketId(null);
      setShowDropdown(false);
      setValidationError("");
    }
  }, [visible]);

  const handleSubmit = () => {
    // Validate
    if (requireTicketSelection && !selectedTicketId) {
      setValidationError("Please select a ticket");
      return;
    }

    if (!remark.trim()) {
      setValidationError("Please enter a remark");
      return;
    }

    setValidationError("");
    onSubmit(remark, selectedTicketId || undefined);
  };

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View
          style={[styles.card, { backgroundColor: theme.colors.colorBgPage }]}
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <Text
              style={[
                theme.typography.fontH3,
                { color: theme.colors.colorTextPrimary },
              ]}
            >
              {title}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <RemixIcon
                name="close-line"
                size={24}
                color={theme.colors.colorTextSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Ticket Dropdown - Only show if there are tickets */}
          {tickets.length > 0 && (
            <View style={styles.dropdownContainer}>
              <Text
                style={[
                  styles.label,
                  { color: theme.colors.colorTextSecondary },
                ]}
              >
                Select Ticket to Reassign
                {requireTicketSelection && (
                  <Text style={{ color: theme.colors.colorError400 }}> *</Text>
                )}
              </Text>

              {isLoading ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.colorPrimary600}
                  />
                </View>
              ) : (
                <>
                  <TouchableOpacity
                    style={[
                      styles.dropdownButton,
                      {
                        borderColor:
                          validationError && !selectedTicketId
                            ? theme.colors.colorError400
                            : theme.colors.inputBorder,
                        backgroundColor: theme.colors.inputBg,
                      },
                    ]}
                    onPress={() => setShowDropdown(!showDropdown)}
                  >
                    <Text
                      style={[
                        styles.dropdownButtonText,
                        {
                          color: selectedTicket
                            ? theme.colors.colorTextPrimary
                            : theme.colors.colorTextSecondary,
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {selectedTicket
                        ? `${selectedTicket.transactionNumber} - ${selectedTicket.name}`
                        : "Select a ticket"}
                    </Text>
                    <RemixIcon
                      name={
                        showDropdown ? "arrow-up-s-line" : "arrow-down-s-line"
                      }
                      size={20}
                      color={theme.colors.colorTextSecondary}
                    />
                  </TouchableOpacity>

                  {/* Dropdown List */}
                  {showDropdown && (
                    <View
                      style={[
                        styles.dropdownList,
                        {
                          backgroundColor: theme.colors.colorBgPage,
                          borderColor: theme.colors.inputBorder,
                        },
                      ]}
                    >
                      <ScrollView
                        nestedScrollEnabled={true}
                        style={styles.dropdownScroll}
                      >
                        {tickets.map((ticket) => (
                          <TouchableOpacity
                            key={ticket.id}
                            style={styles.dropdownItem}
                            onPress={() => {
                              setSelectedTicketId(ticket.id);
                              setShowDropdown(false);
                              setValidationError("");
                            }}
                          >
                            <Text
                              style={[
                                styles.dropdownItemText,
                                { color: theme.colors.colorTextPrimary },
                              ]}
                            >
                              {ticket.transactionNumber}
                            </Text>
                            <Text
                              style={[
                                styles.dropdownItemSubtext,
                                { color: theme.colors.colorTextSecondary },
                              ]}
                              numberOfLines={1}
                            >
                              {ticket.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </>
              )}
            </View>
          )}

          {/* Remark Input */}
          <View style={styles.inputContainer}>
            <Text
              style={[styles.label, { color: theme.colors.colorTextSecondary }]}
            >
              Remark/Reason
              <Text style={{ color: theme.colors.colorError400 }}> *</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor:
                    validationError && !remark.trim()
                      ? theme.colors.colorError400
                      : theme.colors.inputBorder,
                  backgroundColor: theme.colors.inputBg,
                  color: theme.colors.colorTextPrimary,
                },
              ]}
              placeholder="Enter your remark here..."
              placeholderTextColor={theme.colors.colorTextSecondary}
              value={remark}
              onChangeText={(text) => {
                setRemark(text);
                setValidationError("");
              }}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Validation Error */}
          {validationError ? (
            <Text
              style={[styles.errorText, { color: theme.colors.colorError400 }]}
            >
              {validationError}
            </Text>
          ) : null}

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[
                styles.cancelButton,
                { borderColor: theme.colors.colorError400 },
              ]}
              onPress={onClose}
            >
              <Text style={{ color: theme.colors.colorError400 }}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.submitButton,
                {
                  backgroundColor: theme.colors.colorPrimary600,
                  opacity:
                    (requireTicketSelection && !selectedTicketId) ||
                    !remark.trim() ||
                    isLoading
                      ? 0.5
                      : 1,
                },
              ]}
              onPress={handleSubmit}
              disabled={
                (requireTicketSelection && !selectedTicketId) ||
                !remark.trim() ||
                isLoading
              }
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={{ color: "#fff" }}>{buttonText}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    borderRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  dropdownContainer: {
    marginBottom: 16,
    zIndex: 1000,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "500",
  },
  loaderContainer: {
    padding: 20,
    alignItems: "center",
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dropdownButtonText: {
    fontSize: 14,
    flex: 1,
  },
  dropdownList: {
    position: "absolute",
    top: 70,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 200,
    zIndex: 2000,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdownItemText: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  dropdownItemSubtext: {
    fontSize: 12,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: "top",
  },
  errorText: {
    fontSize: 12,
    marginBottom: 12,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
});
