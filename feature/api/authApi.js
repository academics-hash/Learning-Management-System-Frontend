
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";

import { getBaseUrl } from "../../utils/apiConfig";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: getBaseUrl("user"),
        credentials: "include",
    }),
    endpoints: (builder) => ({
        // Register user
        registerUser: builder.mutation({
            query: (inputData) => ({
                url: "register",
                method: "POST",
                body: inputData,
            }),
        }),

        // Login user
        loginUser: builder.mutation({
            query: (inputData) => ({
                url: "login",
                method: "POST",
                body: inputData,
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(userLoggedIn({ user: result.data.user }));
                } catch (error) {
                    console.error("Login failed:", {
                        status: error?.status,
                        data: error?.data,
                        message: error?.message,
                        original: error
                    });
                }
            },
        }),

        // Logout user
        logoutUser: builder.mutation({
            query: () => ({
                url: "logout",
                method: "POST",
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    await queryFulfilled;
                    dispatch(userLoggedOut());
                } catch (error) {
                    console.error("Logout failed:", error);
                }
            },
        }),

        // Load currently logged-in user (used on page refresh, app init, etc.)
        loadUser: builder.query({
            query: () => ({
                url: "profile",
                method: "GET",
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(userLoggedIn({ user: result.data.user }));
                } catch (error) {
                    // Only log unexpected errors. 401 is expected when not logged in.
                    // Standardize status extraction
                    const status = error?.error?.status || error?.status;

                    // Only log unexpected errors. 401 is expected when not logged in.
                    if (status !== 401) {
                        console.error("Load user failed:", {
                            status,
                            data: error?.data,
                            message: error?.message || "Unknown error",
                            original: error
                        });
                    }
                    dispatch(userLoggedOut());
                }
            },
        }),

        // Get extra user data
        userData: builder.query({
            query: () => ({
                url: "data",
                method: "GET",
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(userLoggedIn({ user: result.data.user }));
                } catch (error) {
                    console.error("User data fetch failed:", error);
                }
            },
        }),

        // Update user profile
        updateUser: builder.mutation({
            query: (formData) => ({
                url: "profile/update",
                method: "PUT",
                body: formData,
            }),
        }),

        // Verify OTP
        verifyOtp: builder.mutation({
            query: (inputData) => ({
                url: "verify-otp",
                method: "POST",
                body: inputData,
            }),
        }),

        // Verify Email
        verifyEmail: builder.mutation({
            query: (inputData) => ({
                url: "verify-email",
                method: "POST",
                body: inputData,
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data?.user) {
                        dispatch(userLoggedIn({ user: data.user }));
                    }
                } catch (error) {
                    // Refined error logging for RTK Query
                    const errorMessage = error?.error?.data?.message || error?.data?.message || "Verification failed";
                    console.error("Verification failed Details:", {
                        status: error?.error?.status || error?.status,
                        data: error?.error?.data || error?.data,
                        message: errorMessage
                    });
                }
            },
        }),

        // Send Reset OTP
        sendResetOtp: builder.mutation({
            query: (inputData) => ({
                url: "reset-otp",
                method: "POST",
                body: inputData,
            }),
        }),

        // Reset Password
        resetPassword: builder.mutation({
            query: (inputData) => ({
                url: "reset-password",
                method: "POST",
                body: inputData,
            }),
        }),

        // Admin: Get all users
        getAllUsers: builder.query({
            query: () => ({
                url: "all",
                method: "GET",
            }),
        }),
        // Change password
        changePassword: builder.mutation({
            query: (inputData) => ({
                url: "change-password",
                method: "POST",
                body: inputData,
            }),
        }),
    }),
});

// Export hooks
export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useLoadUserQuery,
    useUpdateUserMutation,
    useUserDataQuery,
    useVerifyOtpMutation,
    useVerifyEmailMutation,
    useSendResetOtpMutation,
    useResetPasswordMutation,
    useGetAllUsersQuery,
    useChangePasswordMutation,
} = authApi;