import { useAppSelector } from "@/store/hooks"; // Import your Redux hooks
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

// Import the API function from your existing file
import {
  getDropdownByEndpoint,
  getDropdownByEndpointAndId,
} from "@/features/fro/dropdownApi";
import { updateInteraction } from "@/features/fro/interactionApi";

/* ================= STATIC DATA ================= */
const CASE_STATUS_OPTIONS = [
  { id: 1, name: "Open" },
  { id: 2, name: "In Progress" },
  { id: 3, name: "Resolved" },
  { id: 4, name: "Closed" },
];

const SUB_STATUS_OPTIONS = [
  { id: 9, name: "Assign To Team" },
  { id: 1, name: "Follow Up" },
  { id: 2, name: "Escalated" },
  { id: 3, name: "Waiting" },
  { id: 4, name: "Completed" },
];

/* ================= TYPES ================= */
type Attachment = {
  uri: string;
  name: string;
  type: "image" | "file";
};

// Type for interaction item from your navigation params
type InteractionItem = {
  id: number;
  userId: string;
  assignToId: string;
  caseStatusId?: number;
  caseStatusName?: string;
  subStatusId?: number;
  subStatusName?: string;
  callTypeName?: string;
  transactionNumber?: string;
  categoryName?: string;
  subCategoryName?: string;
  subject?: string;
  name?: string;
  mobileNo?: string;
  emailId?: string;
  stateName?: string;
  districtName?: string;
  priority?: string;
  source?: string;
  agentRemarks?: string;
  comment?: string;
  teamName?: string;
  callBack?: string;
  callBackDateTime?: string;
  caseDescription?: string;
};

