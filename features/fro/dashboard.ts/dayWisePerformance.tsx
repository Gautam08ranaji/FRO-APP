// features/user/userApi.ts
import { apiRequest } from "@/features/api/callApi";

type GetFROCasePerformanceParams = {
  year: number;
  month: number;
  userId: string;
  token: string;
  csrfToken?: string;
};

export const getFROCasePerformanceDayWise = async ({
  year,
  month,
  userId,
  token,
  csrfToken,
}: GetFROCasePerformanceParams) => {
  return apiRequest({
    method: "GET",
    url: `/MobileApp/GetFROCasePerformanceDayWise`,
    params: {
      Year: year,
      Month: month,
      AssignToId: userId,
    },
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      ...(csrfToken && { "X-CSRF-TOKEN": csrfToken }),
    },
  });
};