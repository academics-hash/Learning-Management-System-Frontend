import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../utils/apiConfig";

export const contactUsApi = createApi({
    reducerPath: "contactUsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: getBaseUrl("contact"),
        credentials: "include",
    }),
    tagTypes: ["ContactUs"],
    endpoints: (builder) => ({
        // Create a new contact message
        createContact: builder.mutation({
            query: (data) => ({
                url: "/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["ContactUs"],
        }),

        // Get all contact messages
        getAllContacts: builder.query({
            query: () => "/",
            providesTags: ["ContactUs"],
        }),
    }),
});

export const {
    useCreateContactMutation,
    useGetAllContactsQuery,
} = contactUsApi;
