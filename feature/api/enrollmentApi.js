import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../utils/apiConfig";

export const enrollmentApi = createApi({
    reducerPath: "enrollmentApi",
    baseQuery: fetchBaseQuery({
        baseUrl: getBaseUrl("enrollment"),
        credentials: "include",
    }),
    tagTypes: ["Enrollment", "Course"],

    endpoints: (builder) => ({
        // Student: Get my enrolled courses
        getMyEnrolledCourses: builder.query({
            query: () => ({
                url: "my-courses",
                method: "GET",
            }),
            providesTags: ["Enrollment"],
        }),

        // STUDENT: Check if I have access to a course
        checkCourseAccess: builder.query({
            query: (courseId) => ({
                url: `check-access/${courseId}`,
                method: "GET",
            }),
            providesTags: (result, error, courseId) => [{ type: "Enrollment", id: courseId }],
        }),

        // STUDENT: Enroll in a free course
        enrollInFreeCourse: builder.mutation({
            query: (courseId) => ({
                url: `enroll-free/${courseId}`,
                method: "POST",
            }),
            invalidatesTags: (result, error, courseId) => [
                "Enrollment",
                { type: "Enrollment", id: courseId },
                { type: "Course", id: courseId },
            ],

        }),

        // ADMIN: Grant course access to a student
        grantCourseAccess: builder.mutation({
            query: (data) => ({
                url: "grant",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Enrollment"],
        }),

        // ADMIN: Revoke course access
        revokeCourseAccess: builder.mutation({
            query: (enrollmentId) => ({
                url: `revoke/${enrollmentId}`,
                method: "PATCH",
            }),
            invalidatesTags: ["Enrollment"],
        }),
        // ADMIN: Get all enrollments
        getAllEnrollments: builder.query({
            query: () => ({
                url: "all",
                method: "GET",
            }),
            providesTags: ["Enrollment"],
        }),
    }),
});

export const {
    useGetMyEnrolledCoursesQuery,
    useCheckCourseAccessQuery,
    useEnrollInFreeCourseMutation,
    useGrantCourseAccessMutation,
    useRevokeCourseAccessMutation,
    useGetAllEnrollmentsQuery,
} = enrollmentApi;

