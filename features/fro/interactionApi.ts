// features/interaction/interactionApi.ts
import { apiRequest } from "@/features/api/callApi";

type GetInteractionsParams = {
  pageNumber?: number;
  pageSize?: number;
  assignToId: string;
  token: string;        // ✅ passed explicitly
  csrfToken?: string;   // ✅ optional
};

export const getInteractionsListByAssignToId = async ({
  pageNumber = 1,
  pageSize = 10,
  assignToId,
  token,
  csrfToken,
}: GetInteractionsParams) => {
  return apiRequest({
    method: "GET",
    url: "/Interaction/GetInteractionsListByAssignToId", 
    params: {
      PageNumber: pageNumber,
      PageSize: pageSize,
      AssignToId: assignToId,
    },
    headers: {
      Authorization: `Bearer ${token}`,
      ...(csrfToken && { "X-CSRF-TOKEN": csrfToken }),
      Accept: "application/json",
    },
  });
};
