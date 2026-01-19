import { apiRequest } from "@/features/api/callApi";

/* ================= TYPES ================= */

export type GetDropdownParams = {
  endpoint: string; // "/Dropdown/GetStatusMasterDropdown"
  token: string; // Bearer token
  csrfToken?: string; // Optional CSRF token
  params?: Record<string, any>; // Optional query params
};

export type DropdownItem = {
  id: string | number;
  name: string;
};

export type DropdownResponse<T = DropdownItem> = {
  success: boolean;
  data: T[];
};

/* ================= COMMON DROPDOWN CALL ================= */

export const getDropdown = async <T = DropdownItem>({
  endpoint,
  token,
  csrfToken,
  params,
}: GetDropdownParams): Promise<DropdownResponse<T>> => {
  return apiRequest<DropdownResponse<T>>({
    method: "GET",
    url: endpoint,
    params,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(csrfToken && { "X-CSRF-TOKEN": csrfToken }),
      accept: "application/json",
    },
  });
};
