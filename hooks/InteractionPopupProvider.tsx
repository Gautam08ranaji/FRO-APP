import NewCasePopupModal from "@/components/reusables/NewCasePopupModal";
import { getInteractionsListByAssignToId } from "@/features/fro/interactionApi";
import { useAppSelector } from "@/store/hooks";
import React, { useEffect, useRef, useState } from "react";

/**
 * 🔥 Singleton flag
 * Ensures polling starts ONLY ONCE
 * (even if hook is mounted multiple times)
 */
let pollerStarted = false;

export const useInteractionPopupPoller = () => {
  const authState = useAppSelector((state) => state.auth);

  const [queue, setQueue] = useState<any[]>([]);
  const [current, setCurrent] = useState<any | null>(null);
  const [visible, setVisible] = useState(false);

  /** Prevent duplicate popups */
  const seenIdsRef = useRef<Set<number>>(new Set());

  /** React Native setInterval returns number */
  const intervalRef = useRef<number | null>(null);

  /* ================= POLLING EFFECT ================= */

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

        console.log("list", res?.data?.interactions);

        const interactions = res?.data?.interactions || [];

        const matched: any[] = [];
        const alreadySeen: any[] = [];
        const unmatched: any[] = [];

        interactions.forEach((item: any) => {
          const isMatch = item.caseStatusId === 1 && item.subStatusId === 9;

          if (isMatch) {
            if (seenIdsRef.current.has(item.id)) {
              alreadySeen.push(item);
            } else {
              matched.push(item);
            }
          } else {
            unmatched.push(item);
          }
        });

        console.log("📡 Interaction Poll Result");
        console.log("➡ Total:", interactions.length);
        console.log("✅ New Matches:", matched.length);
        console.log("🟡 Already Seen:", alreadySeen.length);
        console.log("❌ Unmatched:", unmatched.length);

        if (matched.length > 0) {
          matched.forEach((item) => seenIdsRef.current.add(item.id));

          setQueue((prev) => [...prev, ...matched]);
        }
      } catch (error) {
        console.error("❌ Interaction polling failed:", error);
      }
    };

    /** 🔥 FIRST CALL IMMEDIATELY */
    fetchInteractions();

    /** 🔁 REPEAT EVERY 10 SECONDS */
    intervalRef.current = setInterval(fetchInteractions, 10000);

    /** 🧹 CLEANUP */
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      pollerStarted = false;
    };
  }, [authState.token]);

  /* ================= QUEUE HANDLER ================= */

  useEffect(() => {
    if (!visible && queue.length > 0) {
      setCurrent(queue[0]);
      setVisible(true);
      setQueue((prev) => prev.slice(1));
    }
  }, [queue, visible]);

  /* ================= ACTIONS ================= */

  const closePopup = () => {
    setVisible(false);
    setCurrent(null);
  };

  /* ================= MODAL RENDER ================= */

  const Popup = current ? (
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
      onAccept={closePopup}
      onDeny={closePopup}
      onTimeout={closePopup}
    />
  ) : null;

  return { Popup };
};
