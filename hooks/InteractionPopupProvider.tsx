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
import { Audio } from "expo-av";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { useLocation } from "./LocationContext";

/**
 * 🔥 Singleton flag
 * Ensures polling starts ONLY ONCE
 */
let pollerStarted = false;

interface Ticket {
  id: number;
  transactionNumber: string;
  name: string;
  caseStatusId: number;
  subStatusId: number;
  caseStatusName?: string;
  subStatusName?: string;
}

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

  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [showAcceptedStatusModal, setShowAcceptedStatusModal] = useState(false);
  const [showDeclinedStatusModal, setShowDeclinedStatusModal] = useState(false);

  // New state for active tickets dropdown
  const [activeTickets, setActiveTickets] = useState<Ticket[]>([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [isSubmittingReject, setIsSubmittingReject] = useState(false);

  // Audio reference
  const soundRef = useRef<Audio.Sound | null>(null);

  const locationIntervalRef = useRef<any>(null);
  const activeTicketRef = useRef<string | null>(null);
  const seenIdsRef = useRef<Set<number>>(new Set());
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    fetchUserData();

    // Configure audio mode
    configureAudioMode();

    // Cleanup audio on unmount
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    userNameRef.current = user?.name || "User";
  }, [user?.name]);

  /* ================= AUDIO SETUP ================= */

  const configureAudioMode = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true, // This keeps audio playing in background
        playsInSilentModeIOS: true, // This plays even when iPhone is on silent
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.log("Error configuring audio mode:", error);
    }
  };

  const playBuzzerSound = async () => {
    try {
      // Unload previous sound if exists
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      // Load the buzzer sound with looping enabled for continuous playback
      const { sound } = await Audio.Sound.createAsync(
        require("@/assets/audio/buzzer.mp3"),
        {
          shouldPlay: true,
          isLooping: true,
          volume: 1.0,
        },
      );

      soundRef.current = sound;

      // Play the sound
      await sound.playAsync();

      console.log("🔊 Continuous buzzer started");

      // Optional: Just log when loops complete (simplified)
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          console.log("Buzzer loop completed");
        }
      });
    } catch (error) {
      console.log("Error playing buzzer sound:", error);
    }
  };

  const stopBuzzerSound = async () => {
    try {
      if (soundRef.current) {
        // Check status before stopping
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
          console.log("🔇 Buzzer stopped");
        }
        soundRef.current = null;
      }
    } catch (error) {
      console.log("Error stopping buzzer sound:", error);
    }
  };

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
      const userRes = await getUserDataById({
        userId: String(authState?.userId),
        token: String(authState?.token),
        csrfToken: String(authState?.antiforgeryToken),
      });

      const firstName = userRes?.data?.firstName || "";
      const lastName = userRes?.data?.lastName || "";
      const activityByName = `${firstName} ${lastName}`.trim();

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
      setVisible(true);

      // Play continuous buzzer sound when popup opens
      playBuzzerSound();
    }
  }, [queue, visible]);

  const closePopup = useCallback(() => {
    setVisible(false);
    setCurrent(null);
    // Remove the first item from queue
    setQueue((prev) => prev.slice(1));

    // Stop buzzer sound when popup closes
    stopBuzzerSound();
  }, []);

  /* ================= ACCEPT ================= */

  const startLatLongTracking = (ticketNumber: string) => {
    if (!ticketNumber || locationIntervalRef.current) return;
    if (!user?.name) {
      setTimeout(() => startLatLongTracking(ticketNumber), 2000);
      return;
    }

    activeTicketRef.current = ticketNumber;

    locationIntervalRef.current = setInterval(async () => {
      try {
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

        if (
          currentTicket?.caseStatusId === 4 &&
          currentTicket?.subStatusId === 8
        ) {
          console.log("🛑 Ticket closed. Stop tracking.");
          stopLatLongTracking();
          return;
        }

        const location = await fetchLocation();
        if (!location) return;

        const { latitude, longitude } = location.coords;

        await updateFROLatLong({
          ticketNumber,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          token: String(authState.token),
          csrfToken: String(authState.antiforgeryToken),
          name: userNameRef.current || "User",
          userId: String(authState.userId),
        });
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

      // Stop buzzer sound if it's still playing
      stopBuzzerSound();
    } catch (error) {
      console.error("❌ Accept failed:", error);
    }
  };

  /* ================= REJECT WITH TICKET SELECTION ================= */

  /**
   * Fetch active tickets with caseStatusId === 2
   */
  const fetchActiveTickets = async (): Promise<Ticket[]> => {
    try {
      setIsLoadingTickets(true);
      const res = await getInteractionsListByAssignToId({
        assignToId: String(authState.userId),
        pageNumber: 1,
        pageSize: 100,
        token: String(authState.token),
        csrfToken: String(authState.antiforgeryToken),
      });

      const interactions = res?.data?.interactions || [];

      // Filter for tickets with caseStatusId === 2 (In-Progress)
      // Exclude the current ticket if needed
      const activeTicketsList = interactions.filter(
        (item: any) => item.caseStatusId === 2 && item.id !== current?.id, // Exclude current ticket if needed
      );

      return activeTicketsList;
    } catch (error) {
      console.error("Error fetching active tickets:", error);
      return [];
    } finally {
      setIsLoadingTickets(false);
    }
  };

  const handleReject = async () => {
    // Fetch active tickets before showing the modal
    const tickets = await fetchActiveTickets();
    setActiveTickets(tickets);
    setShowRemarkModal(true);

    // Stop buzzer sound when reject modal opens
    stopBuzzerSound();
  };

  const submitReject = async (
    remarkText: string,
    selectedTicketId?: number,
  ) => {
    if (!current || isSubmittingReject) return;

    setIsSubmittingReject(true);

    try {
      // First, update the current interaction as rejected
      const rejectRes = await updateInteraction({
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
          // If a ticket was selected, add a note about reassignment
          ...(selectedTicketId && {
            notes: `Reassigned to ticket ID: ${selectedTicketId}`,
          }),
        },
      });

      console.log("✅ Reject Response:", rejectRes);

      // If a ticket was selected, you might want to update that ticket
      // with information about the rejection or perform other actions
      if (selectedTicketId) {
        const selectedTicket = activeTickets.find(
          (t) => t.id === selectedTicketId,
        );
        console.log(
          `📋 Ticket ${selectedTicket?.transactionNumber} selected for reassignment context`,
        );

        // Here you could call another API to update the selected ticket
        // For example, adding a note that a new case was rejected and linked to this ticket
        // await updateInteractionNote(selectedTicketId, `Related rejected case: ${current.transactionNumber}`);
      }

      // Save activity history for the rejection
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

      // Close remark modal first
      setShowRemarkModal(false);

      // Clear active tickets
      setActiveTickets([]);

      // Close the main popup
      closePopup();

      // Show success modal
      setShowDeclinedStatusModal(true);

      // Stop buzzer sound if it's still playing
      stopBuzzerSound();
    } catch (error) {
      console.error("❌ Reject failed:", error);
      Alert.alert("Error", "Failed to reject case. Please try again.");
    } finally {
      setIsSubmittingReject(false);
    }
  };

  const handleRemarkModalClose = useCallback(() => {
    setShowRemarkModal(false);
    setActiveTickets([]); // Clear tickets when modal closes
    // Don't stop buzzer here as we might want it to continue if main popup is still visible
    // Only stop if main popup is not visible
    if (!visible) {
      stopBuzzerSound();
    }
  }, [visible]);

  const handleStatusModalClose = useCallback(
    (type: "accepted" | "declined") => {
      if (type === "accepted") {
        setShowAcceptedStatusModal(false);
      } else {
        setShowDeclinedStatusModal(false);
      }
      // Check if there are more items in queue
      if (queue.length > 0) {
        setCurrent(queue[0]);
        setVisible(true);
        playBuzzerSound();
      }
    },
    [queue],
  );

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
          onClose={closePopup}
        />
      )}

      <RemarkActionModal
        visible={showRemarkModal}
        title="Why You Declined"
        buttonText="Deny"
        onClose={handleRemarkModalClose}
        onSubmit={submitReject}
        tickets={activeTickets}
        requireTicketSelection={true}
        isLoading={isLoadingTickets || isSubmittingReject}
      />

      <StatusModal
        visible={showAcceptedStatusModal}
        title="Case Accepted"
        iconName="check-line"
        iconColor="#00796B"
        iconBgColor="#E0F2F1"
        autoCloseAfter={2000}
        onClose={() => handleStatusModalClose("accepted")}
      />

      <StatusModal
        visible={showDeclinedStatusModal}
        title="Case Declined"
        iconName="check-line"
        iconColor={theme.colors.validationErrorText}
        iconBgColor={theme.colors.validationErrorText + "22"}
        autoCloseAfter={2000}
        titleColor={theme.colors.colorAccent500}
        onClose={() => handleStatusModalClose("declined")}
      />
    </>
  );

  return { Popup };
};
