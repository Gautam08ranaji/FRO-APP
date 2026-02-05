import NewCasePopupModal from "@/components/reusables/NewCasePopupModal";
import RemarkActionModal from "@/components/reusables/RemarkActionModal";
import StatusModal from "@/components/reusables/StatusModal";
import { useTheme } from "@/theme/ThemeContext";

import { addAndUpdateFROLocation } from "@/features/fro/froLocationApi";
import {
  getInteractionsListByAssignToId,
  updateInteraction,
} from "@/features/fro/interactionApi";
import { useAppSelector } from "@/store/hooks";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { useLocation } from "./LocationContext";

/**
 * 🔥 Singleton flag
 * Ensures polling starts ONLY ONCE
 */
let pollerStarted = false;

export const useInteractionPopupPoller = () => {
  const authState = useAppSelector((state) => state.auth);
  const [showAcceptedStatusModal, setShowAcceptedStatusModal] = useState(false);
  const [showDeclinedStatusModal, setShowDeclinedStatusModal] = useState(false);
  const { theme } = useTheme();
  const { hasPermission, fetchLocation, address } = useLocation();

  const [queue, setQueue] = useState<any[]>([]);
  const [current, setCurrent] = useState<any | null>(null);
  const [currentTicket] = useState<any | null>(null);
  const [visible, setVisible] = useState(false);

  /** Reject modal */
  const [showRemarkModal, setShowRemarkModal] = useState(false);

  /** Prevent duplicate popups */
  const seenIdsRef = useRef<Set<number>>(new Set());

  /** Polling interval */
  const intervalRef = useRef<number | null>(null);

  const sendLocation = async (id: any) => {
    try {
      const location = await fetchLocation();
      if (!location) return;

      const { latitude, longitude } = location.coords;
      const payload = {
        name: address ?? "Unknown location", // ✅ READABLE ADDRESS
        latitute: latitude.toString(), // ✅ real latitude
        longititute: longitude.toString(), // ✅ real longitude
        discriptions: address ?? "",
        elderPinLocation: "string",
        froPinLocation: String(address),
        tikcetNumber: String(id),
        froStatus: "Online",
        userId: String(authState.userId), // ✅ use passed userId
      };

      // console.log("📤 Sending payload:", payload);

      const res = await addAndUpdateFROLocation(payload);
      console.log("✅ Update Ticket:", res);
    } catch (error) {
      console.error("❌ Location update error:", error);
    }
  };

  /* ================= POLLING ================= */

  useEffect(() => {
    if (!authState.token) return;
    if (pollerStarted) return;

    pollerStarted = true;

    const fetchInteractions = async () => {
      try {
        const res = await getInteractionsListByAssignToId({
          assignToId: String(authState.userId),
          pageNumber: 1,
          pageSize: 100,
          token: String(authState.token),
          csrfToken: String(authState.antiforgeryToken),
        });

        const interactions = res?.data?.interactions || [];
        const matched: any[] = [];

        // console.log("res api", res);

        interactions.forEach((item: any) => {
          const isMatch = item.caseStatusId === 1 && item.subStatusId === 9;

          if (isMatch && !seenIdsRef.current.has(item.id)) {
            seenIdsRef.current.add(item.id);
            matched.push(item);
          }
        });

        if (matched.length > 0) {
          setQueue((prev) => [...prev, ...matched]);
        }
      } catch (error: any) {
        console.error("❌ Interaction polling failed:", error);
        if (error?.status === 440 || 401) {
          Alert.alert("Error", error?.data);
          router.replace("/(onboarding)/login");
        }
      }
    };

    fetchInteractions();
    intervalRef.current = setInterval(fetchInteractions, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      pollerStarted = false;
    };
  }, [authState.token]);

  /* ================= QUEUE HANDLER ================= */

  useEffect(() => {
    if (!visible && queue.length > 0) {
      setCurrent(queue[0]);
      setQueue((prev) => prev.slice(1));
      setVisible(true);
    }
  }, [queue, visible]);

  /* ================= ACTION HANDLERS ================= */

  const closePopup = () => {
    setVisible(false);
    setCurrent(null);
  };

  /* ---------- ACCEPT ---------- */
  const handleAccept = async () => {
    if (!current) return;

    try {
      const res = await updateInteraction({
        token: String(authState.token),
        csrfToken: String(authState.antiforgeryToken),
        data: {
          id: current.id,
          caseStatusId: 2,
          caseStatusName: "In-Progress",
          subStatusId: 22,
          subStatusName: "Case Accepted",
          comment: "Accepted By FRO",
          callBack: "",
          assignToId: String(authState.userId),
        },
      });

      console.log("accept case", res);

      sendLocation(current.id);
      closePopup();

      // ✅ SHOW SUCCESS MODAL
      setShowAcceptedStatusModal(true);
    } catch (error) {
      console.error("❌ Accept failed:", error);
    }
  };

  /* ---------- REJECT ---------- */
  const handleReject = () => {
    setShowRemarkModal(true);
  };

  const submitReject = async (remarkText: string) => {
    if (!current) return;

    try {
      const res = await updateInteraction({
        token: String(authState.token),
        csrfToken: String(authState.antiforgeryToken),
        data: {
          id: current.id,
          caseStatusId: 1,
          caseStatusName: "Open",
          subStatusId: 26,
          subStatusName: "Rejected By FRO",
          comment: remarkText,
          callBack: "No",
        },
      });

      // console.log("rejected", res);
      sendLocation(current.id);

      setShowRemarkModal(false);
      closePopup();

      // ✅ SHOW DECLINED MODAL
      setShowDeclinedStatusModal(true);
    } catch (error) {
      console.error("❌ Reject failed:", error);
    }
  };

  /* ================= POPUP ================= */

  const Popup = (
    <>
      {current && (
        <NewCasePopupModal
          visible={visible}
          title="New Case"
          urgentLabel="Urgent"
          name={current.name}
          age={current.ageofTheElder}
          details={[
            { label: "Category", value: current.categoryName },
            { label: "Sub Category", value: current.subCategoryName },
            { label: "Priority", value: current.priority },
            { label: "District", value: current.districtName },
          ]}
          onAccept={handleAccept}
          onDeny={handleReject}
          onTimeout={closePopup}
        />
      )}

      <RemarkActionModal
        visible={showRemarkModal}
        title="Why You Declined"
        buttonText="Deny"
        onClose={() => setShowRemarkModal(false)}
        onSubmit={submitReject} // ✅ PASSES REMARK TEXT
      />

      <StatusModal
        visible={showAcceptedStatusModal}
        title="Case Accepted"
        iconName="check-line"
        iconColor="#00796B"
        iconBgColor="#E0F2F1"
        autoCloseAfter={2000}
        onClose={() => setShowAcceptedStatusModal(false)}
      />

      <StatusModal
        visible={showDeclinedStatusModal}
        title="Case Declined"
        iconName="check-line"
        iconColor={theme.colors.validationErrorText}
        iconBgColor={theme.colors.validationErrorText + "22"}
        autoCloseAfter={2000}
        titleColor={theme.colors.colorAccent500}
        onClose={() => setShowDeclinedStatusModal(false)}
      />
    </>
  );

  return { Popup };
};
function fetchLocation() {
  throw new Error("Function not implemented.");
}
