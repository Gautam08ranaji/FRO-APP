import {
  getDropdownByEndpoint,
  getDropdownByEndpointAndId,
} from "@/features/fro/dropdownApi";
import { addAndUpdateFROLocation } from "@/features/fro/froLocationApi";
import { updateInteraction } from "@/features/fro/interactionApi";
import { useLocation } from "@/hooks/LocationContext";
import { useAppSelector } from "@/store/hooks";
import { useTheme } from "@/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
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

/* ================= RESPONSIVE SCALING ================= */
const { width, height } = Dimensions.get("window");
const scale = (size: number) => (width / 375) * size;
const verticalScale = (size: number) => (height / 812) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const UpdateStatusScreen = () => {
  const authState = useAppSelector((state) => state.auth);
  const { theme } = useTheme();

  const params = useLocalSearchParams();
  const [statusDropdown, setStatusDropdown] = useState<DropdownItem[]>([]);
  const [subStatusDropdown, setSubStatusDropdown] = useState<DropdownItem[]>(
    [],
  );

  const caseId = params.caseId ? Number(params.caseId) : null;
  const itemString = params.item as string;

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
        sendLocation(caseId);
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

      if (status === 401) {
        Alert.alert("Session Expired", "Please login again.", [
          {
            text: "OK",
            onPress: () => router.replace("/login"),
          },
        ]);
        return;
      }

      if (status === 400) {
        Alert.alert("Update Failed", message);
        return;
      }

      if (!error?.response) {
        Alert.alert(
          "Network Error",
          "Please check your internet connection and try again.",
        );
        return;
      }

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
  const [showSubStatusWarning, setShowSubStatusWarning] = useState(false);
  const { hasPermission, fetchLocation, address } = useLocation();

  const scrollViewRef = useRef<ScrollView>(null);
  const notesInputRef = useRef<TextInput>(null);
  const initializedRef = useRef(false);

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
      fetchSubStatusDropdown(interactionItem.caseStatusId);
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

  const sendLocation = async (id: any) => {
    try {
      const location = await fetchLocation();
      if (!location) return;

      const { latitude, longitude } = location.coords;
      const payload = {
        name: address ?? "Unknown location",
        latitute: latitude.toString(),
        longititute: longitude.toString(),
        discriptions: address ?? "",
        elderPinLocation: "string",
        froPinLocation: String(address),
        userId: String(authState.userId),
      };

      const res = await addAndUpdateFROLocation(payload);
      // console.log("✅ Update Ticket:", res);
    } catch (error) {
      console.error("❌ Location update error:", error);
    }
  };

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

  const handleSubStatusPress = () => {
    if (!caseStatus) {
      setShowSubStatusWarning(true);
      return;
    }
    setDropdownType("SUB");
  };

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
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.colors.colorBgPage },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.colorPrimary600} />
        <Text
          style={[
            styles.loadingText,
            { color: theme.colors.colorTextSecondary },
          ]}
        >
          Loading case data...
        </Text>
      </View>
    );
  }

  if (!interactionItem) {
    return (
      <View
        style={[
          styles.errorContainer,
          { backgroundColor: theme.colors.colorBgPage },
        ]}
      >
        <Ionicons
          name="alert-circle-outline"
          size={moderateScale(60)}
          color={theme.colors.colorAccent700}
        />
        <Text
          style={[styles.errorText, { color: theme.colors.colorTextSecondary }]}
        >
          No case data found
        </Text>
        <TouchableOpacity
          style={[
            styles.backButton,
            { backgroundColor: theme.colors.colorPrimary600 },
          ]}
          onPress={() => router.back()}
        >
          <Text
            style={[styles.backButtonText, { color: theme.colors.colorBgPage }]}
          >
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.colorBgPage }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          {/* HEADER */}
          <View
            style={[
              styles.header,
              { backgroundColor: theme.colors.colorPrimary600 },
            ]}
          >
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons
                name="arrow-back"
                size={moderateScale(24)}
                color={theme.colors.colorBgPage}
              />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text
                style={[
                  styles.headerTitle,
                  { color: theme.colors.colorBgPage },
                ]}
              >
                Update Case {caseId}
              </Text>
              {!!interactionItem.subject && (
                <Text
                  style={[
                    styles.headerSubtitle,
                    { color: `${theme.colors.colorBgPage}CC` },
                  ]}
                  numberOfLines={1}
                >
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
            <Text
              style={[styles.label, { color: theme.colors.colorTextSecondary }]}
            >
              Select Case Status *
            </Text>
            <TouchableOpacity
              style={[
                styles.dropdown,
                {
                  backgroundColor: theme.colors.colorBgSurface,
                  borderColor: theme.colors.colorBorder,
                },
              ]}
              onPress={() => setDropdownType("CASE")}
            >
              <Text
                style={[
                  caseStatus ? styles.value : styles.placeholder,
                  {
                    color: caseStatus
                      ? theme.colors.colorTextPrimary
                      : theme.colors.inputPlaceholder,
                    fontWeight: caseStatus ? "500" : "400",
                  },
                ]}
              >
                {caseStatus?.name || "Select Case Status"}
              </Text>
              <Ionicons
                name="chevron-down"
                size={moderateScale(20)}
                color={theme.colors.inputPlaceholder}
              />
            </TouchableOpacity>

            {/* SUB STATUS */}
            <View>
              <Text
                style={[
                  styles.label,
                  { color: theme.colors.colorTextSecondary },
                ]}
              >
                Select Sub Status (Optional)
              </Text>

              {showSubStatusWarning && (
                <View
                  style={[
                    styles.warningContainer,
                    {
                      backgroundColor: theme.colors.colorAccent500 + "20",
                      borderColor: theme.colors.colorAccent500 + "40",
                    },
                  ]}
                >
                  <Ionicons
                    name="warning-outline"
                    size={moderateScale(16)}
                    color={theme.colors.colorAccent700}
                  />
                  <Text
                    style={[
                      styles.warningText,
                      { color: theme.colors.colorAccent700 },
                    ]}
                  >
                    Please select Case Status first
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={[
                  styles.dropdown,
                  {
                    backgroundColor: theme.colors.colorBgSurface,
                    borderColor: theme.colors.colorBorder,
                  },
                  !caseStatus && styles.disabledDropdown,
                ]}
                onPress={handleSubStatusPress}
                disabled={!caseStatus}
              >
                <Text
                  style={[
                    subStatus ? styles.value : styles.placeholder,
                    {
                      color: subStatus
                        ? theme.colors.colorTextPrimary
                        : theme.colors.inputPlaceholder,
                      fontWeight: subStatus ? "500" : "400",
                    },
                  ]}
                >
                  {subStatus?.name || "Select Sub Status"}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={moderateScale(20)}
                  color={
                    caseStatus
                      ? theme.colors.inputPlaceholder
                      : theme.colors.colorBorder
                  }
                />
              </TouchableOpacity>
            </View>

            <Text
              style={[styles.label, { color: theme.colors.colorTextSecondary }]}
            >
              Comment *
            </Text>
            <TextInput
              ref={notesInputRef}
              style={[
                styles.textArea,
                {
                  backgroundColor: theme.colors.colorBgSurface,
                  borderColor: theme.colors.colorBorder,
                  color: theme.colors.colorTextPrimary,
                },
              ]}
              value={notes}
              onChangeText={setNotes}
              multiline
              placeholder="Enter your comment..."
              placeholderTextColor={theme.colors.inputPlaceholder}
            />

            <TouchableOpacity
              style={[
                styles.attachmentBtn,
                {
                  borderColor: theme.colors.colorPrimary600,
                  backgroundColor: theme.colors.colorPrimary600 + "10",
                },
              ]}
              onPress={addAttachment}
            >
              <Ionicons
                name="attach-outline"
                size={moderateScale(20)}
                color={theme.colors.colorPrimary600}
              />
              <Text
                style={[
                  styles.attachmentText,
                  { color: theme.colors.colorPrimary600 },
                ]}
              >
                Add Attachment
              </Text>
            </TouchableOpacity>

            {attachments.length > 0 && (
              <FlatList
                data={attachments}
                horizontal
                keyExtractor={(_, i) => i.toString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.attachmentsList}
                renderItem={({ item, index }) => (
                  <View
                    style={[
                      styles.attachmentPreview,
                      {
                        borderColor: theme.colors.colorBorder,
                        backgroundColor: theme.colors.colorBgSurface,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.removeAttachmentBtn}
                      onPress={() => removeAttachment(index)}
                    >
                      <Ionicons
                        name="close-circle"
                        size={moderateScale(20)}
                        color={theme.colors.colorAccent700}
                      />
                    </TouchableOpacity>
                    {item.type === "image" ? (
                      <Image source={{ uri: item.uri }} style={styles.image} />
                    ) : (
                      <Ionicons
                        name="document-text-outline"
                        size={moderateScale(42)}
                        color={theme.colors.colorPrimary600}
                      />
                    )}
                    <Text
                      style={[
                        styles.fileName,
                        { color: theme.colors.colorTextSecondary },
                      ]}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                  </View>
                )}
              />
            )}

            <TouchableOpacity
              style={[
                styles.submitBtn,
                { backgroundColor: theme.colors.colorPrimary600 },
              ]}
              onPress={submitHandler}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={theme.colors.colorBgPage} />
              ) : (
                <Text
                  style={[
                    styles.submitText,
                    { color: theme.colors.colorBgPage },
                  ]}
                >
                  Update
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>

          {/* BOTTOM SHEET */}
          <Modal transparent visible={!!dropdownType} animationType="slide">
            <TouchableOpacity
              style={styles.bottomSheetOverlay}
              onPress={() => {
                setDropdownType(null);
                setShowSubStatusWarning(false);
              }}
              activeOpacity={1}
            >
              <View
                style={[
                  styles.bottomSheet,
                  { backgroundColor: theme.colors.colorBgPage },
                ]}
              >
                {(dropdownType === "CASE"
                  ? statusDropdown
                  : subStatusDropdown
                ).map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.sheetItem,
                      {
                        borderBottomColor: theme.colors.colorBorder + "30",
                      },
                    ]}
                    onPress={() => {
                      if (dropdownType === "CASE") {
                        setCaseStatus(item);
                        setSubStatus(null);
                        setShowSubStatusWarning(false);
                        fetchSubStatusDropdown(item.id);
                      } else {
                        setSubStatus(item);
                      }
                      setDropdownType(null);
                    }}
                  >
                    <Text
                      style={[
                        styles.sheetItemText,
                        { color: theme.colors.colorTextPrimary },
                      ]}
                    >
                      {item.name}
                    </Text>
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
  container: { flex: 1 },
  innerContainer: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: verticalScale(10),
    fontSize: moderateScale(14),
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    marginTop: verticalScale(10),
    fontSize: moderateScale(18),
    marginBottom: verticalScale(20),
  },
  backButton: {
    paddingHorizontal: moderateScale(24),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(8),
  },
  backButtonText: {
    fontSize: moderateScale(14),
    fontWeight: "600",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? verticalScale(50) : verticalScale(40),
    padding: moderateScale(16),
    flexDirection: "row",
    alignItems: "center",
  },
  headerContent: {
    marginLeft: moderateScale(12),
    flex: 1,
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: "600",
  },
  headerSubtitle: {
    fontSize: moderateScale(13),
    marginTop: verticalScale(2),
  },
  content: {
    padding: moderateScale(16),
    paddingBottom: verticalScale(30),
  },
  label: {
    marginTop: verticalScale(12),
    marginBottom: verticalScale(6),
    fontSize: moderateScale(14),
    fontWeight: "500",
  },
  dropdown: {
    borderWidth: 1,
    padding: moderateScale(14),
    borderRadius: moderateScale(10),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(8),
  },
  disabledDropdown: {
    opacity: 0.6,
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: moderateScale(8),
    borderRadius: moderateScale(6),
    marginBottom: verticalScale(6),
    borderWidth: 1,
  },
  warningText: {
    fontSize: moderateScale(12),
    marginLeft: moderateScale(4),
    fontWeight: "500",
  },
  placeholder: {
    fontSize: moderateScale(14),
  },
  value: {
    fontSize: moderateScale(14),
  },
  textArea: {
    borderWidth: 1,
    borderRadius: moderateScale(10),
    height: verticalScale(100),
    padding: moderateScale(12),
    textAlignVertical: "top",
    fontSize: moderateScale(14),
  },
  attachmentBtn: {
    marginTop: verticalScale(20),
    borderWidth: 1,
    borderRadius: moderateScale(10),
    padding: moderateScale(14),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: moderateScale(8),
  },
  attachmentText: {
    fontSize: moderateScale(14),
    fontWeight: "500",
  },
  attachmentsList: {
    paddingVertical: verticalScale(12),
  },
  attachmentPreview: {
    width: moderateScale(100),
    height: moderateScale(100),
    marginRight: moderateScale(10),
    borderWidth: 1,
    borderRadius: moderateScale(10),
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: moderateScale(6),
  },
  fileName: {
    fontSize: moderateScale(11),
    marginTop: verticalScale(4),
    paddingHorizontal: moderateScale(4),
    textAlign: "center",
  },
  removeAttachmentBtn: {
    position: "absolute",
    top: -moderateScale(6),
    right: -moderateScale(6),
    backgroundColor: "#fff",
    borderRadius: moderateScale(12),
    zIndex: 1,
  },
  submitBtn: {
    marginTop: verticalScale(24),
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  submitText: {
    fontSize: moderateScale(16),
    fontWeight: "600",
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
    maxHeight: height * 0.5,
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    paddingBottom:
      Platform.OS === "ios" ? verticalScale(30) : verticalScale(20),
  },
  sheetItem: {
    padding: moderateScale(16),
    borderBottomWidth: 1,
  },
  sheetItemText: {
    fontSize: moderateScale(16),
  },
});
