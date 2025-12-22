import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../utils/apiConfig";

export const courseProgressApi = createApi({
    reducerPath: "courseProgressApi",
    baseQuery: fetchBaseQuery({
        baseUrl: getBaseUrl("course-progress"),
        credentials: "include",
    }),
    tagTypes: ["CourseProgress"],
    endpoints: (builder) => ({
        getCourseProgress: builder.query({
            query: (courseId) => ({
                url: `/${courseId}`,
                method: "GET",
            }),
            providesTags: ["CourseProgress"],
        }),
        updateLectureProgress: builder.mutation({
            query: ({ courseId, lectureId }) => ({
                url: `/${courseId}/lecture/${lectureId}`,
                method: "PUT",
            }),
            invalidatesTags: ["CourseProgress"],
        }),
        markAsCompleted: builder.mutation({
            query: (courseId) => ({
                url: `/${courseId}/complete`,
                method: "PUT",
            }),
            invalidatesTags: ["CourseProgress"],
        }),
        markAsInCompleted: builder.mutation({
            query: (courseId) => ({
                url: `/${courseId}/incomplete`,
                method: "PUT",
            }),
            invalidatesTags: ["CourseProgress"],
        }),
    }),
});

export const {
    useGetCourseProgressQuery,
    useUpdateLectureProgressMutation,
    useMarkAsCompletedMutation,
    useMarkAsInCompletedMutation,
} = courseProgressApi;
