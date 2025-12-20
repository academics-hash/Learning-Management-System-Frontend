import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const enquiryApi = createApi({
    reducerPath: "enquiryApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8080/api/v1/enquiry/",
        credentials: "include",
    }),
    tagTypes: ["Enquiry"],
    endpoints: (builder) => ({
        // Public: Submit enquiry
        submitEnquiry: builder.mutation({
            query: (enquiryData) => ({
                url: "",
                method: "POST",
                body: enquiryData,
            }),
            invalidatesTags: ["Enquiry"],
        }),

        // Admin: Get all enquiries with pagination and filtering
        getAllEnquiries: builder.query({
            query: ({ status, page = 1, limit = 10 } = {}) => {
                const params = new URLSearchParams();
                if (status) params.append("status", status);
                params.append("page", page);
                params.append("limit", limit);
                return `?${params.toString()}`;
            },
            providesTags: ["Enquiry"],
        }),

        // Admin: Get single enquiry by ID
        getEnquiryById: builder.query({
            query: (id) => `${id}`,
            providesTags: (result, error, id) => [{ type: "Enquiry", id }],
        }),

        // Admin: Update enquiry status and notes
        updateEnquiry: builder.mutation({
            query: ({ id, ...updateData }) => ({
                url: `${id}`,
                method: "PUT",
                body: updateData,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Enquiry", id },
                "Enquiry",
            ],
        }),

        // Admin: Delete enquiry
        deleteEnquiry: builder.mutation({
            query: (id) => ({
                url: `${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Enquiry"],
        }),

        // Admin: Get enquiry statistics
        getEnquiryStats: builder.query({
            query: () => "stats",
            providesTags: ["Enquiry"],
        }),
        // Admin: Get enquiry trend for last 7 days
        getEnquiryTrend: builder.query({
            query: () => "trend",
            providesTags: ["Enquiry"],
        }),
    }),
});

// Export hooks
export const {
    useSubmitEnquiryMutation,
    useGetAllEnquiriesQuery,
    useGetEnquiryByIdQuery,
    useUpdateEnquiryMutation,
    useDeleteEnquiryMutation,
    useGetEnquiryStatsQuery,
    useGetEnquiryTrendQuery,
} = enquiryApi;