const UpdateStatusScreen = () => {
  // Get Redux auth state
  const authState = useAppSelector((state) => state.auth);
  const token = authState.token || "";
  const currentUserId = authState.userId || "";

  // Get params from navigation
  const params = useLocalSearchParams();
  const caseId = params.caseId ? Number(params.caseId) : null;
  const itemString = params.item as string;

  // Parse the interaction item ONCE
  const interactionItem = React.useMemo(() => {
    if (!itemString) return null;
    try {
      return JSON.parse(itemString) as InteractionItem;
    } catch (error) {
      console.error("Error parsing interaction item:", error);
      return null;
    }
  }, [itemString]);

  // State for form fields
  const [caseStatus, setCaseStatus] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [subStatus, setSubStatus] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [notes, setNotes] = useState("");
  const [subNotes, setSubNotes] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [dropdownType, setDropdownType] = useState<"CASE" | "SUB" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Refs for scrolling
  const scrollViewRef = useRef<ScrollView>(null);
  const notesInputRef = useRef<TextInput>(null);
  const subNotesInputRef = useRef<TextInput>(null);
  const initializedRef = useRef(false);

  /* ================= INITIALIZE FORM ================= */
  useEffect(() => {
    // Prevent multiple initializations
    if (initializedRef.current || !interactionItem) {
      setIsInitializing(false);
      return;
    }

    console.log("Initializing form with interaction item:", interactionItem.id);
    console.log(
      "Auth state - User ID:",
      currentUserId,
      "Token available:",
      !!token,
    );

    // Initialize case status
    if (interactionItem.caseStatusId && interactionItem.caseStatusName) {
      const caseStatusObj = {
        id: interactionItem.caseStatusId,
        name: interactionItem.caseStatusName,
      };
      setCaseStatus(caseStatusObj);
      console.log("Set case status:", caseStatusObj);
    }

    // Initialize sub status
    if (interactionItem.subStatusId && interactionItem.subStatusName) {
      const subStatusObj = {
        id: interactionItem.subStatusId,
        name: interactionItem.subStatusName,
      };
      setSubStatus(subStatusObj);
      console.log("Set sub status:", subStatusObj);
    }

    // Set existing notes
    if (interactionItem.agentRemarks) {
      setNotes(interactionItem.agentRemarks);
    }

    if (interactionItem.comment) {
      setSubNotes(interactionItem.comment);
    }

    initializedRef.current = true;
    setIsInitializing(false);
  }, [interactionItem, currentUserId, token]);

  /* ================= IMAGE PICKER ================= */
  const pickImage = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow access to your gallery");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setAttachments((prev) => [
        ...prev,
        {
          uri: result.assets[0].uri,
          name: result.assets[0].fileName || `image_${Date.now()}.jpg`,
          type: "image",
        },
      ]);
    }
  }, []);

  /* ================= FILE PICKER ================= */
  const pickFile = useCallback(async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
    });

    if (!result.canceled && result.assets[0]) {
      setAttachments((prev) => [
        ...prev,
        {
          uri: result.assets[0].uri,
          name: result.assets[0].name,
          type: "file",
        },
      ]);
    }
  }, []);

  /* ================= ATTACHMENT ACTION ================= */
  const addAttachment = useCallback(() => {
    Alert.alert("Add Attachment", "Choose option", [
      { text: "Gallery", onPress: pickImage },
      { text: "Files", onPress: pickFile },
      { text: "Cancel", style: "cancel" },
    ]);
  }, [pickImage, pickFile]);

  /* ================= REMOVE ATTACHMENT ================= */
  const removeAttachment = useCallback((index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }, []);

  /* ================= SUBMIT HANDLER ================= */
  const submitHandler = useCallback(async () => {
    // Validation
    if (!caseStatus) {
      Alert.alert("Error", "Please select a case status");
      return;
    }

    if (!notes.trim()) {
      Alert.alert("Error", "Please enter notes for case status");
      return;
    }

    if (!interactionItem) {
      Alert.alert("Error", "No interaction data found");
      return;
    }

    // Check if user is authenticated
    if (!token) {
      Alert.alert("Error", "You are not authenticated. Please login again.");
      return;
    }

    setIsLoading(true);

    try {
      // Use current user ID from Redux (the logged-in user)
      const updatingUserId = currentUserId;

      // Prepare data for API
      const updateData = {
        id: interactionItem.id,
        userId: updatingUserId, // Use current logged-in user ID
        assignToId: interactionItem.assignToId,
        caseStatusId: caseStatus.id,
        caseStatusName: caseStatus.name,
        subStatusId: subStatus?.id,
        subStatusName: subStatus?.name,
        agentRemarks: notes.trim(),
        comment: subNotes.trim(),
        // Include existing data
        callTypeName: interactionItem.callTypeName,
        transactionNumber: interactionItem.transactionNumber,
        categoryName: interactionItem.categoryName,
        subCategoryName: interactionItem.subCategoryName,
        subject: interactionItem.subject,
        name: interactionItem.name,
        mobileNo: interactionItem.mobileNo,
        emailId: interactionItem.emailId,
        stateName: interactionItem.stateName,
        districtName: interactionItem.districtName,
        priority: interactionItem.priority,
        source: interactionItem.source,
        teamName: interactionItem.teamName,
        callBack: interactionItem.callBack,
        callBackDateTime: interactionItem.callBackDateTime,
        caseDescription: interactionItem.caseDescription,
        updatedAt: new Date().toISOString(),
      };

      console.log("Submitting data:", {
        caseId: interactionItem.id,
        userId: updatingUserId,
        caseStatus: caseStatus.name,
        hasToken: !!token,
      });

      // Call the updateInteraction API
      const response = await updateInteraction({
        data: updateData,
        token, // Use token from Redux
        csrfToken: String(authState.antiforgeryToken), // Add if you have CSRF token in Redux
      });

      console.log("updt", response);

      if (response.success) {
        Alert.alert("Success", "Case updated successfully!", [
          {
            text: "OK",
            onPress: () => {
              router.back();
            },
          },
        ]);
      } else {
        Alert.alert(
          "Error",
          response.message || "Failed to update case. Please try again.",
        );
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      Alert.alert(
        "Error",
        error.message || "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    caseStatus,
    subStatus,
    notes,
    subNotes,
    interactionItem,
    token,
    currentUserId,
  ]);

  /* ================= HANDLE STATUS SELECTION ================= */
  const handleStatusSelect = useCallback(
    (item: { id: number; name: string }) => {
      console.log("Selected status:", item, "type:", dropdownType);

      if (dropdownType === "CASE") {
        setCaseStatus(item);
      } else if (dropdownType === "SUB") {
        setSubStatus(item);
      }
      setDropdownType(null);
    },
    [dropdownType],
  );

  /* ================= HANDLE BACK PRESS ================= */
  const handleBackPress = useCallback(() => {
    router.back();
  }, []);

  /* ================= DISMISS KEYBOARD ================= */
  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  /* ================= HANDLE TEXT INPUT FOCUS ================= */
  const handleNotesFocus = useCallback(() => {
    setTimeout(() => {
      notesInputRef.current?.measure((x, y, width, height, pageX, pageY) => {
        if (pageY) {
          scrollViewRef.current?.scrollTo({ y: pageY - 100, animated: true });
        }
      });
    }, 100);
  }, []);

  const handleSubNotesFocus = useCallback(() => {
    setTimeout(() => {
      subNotesInputRef.current?.measure((x, y, width, height, pageX, pageY) => {
        if (pageY) {
          scrollViewRef.current?.scrollTo({ y: pageY - 100, animated: true });
        }
      });
    }, 100);
  }, []);

  const fetchStatusDropdown = async () => {
    const res = await getDropdownByEndpoint(
      "GetStatusMasterDropdown",
      String(authState.token),
      String(authState.antiforgeryToken),
    );

    console.log("dropdownData", res.data);
  };

  const fetchSubStatusDropdown = async () => {
    const res = await getDropdownByEndpointAndId(
      "GetSubStatusMasterById",
      2,
      String(authState.token),
      String(authState.antiforgeryToken),
    );

    console.log("fetchSubStatus", res.data);
  };

  /* ================= SHOW AUTH INFO (for debugging) ================= */
  useEffect(() => {
    fetchStatusDropdown();
    fetchSubStatusDropdown();
    console.log(
      "Auth state updated - Token:",
      !!token,
      "User ID:",
      currentUserId,
    );
  }, [token, currentUserId]);

  if (isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00796B" />
        <Text style={styles.loadingText}>Loading case data...</Text>
      </View>
    );
  }

  if (!interactionItem) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#ff4444" />
        <Text style={styles.errorText}>No case data found</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.innerContainer}>
          {/* ================= HEADER ================= */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBackPress}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Update Case #{caseId}</Text>
              {interactionItem.subject && (
                <Text style={styles.headerSubtitle} numberOfLines={1}>
                  {interactionItem.subject}
                </Text>
              )}
            </View>
          </View>

          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.content}>
              {/* ================= CASE INFO ================= */}
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Case Information</Text>
                {interactionItem.transactionNumber && (
                  <Text style={styles.infoText}>
                    <Text style={styles.infoLabel}>Transaction:</Text>{" "}
                    {interactionItem.transactionNumber}
                  </Text>
                )}
                {interactionItem.name && (
                  <Text style={styles.infoText}>
                    <Text style={styles.infoLabel}>Customer:</Text>{" "}
                    {interactionItem.name}
                  </Text>
                )}
                {interactionItem.mobileNo && (
                  <Text style={styles.infoText}>
                    <Text style={styles.infoLabel}>Mobile:</Text>{" "}
                    {interactionItem.mobileNo}
                  </Text>
                )}
                {interactionItem.priority && (
                  <Text style={styles.infoText}>
                    <Text style={styles.infoLabel}>Priority:</Text>
                    <Text
                      style={[
                        styles.priorityText,
                        interactionItem.priority === "High"
                          ? styles.highPriority
                          : interactionItem.priority === "Medium"
                            ? styles.mediumPriority
                            : styles.lowPriority,
                      ]}
                    >
                      {interactionItem.priority}
                    </Text>
                  </Text>
                )}
                <Text style={styles.currentStatus}>
                  <Text style={styles.infoLabel}>Current Status:</Text>
                  <Text style={styles.statusValue}>
                    {" "}
                    {interactionItem.caseStatusName || "Not Set"}
                  </Text>
                </Text>
                {interactionItem.subStatusName && (
                  <Text style={styles.currentStatus}>
                    <Text style={styles.infoLabel}>Current Sub Status:</Text>
                    <Text style={styles.statusValue}>
                      {" "}
                      {interactionItem.subStatusName}
                    </Text>
                  </Text>
                )}
                {interactionItem.teamName && (
                  <Text style={styles.infoText}>
                    <Text style={styles.infoLabel}>Team:</Text>{" "}
                    {interactionItem.teamName}
                  </Text>
                )}
              </View>

              {/* ================= CASE STATUS ================= */}
              <Text style={styles.label}>Select Case Status *</Text>
              <TouchableOpacity
                style={[styles.dropdown, isLoading && styles.disabledDropdown]}
                onPress={() => setDropdownType("CASE")}
                disabled={isLoading}
              >
                <Text style={caseStatus ? styles.value : styles.placeholder}>
                  {caseStatus ? caseStatus.name : "Select Case Status"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#777" />
              </TouchableOpacity>

              <Text style={styles.label}>Reason / Notes *</Text>
              <TextInput
                ref={notesInputRef}
                style={[styles.textArea, isLoading && styles.disabledInput]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Enter reason for case status update..."
                multiline
                numberOfLines={4}
                editable={!isLoading}
                onFocus={handleNotesFocus}
              />

              {/* ================= SUB STATUS ================= */}
              <Text style={styles.label}>Select Sub Status (Optional)</Text>
              <TouchableOpacity
                style={[styles.dropdown, isLoading && styles.disabledDropdown]}
                onPress={() => setDropdownType("SUB")}
                disabled={isLoading}
              >
                <Text style={subStatus ? styles.value : styles.placeholder}>
                  {subStatus ? subStatus.name : "Select Sub Status (Optional)"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#777" />
              </TouchableOpacity>

              <Text style={styles.label}>Reason / Notes (Optional)</Text>
              <TextInput
                ref={subNotesInputRef}
                style={[styles.textArea, isLoading && styles.disabledInput]}
                value={subNotes}
                onChangeText={setSubNotes}
                placeholder="Enter reason for sub status..."
                multiline
                numberOfLines={4}
                editable={!isLoading}
                onFocus={handleSubNotesFocus}
              />

              {/* ================= ATTACHMENTS SECTION ================= */}
              <TouchableOpacity
                style={[styles.attachmentBtn, isLoading && styles.disabledBtn]}
                onPress={addAttachment}
                disabled={isLoading}
              >
                <Ionicons name="attach-outline" size={20} color="#00796B" />
                <Text style={styles.attachmentText}>
                  Add Attachment (Optional)
                </Text>
              </TouchableOpacity>

              {/* ================= ATTACHMENTS PREVIEW ================= */}
              {attachments.length > 0 && (
                <>
                  <Text style={styles.label}>
                    Attachments ({attachments.length})
                  </Text>
                  <FlatList
                    data={attachments}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(_, i) => i.toString()}
                    renderItem={({ item, index }) => (
                      <View style={styles.attachmentPreview}>
                        <TouchableOpacity
                          style={styles.removeAttachmentBtn}
                          onPress={() => removeAttachment(index)}
                          disabled={isLoading}
                        >
                          <Ionicons
                            name="close-circle"
                            size={20}
                            color="#ff4444"
                          />
                        </TouchableOpacity>
                        {item.type === "image" ? (
                          <Image
                            source={{ uri: item.uri }}
                            style={styles.image}
                          />
                        ) : (
                          <Ionicons
                            name="document-text-outline"
                            size={42}
                            color="#00796B"
                          />
                        )}
                        <Text style={styles.fileName} numberOfLines={1}>
                          {item.name}
                        </Text>
                      </View>
                    )}
                  />
                </>
              )}

              {/* ================= SUBMIT BUTTON ================= */}
              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  isLoading && styles.submitBtnDisabled,
                  !token && styles.submitBtnDisabled,
                ]}
                onPress={submitHandler}
                disabled={isLoading || !token}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : !token ? (
                  <Text style={styles.submitText}>Login Required</Text>
                ) : (
                  <Text style={styles.submitText}>Update Case</Text>
                )}
              </TouchableOpacity>

              {/* ================= SPACER FOR KEYBOARD ================= */}
              <View style={styles.keyboardSpacer} />
            </View>
          </ScrollView>

          {/* ================= BOTTOM SHEET DROPDOWN ================= */}
          <Modal
            transparent
            visible={!!dropdownType}
            animationType="slide"
            onRequestClose={() => setDropdownType(null)}
          >
            <TouchableOpacity
              style={styles.bottomSheetOverlay}
              activeOpacity={1}
              onPress={() => setDropdownType(null)}
            >
              <View style={styles.bottomSheet}>
                <Text style={styles.sheetTitle}>
                  {dropdownType === "CASE"
                    ? "Select Case Status"
                    : "Select Sub Status"}
                </Text>

                <ScrollView style={styles.sheetScrollView}>
                  {(dropdownType === "CASE"
                    ? CASE_STATUS_OPTIONS
                    : SUB_STATUS_OPTIONS
                  ).map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.sheetItem}
                      onPress={() => handleStatusSelect(item)}
                    >
                      <Text style={styles.sheetItemText}>{item.name}</Text>
                      {(dropdownType === "CASE" &&
                        caseStatus?.id === item.id) ||
                      (dropdownType === "SUB" && subStatus?.id === item.id) ? (
                        <Ionicons name="checkmark" size={20} color="#00796B" />
                      ) : null}
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  style={[styles.sheetItem, styles.cancelItem]}
                  onPress={() => setDropdownType(null)}
                >
                  <Text style={styles.cancelItemText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default UpdateStatusScreen;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  innerContainer: { flex: 1 },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },

  errorText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },

  backButton: {
    marginTop: 24,
    backgroundColor: "#00796B",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },

  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  header: {
    backgroundColor: "#00796B",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  headerContent: {
    marginLeft: 12,
    flex: 1,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  headerSubtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    marginTop: 2,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },

  content: {
    padding: 16,
    paddingBottom: 30,
  },

  infoSection: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 8,
  },

  infoText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
    flexDirection: "row",
    flexWrap: "wrap",
  },

  infoLabel: {
    fontWeight: "600",
    color: "#333",
    marginRight: 4,
  },

  priorityText: {
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
  },

  highPriority: {
    backgroundColor: "#ffebee",
    color: "#c62828",
  },

  mediumPriority: {
    backgroundColor: "#fff3e0",
    color: "#ef6c00",
  },

  lowPriority: {
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
  },

  currentStatus: {
    fontSize: 14,
    color: "#555",
    marginTop: 8,
    marginBottom: 6,
    flexDirection: "row",
    flexWrap: "wrap",
  },

  statusValue: {
    fontWeight: "600",
    color: "#00796B",
  },

  label: {
    fontSize: 14,
    color: "#444",
    marginTop: 12,
    marginBottom: 6,
    fontWeight: "500",
  },

  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "#fff",
  },

  disabledDropdown: {
    opacity: 0.6,
  },

  disabledInput: {
    opacity: 0.8,
    backgroundColor: "#f8f8f8",
  },

  placeholder: { color: "#999", fontSize: 16 },
  value: { color: "#000", fontSize: 16, fontWeight: "500" },

  attachmentBtn: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#00796B",
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
  },

  disabledBtn: {
    opacity: 0.5,
  },

  attachmentText: { color: "#00796B", fontWeight: "500", fontSize: 16 },

  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    height: 100,
    textAlignVertical: "top",
    fontSize: 16,
    marginBottom: 8,
    backgroundColor: "#fff",
  },

  submitBtn: {
    backgroundColor: "#00796B",
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 54,
  },

  submitBtnDisabled: {
    backgroundColor: "#cccccc",
  },

  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  attachmentPreview: {
    width: 100,
    height: 100,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 4,
    position: "relative",
    backgroundColor: "#fff",
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
  },

  fileName: {
    marginTop: 4,
    fontSize: 11,
    color: "#666",
    textAlign: "center",
    maxWidth: 90,
  },

  removeAttachmentBtn: {
    position: "absolute",
    top: -8,
    right: -8,
    zIndex: 1,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 2,
  },

  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },

  bottomSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },

  sheetTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  sheetScrollView: {
    maxHeight: 300,
  },

  sheetItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sheetItemText: {
    fontSize: 16,
    color: "#333",
  },

  cancelItem: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    marginTop: 10,
    justifyContent: "center",
  },

  cancelItemText: {
    fontSize: 16,
    color: "#ff4444",
    textAlign: "center",
    fontWeight: "600",
  },

  keyboardSpacer: {
    height: 100,
  },
});
