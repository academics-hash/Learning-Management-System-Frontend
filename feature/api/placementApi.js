import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../utils/apiConfig";

export const placementApi = createApi({
    reducerPath: "placementApi",
    baseQuery: fetchBaseQuery({
        baseUrl: getBaseUrl("placement"),
        credentials: "include",
    }),
    tagTypes: ["Placement"],
    endpoints: (builder) => ({
        getAllPlacements: builder.query({
            query: () => "all",
            providesTags: ["Placement"],
        }),
        createPlacement: builder.mutation({
            query: (formData) => ({
                url: "create",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Placement"],
        }),
        deletePlacement: builder.mutation({
            query: (id) => ({
                url: `delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Placement"],
        }),
    }),
});

export const {
    useGetAllPlacementsQuery,
    useCreatePlacementMutation,
    useDeletePlacementMutation,
} = placementApi;
