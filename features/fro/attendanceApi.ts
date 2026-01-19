import { apiRequest } from "@/features/api/callApi";

/* ================= TYPES ================= */
type UpdateAttendancePunchParams = {
  userId: string;
  punchIn: boolean;
  token: string; // ✅ required
  csrfToken?: string; // ✅ optional
};

/* ================= API ================= */
export const updateAttendancePunch = async ({
  userId,
  punchIn,
  token,
  csrfToken,
}: UpdateAttendancePunchParams) => {
  return apiRequest({
    method: "PUT",
    url: "/MobileApp/UpdateAttendancePunch",
    data: {
      userId,
      punchIn,
    },
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json-patch+json",
      ...(csrfToken && { "X-CSRF-TOKEN": csrfToken }),
      Accept: "application/json",
    },
  });
};
