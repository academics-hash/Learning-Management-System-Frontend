import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const courseApi = createApi({
    reducerPath: "courseApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8080/api/v1/course/",
        credentials: "include",
    }),
    tagTypes: ["Course", "CreatorCourse"],
    endpoints: (builder) => ({
        // Create a new course
        createCourse: builder.mutation({
            query: (inputData) => ({
                url: "create",
                method: "POST",
                body: inputData,
            }),
            invalidatesTags: ["Course", "CreatorCourse"],
        }),

        // Get courses created by the instructor/admin
        getCreatorCourses: builder.query({
            query: () => ({
                url: "creator",
                method: "GET",
            }),
            providesTags: ["CreatorCourse"],
        }),

        // Edit course details using FormData (for image upload)
        editCourse: builder.mutation({
            query: ({ courseId, formData }) => ({
                url: `edit/${courseId}`,
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: (result, error, { courseId }) => [
                { type: "Course", id: courseId },
                "CreatorCourse",
            ],
        }),

        // Fetch a single course by ID
        getCourseById: builder.query({
            query: (courseId) => ({
                url: `${courseId}`,
                method: "GET",
            }),
            providesTags: (result, error, courseId) => [{ type: "Course", id: courseId }],
        }),

        // Toggle Publish Status
        togglePublishCourse: builder.mutation({
            query: ({ courseId, publish }) => ({
                url: `publish/${courseId}`,
                method: "PATCH",
                body: { publish },
            }),
            invalidatesTags: (result, error, { courseId }) => [
                { type: "Course", id: courseId },
                "CreatorCourse",
            ],
        }),

        // Public: Get all published courses
        getPublishedCourses: builder.query({
            query: () => ({
                url: "published-course",
                method: "GET",
            }),
        }),

        // Search courses
        searchCourses: builder.query({
            query: ({ query = "", categories = "", sortByPrice = "" }) => ({
                url: `search?query=${query}&categories=${categories}&sortByPrice=${sortByPrice}`,
                method: "GET",
            }),
        }),

        // Student: Get free courses
        getFreeCourses: builder.query({
            query: () => ({
                url: "free-courses",
                method: "GET",
            })
        }),

        // Student: Get paid courses
        getPaidCourses: builder.query({
            query: () => ({
                url: "paid-courses",
                method: "GET",
            })
        }),

        // Student: Get course content (limited/full based on enrollment)
        getCourseContent: builder.query({
            query: (courseId) => ({
                url: `${courseId}/content`,
                method: "GET",
            })
        }),

        // Student: Get FULL course content (requires auth + enrollment)
        getCourseFullContent: builder.query({
            query: (courseId) => ({
                url: `${courseId}/full-content`,
                method: "GET",
            })
        }),

    }),
});

export const {
    useCreateCourseMutation,
    useGetCreatorCoursesQuery,
    useEditCourseMutation,
    useGetCourseByIdQuery,
    useTogglePublishCourseMutation,
    useGetPublishedCoursesQuery,
    useSearchCoursesQuery,
    useGetFreeCoursesQuery,
    useGetPaidCoursesQuery,
    useGetCourseContentQuery,
    useGetCourseFullContentQuery
} = courseApi;
