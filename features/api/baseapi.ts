import type { RootState } from "@/store";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const publicBaseQuery = fetchBaseQuery({
  baseUrl: "http://43.230.203.249:99/api",
  headers: {
    accept: "application/json",
  },
});

export const authBaseQuery = fetchBaseQuery({
  baseUrl: "http://43.230.203.249:99/api",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    headers.set("accept", "application/json");
    return headers;
  },

  responseHandler: async (response) => {
    const text = await response.text();
    try {
      return text ? JSON.parse(text) : null;
    } catch {
      return text;
    }
  },
});
