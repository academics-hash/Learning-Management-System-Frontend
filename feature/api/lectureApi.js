import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const lectureApi = createApi({
    reducerPath: "lectureApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8080/api/v1/video/",
        credentials: "include",
    }),
    tagTypes: ["Lecture", "CourseLecture"],
    endpoints: (builder) => ({
        // Create a new lecture
        createLecture: builder.mutation({
            query: (formData) => ({
                url: "lecture",
                method: "POST",
                body: formData,
                // Don't set Content-Type - let browser set it with boundary for FormData
                formData: true,
            }),
            invalidatesTags: ["CourseLecture", "Lecture"],
        }),

        // Get lectures for a course
        getCourseLectures: builder.query({
            query: (courseId) => ({
                url: `${courseId}/lecture`,
                method: "GET",
            }),
            providesTags: (result, error, courseId) => [{ type: "CourseLecture", id: courseId }],
        }),

        // Edit lecture
        editLecture: builder.mutation({
            query: ({ courseId, lectureId, formData }) => ({
                url: `${courseId}/lecture/${lectureId}`,
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: (result, error, { courseId }) => [
                { type: "CourseLecture", id: courseId },
                "Lecture"
            ],
        }),

        // Get lecture by ID (admin)
        getLectureById: builder.query({
            query: (lectureId) => ({
                url: `lecture/${lectureId}`,
                method: "GET",
            }),
            providesTags: (result, error, lectureId) => [{ type: "Lecture", id: lectureId }],
        }),

        // Delete lecture
        getLectures: builder.query({
            query: () => ({
                url: "lecture",
                method: "GET",
            }),
            providesTags: ["Lecture", "CourseLecture"],
        }),
        removeLecture: builder.mutation({
            query: (lectureId) => ({
                url: `lecture/${lectureId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["CourseLecture", "Lecture"],
        }),

        // Reorder lectures (drag and drop)
        reorderLectures: builder.mutation({
            query: (lectureOrders) => ({
                url: "lecture/reorder",
                method: "PUT",
                body: { lectureOrders },
            }),
            invalidatesTags: ["CourseLecture"],
        }),

        // Rename section (folder)
        renameSection: builder.mutation({
            query: ({ courseId, oldSection, newSection }) => ({
                url: `${courseId}/section/rename`,
                method: "PUT",
                body: { oldSection, newSection },
            }),
            invalidatesTags: (result, error, { courseId }) => [
                { type: "CourseLecture", id: courseId },
            ],
        }),

        // Delete section (folder) and all its lectures
        deleteSection: builder.mutation({
            query: ({ courseId, sectionName }) => ({
                url: `${courseId}/section/delete`,
                method: "POST",
                body: { sectionName },
            }),
            invalidatesTags: (result, error, { courseId }) => [
                { type: "CourseLecture", id: courseId },
                "Lecture",
            ],
        }),
    }),
});

export const {
    useCreateLectureMutation,
    useGetCourseLecturesQuery,
    useEditLectureMutation,
    useGetLectureByIdQuery,
    useRemoveLectureMutation,
    useGetLecturesQuery,
    useReorderLecturesMutation,
    useRenameSectionMutation,
    useDeleteSectionMutation,
} = lectureApi;
