import { apiRequest } from "@/features/api/callApi";


// app/services/apiContext.ts

export interface ApiAuthContext {
  bearerToken: string;
  antiForgeryToken: string;
}


/* ================= STATIC QUERY ================= */

const STATIC_FAQ_QUERY = {
  PageNumber: 1,
  PageSize: 10,
  UserId: "19389acb-f897-453d-b94b-b56587954c32",
};

/* ================= API FUNCTION ================= */

export const getFaqListStatic = (auth: ApiAuthContext) => {
  console.log("🔧 [GET FAQ LIST – STATIC]", {
    hasBearerToken: !!auth.bearerToken,
    hasAntiForgeryToken: !!auth.antiForgeryToken,
  });

  return apiRequest({
    url: "/MobileApp/GetFaqList",
    method: "GET",
    headers: {
      Authorization: `Bearer ${auth.bearerToken}`,
      "X-CSRF-TOKEN": auth.antiForgeryToken,
      Accept: "application/json",
    },
    params: STATIC_FAQ_QUERY,
  });
};
