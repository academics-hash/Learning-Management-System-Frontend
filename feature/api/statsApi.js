import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const statsApi = createApi({
    reducerPath: "statsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8080/api/v1/stats/",
        credentials: "include",
    }),
    endpoints: (builder) => ({
        getDashboardStats: builder.query({
            query: () => "dashboard",
        }),
    }),
});

export const { useGetDashboardStatsQuery } = statsApi;
