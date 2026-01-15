// features/fro/froLocationApi.ts

import { apiRequest } from "@/features/api/callApi";
import { AddOrUpdateFROLocationPayload } from "@/features/fro/types/froLocation";

/* ================= ADD / UPDATE FRO LOCATION ================= */

export const addAndUpdateFROLocation = async (
  payload: AddOrUpdateFROLocationPayload
) => {
  return apiRequest({
    url: "/api/FROUsersLocations/AddAndUpdateFROLocation",
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json-patch+json",
    },
    data: payload,
  });
};
