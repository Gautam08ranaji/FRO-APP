import {
  getDropdownByEndpoint,
  getDropdownByEndpointAndId,
} from "@/features/fro/dropdownApi";
import { updateInteraction } from "@/features/fro/interactionApi";
import { useAppSelector } from "@/store/hooks";
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

type DropdownItem = {
  id: number;
  name: string;
};

/* ================= TYPES ================= */
type Attachment = {
  uri: string;
  name: string;
  type: "image" | "file";
};

type InteractionItem = {
  id: number;
  assignToId?: string;
  caseStatusId?: number;
  caseStatusName?: string;
  subStatusId?: number;
  subStatusName?: string;
  transactionNumber?: string;
  categoryName?: string;
  subCategoryName?: string;
  subject?: string;
  name?: string;
  mobileNo?: string;
  priority?: string;
  teamName?: string;
  agentRemarks?: string;
  comment?: string;
  caseDescription?: string;
};

const UpdateStatusScreen = () => {
  const authState = useAppSelector((state) => state.auth);

  const params = useLocalSearchParams();
  const [statusDropdown, setStatusDropdown] = useState<DropdownItem[]>([]);
  const [subStatusDropdown, setSubStatusDropdown] = useState<DropdownItem[]>(
    [],
  );

  const caseId = params.caseId ? Number(params.caseId) : null;
  const itemString = params.item as string;

  console.log("case", caseId);

  useEffect(() => {
    fetchStatusDropdown();
  }, []);

  const fetchStatusDropdown = async () => {
    try {
      const res = await getDropdownByEndpoint(
        "GetStatusMasterDropdown",
        String(authState.token),
        String(authState.antiforgeryToken),
      );

      const mapped = (res?.data ?? []).map((item: any) => ({
        id: item.value,
        name: item.label,
      }));

      setStatusDropdown(mapped);
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 401) {
        Alert.alert("Session Expired", "Please login again.");
        router.replace("/login");
        return;
      }
      Alert.alert("Error", "Failed to load status");
    }
  };

  const fetchSubStatusDropdown = async (statusId: number) => {
    try {
      const res = await getDropdownByEndpointAndId(
        "GetSubStatusMasterById",
        statusId,
        String(authState.token),
        String(authState.antiforgeryToken),
      );

      const mapped = (res?.data ?? []).map((item: any) => ({
        id: item.value,
        name: item.label,
      }));

      setSubStatusDropdown(mapped);
    } catch (e) {
      Alert.alert("Error", "Failed to load sub status");
    }
  };

  const handleUpdate = async () => {
    if (!caseStatus) {
      Alert.alert("Validation Error", "Please select a case status");
      return;
    }

    try {
      setIsLoading(true);

      const res = await updateInteraction({
        token: String(authState.token),
        csrfToken: String(authState.antiforgeryToken),
        data: {
          id: Number(caseId),
          caseStatusId: caseStatus.id,
          caseStatusName: caseStatus.name,
          subStatusId: subStatus?.id ?? 0,
          subStatusName: subStatus?.name ?? "",
          comment: notes.trim(),
          callBack: "",
          assignToId: String(authState.userId),
        },
      });

      if (res?.success) {
        Alert.alert("Case Updated", "Case Updated Successfully", [
          {
            text: "OK",
            onPress: () => router.replace("/(fro)/(complaints)"),
          },
        ]);
        return;
      }

      console.log("update", res);
    } catch (error: any) {
      console.error("❌ Update failed:", error);

      const status = error?.response?.status;
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Something went wrong. Please try again.";

      // 🔐 Session expired
      if (status === 401) {
        Alert.alert("Session Expired", "Please login again.", [
          {
            text: "OK",
            onPress: () => router.replace("/login"),
          },
        ]);
        return;
      }

      // ❌ Validation / Bad request
      if (status === 400) {
        Alert.alert("Update Failed", message);
        return;
      }

      // 🌐 Network / timeout
      if (!error?.response) {
        Alert.alert(
          "Network Error",
          "Please check your internet connection and try again.",
        );
        return;
      }

      // ❓ Fallback
      Alert.alert("Error", message);
    } finally {
      setIsLoading(false);
    }
  };

  const interactionItem = React.useMemo<InteractionItem | null>(() => {
    if (!itemString) return null;
    try {
      return JSON.parse(itemString);
    } catch {
      return null;
    }
  }, [itemString]);

  const [caseStatus, setCaseStatus] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [subStatus, setSubStatus] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [notes, setNotes] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [dropdownType, setDropdownType] = useState<"CASE" | "SUB" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const scrollViewRef = useRef<ScrollView>(null);
  const notesInputRef = useRef<TextInput>(null);
  const initializedRef = useRef(false);

  /* ================= INITIALIZE ================= */

  console.log("int", interactionItem);

  useEffect(() => {
    if (!interactionItem || initializedRef.current) {
      setIsInitializing(false);
      return;
    }

    if (interactionItem.caseStatusId && interactionItem.caseStatusName) {
      setCaseStatus({
        id: interactionItem.caseStatusId,
        name: interactionItem.caseStatusName,
      });
    }

    if (interactionItem.subStatusId && interactionItem.subStatusName) {
      setSubStatus({
        id: interactionItem.subStatusId,
        name: interactionItem.subStatusName,
      });
    }

    if (interactionItem.comment) setNotes(interactionItem.comment);

    initializedRef.current = true;
    setIsInitializing(false);
  }, [interactionItem]);

  /* ================= IMAGE PICKER ================= */
  const pickImage = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow gallery access");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setAttachments((p) => [
        ...p,
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
    const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    if (!result.canceled && result.assets[0]) {
      setAttachments((p) => [
        ...p,
        {
          uri: result.assets[0].uri,
          name: result.assets[0].name,
          type: "file",
        },
      ]);
    }
  }, []);

  const addAttachment = useCallback(() => {
    Alert.alert("Add Attachment", "Choose option", [
      { text: "Gallery", onPress: pickImage },
      { text: "Files", onPress: pickFile },
      { text: "Cancel", style: "cancel" },
    ]);
  }, [pickImage, pickFile]);

  const removeAttachment = (index: number) => {
    setAttachments((p) => p.filter((_, i) => i !== index));
  };

  /* ================= SUBMIT (STATIC) ================= */
  const submitHandler = useCallback(() => {
    if (!caseStatus) {
      Alert.alert("Error", "Please select a case status");
      return;
    }

    if (!notes.trim()) {
      Alert.alert("Error", "Please enter notes");
      return;
    }

    setIsLoading(true);

    handleUpdate();
  }, [caseStatus, subStatus, notes, attachments]);

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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Update Case #{caseId}</Text>
              {!!interactionItem.subject && (
                <Text style={styles.headerSubtitle} numberOfLines={1}>
                  {interactionItem.subject}
                </Text>
              )}
            </View>
          </View>

          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            {/* STATUS */}
            <Text style={styles.label}>Select Case Status *</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setDropdownType("CASE")}
            >
              <Text style={caseStatus ? styles.value : styles.placeholder}>
                {caseStatus?.name || "Select Case Status"}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#777" />
            </TouchableOpacity>

            <Text style={styles.label}>Select Sub Status (Optional)</Text>
            <TouchableOpacity
              style={styles.dropdown}
              disabled={!caseStatus}
              onPress={() => setDropdownType("SUB")}
            >
              <Text style={subStatus ? styles.value : styles.placeholder}>
                {subStatus?.name || "Select Sub Status"}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#777" />
            </TouchableOpacity>

            <Text style={styles.label}>Comment *</Text>
            <TextInput
              ref={notesInputRef}
              style={styles.textArea}
              value={notes}
              onChangeText={setNotes}
              multiline
            />

            <TouchableOpacity
              style={styles.attachmentBtn}
              onPress={addAttachment}
            >
              <Ionicons name="attach-outline" size={20} color="#00796B" />
              <Text style={styles.attachmentText}>Add Attachment</Text>
            </TouchableOpacity>

            {attachments.length > 0 && (
              <FlatList
                data={attachments}
                horizontal
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item, index }) => (
                  <View style={styles.attachmentPreview}>
                    <TouchableOpacity
                      style={styles.removeAttachmentBtn}
                      onPress={() => removeAttachment(index)}
                    >
                      <Ionicons name="close-circle" size={20} color="#ff4444" />
                    </TouchableOpacity>
                    {item.type === "image" ? (
                      <Image source={{ uri: item.uri }} style={styles.image} />
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
            )}

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={submitHandler}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>Update</Text>
              )}
            </TouchableOpacity>
          </ScrollView>

          {/* BOTTOM SHEET */}
          <Modal transparent visible={!!dropdownType} animationType="slide">
            <TouchableOpacity
              style={styles.bottomSheetOverlay}
              onPress={() => setDropdownType(null)}
              activeOpacity={1}
            >
              <View style={styles.bottomSheet}>
                {(dropdownType === "CASE"
                  ? statusDropdown
                  : subStatusDropdown
                ).map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.sheetItem}
                    onPress={() => {
                      if (dropdownType === "CASE") {
                        setCaseStatus(item);
                        setSubStatus(null); // reset sub-status
                        fetchSubStatusDropdown(item.id); // 🔥 fetch based on selected status
                      } else {
                        setSubStatus(item);
                      }
                      setDropdownType(null);
                    }}
                  >
                    <Text style={styles.sheetItemText}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
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
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: "#666" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { marginTop: 10, fontSize: 18 },
  backButton: {
    marginTop: 20,
    backgroundColor: "#00796B",
    padding: 12,
    borderRadius: 8,
  },
  backButtonText: { color: "#fff" },
  header: {
    backgroundColor: "#00796B",
    paddingTop: 50,
    padding: 16,
    flexDirection: "row",
  },
  headerContent: { marginLeft: 12 },
  headerTitle: { color: "#fff", fontSize: 18 },
  headerSubtitle: { color: "rgba(255,255,255,0.8)" },
  content: { padding: 16 },
  label: { marginTop: 12, marginBottom: 6, color: "#444" },
  dropdown: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 14,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  placeholder: { color: "#999" },
  value: { color: "#000", fontWeight: "500" },
  textArea: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    height: 100,
    padding: 12,
  },
  attachmentBtn: {
    marginTop: 50,
    borderWidth: 1,
    borderColor: "#00796B",
    borderRadius: 10,
    padding: 14,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  attachmentText: { color: "#00796B", fontWeight: "500" },
  submitBtn: {
    marginTop: 24,
    backgroundColor: "#00796B",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "600" },
  attachmentPreview: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  image: { width: "100%", height: "100%", borderRadius: 6 },
  fileName: { fontSize: 11, marginTop: 4 },
  removeAttachmentBtn: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  bottomSheetOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 110,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  bottomSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sheetItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sheetItemText: { fontSize: 16 },
});
