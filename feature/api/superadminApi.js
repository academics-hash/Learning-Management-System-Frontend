import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../utils/apiConfig";

export const superadminApi = createApi({
    reducerPath: "superadminApi",
    baseQuery: fetchBaseQuery({
        baseUrl: getBaseUrl("user"),
        credentials: "include",
    }),
    tagTypes: ["AdminMentor", "AdminCourse"],
    endpoints: (builder) => ({
        // Super Admin: Create Admin or Mentor
        createAdminOrMentor: builder.mutation({
            query: (userData) => ({
                url: "create-admin-mentor",
                method: "POST",
                body: userData,
            }),
            invalidatesTags: ["AdminMentor"],
        }),

        // Admin/Super Admin: Get all admins and mentors
        getAdminsAndMentors: builder.query({
            query: () => ({
                url: "admins-mentors",
                method: "GET",
            }),
            providesTags: ["AdminMentor"],
        }),

        // Admin/Super Admin: Delete Admin or Mentor
        deleteAdminOrMentor: builder.mutation({
            query: (id) => ({
                url: `delete-admin-mentor/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["AdminMentor"],
        }),

        // Admin/Super Admin: Get all courses (including unpublished)
        getAdminCourses: builder.query({
            query: () => ({
                url: getBaseUrl("course") + "all-courses",
                method: "GET",
            }),
            providesTags: ["AdminCourse"],
        }),
    }),
});

export const {
    useCreateAdminOrMentorMutation,
    useGetAdminsAndMentorsQuery,
    useDeleteAdminOrMentorMutation,
    useGetAdminCoursesQuery,
} = superadminApi;
