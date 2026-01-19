// features/interaction/interactionApi.ts
import { apiRequest } from "@/features/api/callApi";

type GetInteractionsParams = {
  pageNumber?: number;
  pageSize?: number;
  assignToId: string;
  token: string; // ✅ passed explicitly
  csrfToken?: string; // ✅ optional
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

type UpdateInteractionParams = {
  data: {
    id: number;

    userId: string;
    assignToId: string;

    callTypeName?: string;
    callTypeId?: number;

    transactionNumber?: string;

    caseStatusId?: number;
    caseStatusName?: string;

    subStatusId?: number;
    subStatusName?: string;

    categoryId?: number;
    categoryName?: string;

    subCategoryId?: number;
    subCategoryName?: string;

    subSubCategoryId?: number;
    subSubCategoryName?: string;

    subject?: string;
    name?: string;
    gender?: string;

    stateId?: number;
    stateName?: string;
    districtId?: number;
    districtName?: string;

    finalDisposition?: string;
    problemReported?: string;
    agentRemarks?: string;
    comment?: string;

    callBack?: string;
    priority?: string;

    contactId?: number;
    contactName?: string;

    teamId?: number;
    teamName?: string;

    source?: string;
    emailId?: string;
    mobileNo?: string;

    assignToName?: string;

    dateOfIssuesOccured?: string;
    callBackDateTime?: string;

    isTestcall?: boolean;
    isPrankCall?: boolean;
    isBlankCall?: boolean;
    isAbusiveCall?: boolean;
    isCallDrop?: boolean;
    isNotRelatedToElderly?: boolean;

    caseDescription?: string;
    ticketType?: string;

    pinCode?: string;
    alternateNo?: string;

    [key: string]: any;
  };

  token: string; // ✅ passed explicitly
  csrfToken?: string; // ✅ optional
};

export const updateInteraction = async ({
  data,
  token,
  csrfToken,
}: UpdateInteractionParams) => {
  return apiRequest({
    method: "PUT",
    url: "/Interaction/UpdateInteraction",
    data,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(csrfToken && { "X-CSRF-TOKEN": csrfToken }),
      Accept: "application/json",
      "Content-Type": "application/json-patch+json",
    },
  });
};
