import NewCasePopupModal from "@/components/reusables/NewCasePopupModal";
import RemarkActionModal from "@/components/reusables/RemarkActionModal";
import StatusModal from "@/components/reusables/StatusModal";
import { useTheme } from "@/theme/ThemeContext";

import { addAndUpdateFROLocation } from "@/features/fro/froLocationApi";
import { addInteractionActivityHistory } from "@/features/fro/interaction/ActivityHistory";
import {
  getInteractionsListByAssignToId,
  updateInteraction,
} from "@/features/fro/interactionApi";
import { getUserDataById } from "@/features/fro/profile/getProfile";
import { updateFROLatLong } from "@/features/fro/updateFROLatLongApi";
import { setUser } from "@/redux/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
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
  const userNameRef = useRef("");
  const authState = useAppSelector((state) => state.auth);
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const { fetchLocation, address } = useLocation();

  const [queue, setQueue] = useState<any[]>([]);
  const [current, setCurrent] = useState<any | null>(null);
  const [visible, setVisible] = useState(false);

  // console.log("user", user?.name);

  // console.log("current", current);

  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [showAcceptedStatusModal, setShowAcceptedStatusModal] = useState(false);
  const [showDeclinedStatusModal, setShowDeclinedStatusModal] = useState(false);
  const locationIntervalRef = useRef<any>(null);
  const activeTicketRef = useRef<string | null>(null);
  const seenIdsRef = useRef<Set<number>>(new Set());
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    userNameRef.current = user?.name || "User";
  }, [user?.name]);

  /* ================= RESTORE TRACKING ================= */

  useEffect(() => {
    const restoreTracking = async () => {
      try {
        const res = await getInteractionsListByAssignToId({
          assignToId: String(authState.userId),
          pageNumber: 1,
          pageSize: 100,
          token: String(authState.token),
          csrfToken: String(authState.antiforgeryToken),
        });

        const interactions = res?.data?.interactions || [];

        const activeTicket = interactions.find(
          (item: any) => item.caseStatusId === 2 && item.subStatusId === 22,
        );

        if (activeTicket && !locationIntervalRef.current) {
          console.log("🔄 Restart tracking:", activeTicket.transactionNumber);
          startLatLongTracking(activeTicket.transactionNumber);
        }
      } catch (err) {
        console.log("Restore tracking error:", err);
      }
    };

    if (authState.token) restoreTracking();
  }, [authState.token]);

  /* ================= LOCATION ================= */

  const fetchUserData = async () => {
    try {
      const response = await getUserDataById({
        userId: String(authState.userId),
        token: String(authState.token),
        csrfToken: String(authState.antiforgeryToken),
      });

      const user = response?.data;

      dispatch(
        setUser({
          name: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
          email: user?.email,
          phone: user?.phone,
          loginId: user?.loginId,
        }),
      );
    } catch (error) {
      console.error("User fetch error:", error);
    }
  };

  // console.log("user", user);

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

      console.log("📤 Location Payload:", payload);

      const res = await addAndUpdateFROLocation(payload);
      console.log("✅ Location Response:", res);
    } catch (error) {
      console.error("❌ Location update error:", error);
    }
  };

  /* ================= ACTIVITY HISTORY ================= */

  const saveActivity = async ({
    interactionId,
    oldCaseStatus,
    newCaseStatus,
    oldSubStatus,
    newSubStatus,
    activityStatus,
    transactionNumber,
  }: any) => {
    try {
      /* ---------------- FETCH USER DATA FIRST ---------------- */
      const userRes = await getUserDataById({
        userId: String(authState?.userId),
        token: String(authState?.token),
        csrfToken: String(authState?.antiforgeryToken),
      });

      // console.log("👤 User Data Response:", userRes);

      const firstName = userRes?.data?.firstName || "";
      const lastName = userRes?.data?.lastName || "";
      const activityByName = `${firstName} ${lastName}`.trim();

      // console.log("wdfcfs", firstName, lastName);

      /* ---------------- ACTIVITY PAYLOAD ---------------- */
      const payload = {
        activityTime: new Date().toISOString(),
        activityInteractionId: interactionId,
        activityActionName: "UPDATE",
        activityDescription: `StatusName changed from "${oldCaseStatus}" --> "${newCaseStatus}", SubStatusName changed from "${oldSubStatus}" --> "${newSubStatus}"`,
        activityStatus,
        activityById: String(authState?.userId),
        activityByName,
        activityRelatedTo: "CAS",
        activityRelatedToId: interactionId,
        activityRelatedToName: transactionNumber,
      };

      console.log("📤 Activity Payload:", payload);

      const response = await addInteractionActivityHistory({
        token: String(authState?.token),
        csrfToken: String(authState?.antiforgeryToken),
        body: payload,
      });

      console.log("✅ Activity Response:", response);
    } catch (err) {
      console.error("❌ Activity save error:", err);
    }
  };

  /* ================= POLLING ================= */

  useEffect(() => {
    if (!authState.token || pollerStarted) return;

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

        // console.log("Interaction polling: ", res);

        const interactions = res?.data?.interactions || [];
        const matched: any[] = [];

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

        if (error?.status === 440 || error?.status === 401) {
          Alert.alert("Session Expired", "Please login again.");
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

  const closePopup = () => {
    setVisible(false);
    setCurrent(null);
  };

  /* ================= ACCEPT ================= */

  const startLatLongTracking = (ticketNumber: string) => {
    if (!ticketNumber || locationIntervalRef.current) return;
    if (!user?.name) {
      // console.log("User not loaded yet, delaying tracking...");
      setTimeout(() => startLatLongTracking(ticketNumber), 2000);
      return;
    }

    activeTicketRef.current = ticketNumber;

    locationIntervalRef.current = setInterval(async () => {
      try {
        /* 🔎 CHECK CURRENT TICKET STATUS FIRST */
        const res = await getInteractionsListByAssignToId({
          assignToId: String(authState.userId),
          pageNumber: 1,
          pageSize: 100,
          token: String(authState.token),
          csrfToken: String(authState.antiforgeryToken),
        });

        const interactions = res?.data?.interactions || [];

        const currentTicket = interactions.find(
          (i: any) => i.transactionNumber === ticketNumber,
        );

        // 🛑 STOP if closed
        if (
          currentTicket?.caseStatusId === 4 &&
          currentTicket?.subStatusId === 8
        ) {
          console.log("🛑 Ticket closed. Stop tracking.");
          stopLatLongTracking();
          return;
        }

        /* 📍 OTHERWISE SEND LOCATION */
        const location = await fetchLocation();
        if (!location) return;

        const { latitude, longitude } = location.coords;

        const updateRes = await updateFROLatLong({
          ticketNumber,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          token: String(authState.token),
          csrfToken: String(authState.antiforgeryToken),
          name: userNameRef.current || "User",
          userId: String(authState.userId), // ✅ THIS MUST BE GUID
        });

        // console.log("📍 LatLong Updated", updateRes);
      } catch (err) {
        console.log("Tracking error:", err);
      }
    }, 10000);
  };

  const stopLatLongTracking = () => {
    if (locationIntervalRef.current) {
      clearInterval(locationIntervalRef.current);
      locationIntervalRef.current = null;
      activeTicketRef.current = null;
      console.log("🛑 Tracking stopped");
    }
  };

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

      // console.log("✅ Accept Response:", res);

      await saveActivity({
        interactionId: current.id,
        oldCaseStatus: current.caseStatusName,
        newCaseStatus: "In-Progress",
        oldSubStatus: current.subStatusName,
        newSubStatus: "Case Accepted",
        activityStatus: "Busy",
        transactionNumber: current?.transactionNumber,
      });
      startLatLongTracking(current.transactionNumber);
      sendLocation(current.id);
      closePopup();
      setShowAcceptedStatusModal(true);
    } catch (error) {
      console.error("❌ Accept failed:", error);
    }
  };

  /* ================= REJECT ================= */

  const handleReject = () => setShowRemarkModal(true);

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

      console.log("✅ Reject Response:", res);

      await saveActivity({
        interactionId: current.id,
        oldCaseStatus: current.caseStatusName,
        newCaseStatus: "Open",
        oldSubStatus: current.subStatusName,
        newSubStatus: "Rejected By FRO",
        activityStatus: "Available",
        transactionNumber: current?.transactionNumber,
      });

      sendLocation(current.id);
      setShowRemarkModal(false);
      closePopup();
      setShowDeclinedStatusModal(true);
    } catch (error) {
      console.error("❌ Reject failed:", error);
    }
  };

  /* ================= POPUP UI ================= */

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
        onSubmit={submitReject}
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
