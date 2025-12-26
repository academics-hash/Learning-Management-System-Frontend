
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../utils/apiConfig";

export const articleApi = createApi({
    reducerPath: "articleApi",
    baseQuery: fetchBaseQuery({
        baseUrl: getBaseUrl("article"),
        credentials: "include",
    }),
    tagTypes: ["Article"],
    endpoints: (builder) => ({
        // Create a new article
        createArticle: builder.mutation({
            query: (formData) => ({
                url: "/",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Article"],
        }),

        // Get all articles (with pagination and filters)
        getAllArticles: builder.query({
            query: ({ page = 1, limit = 10, category, isPublished, search } = {}) => {
                let params = new URLSearchParams({ page, limit });
                if (category) params.append("category", category);
                if (isPublished !== undefined) params.append("isPublished", isPublished);
                if (search) params.append("search", search);
                return `?${params.toString()}`;
            },
            providesTags: ["Article"],
        }),

        // Get single article by slug
        getArticleBySlug: builder.query({
            query: (slug) => `/${slug}`,
            providesTags: (result, error, slug) => [{ type: "Article", id: slug }],
        }),

        // Get single article by ID (for editing)
        getArticleById: builder.query({
            query: (id) => `/id/${id}`,
            providesTags: (result, error, id) => [{ type: "Article", id }],
        }),

        // Update article
        updateArticle: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/${id}`,
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: (result, error, { id }) => ["Article"],
        }),

        // Delete article
        deleteArticle: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Article"],
        }),
    }),
});

// Export hooks for usage in functional components
export const {
    useCreateArticleMutation,
    useGetAllArticlesQuery,
    useGetArticleBySlugQuery,
    useGetArticleByIdQuery,
    useUpdateArticleMutation,
    useDeleteArticleMutation,
} = articleApi;
