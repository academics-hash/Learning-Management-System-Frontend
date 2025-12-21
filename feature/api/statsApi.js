import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../utils/apiConfig";

export const statsApi = createApi({
    reducerPath: "statsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: getBaseUrl("stats"),
        credentials: "include",
    }),
    endpoints: (builder) => ({
        getDashboardStats: builder.query({
            query: () => "dashboard",
        }),
    }),
});

export const { useGetDashboardStatsQuery } = statsApi;
