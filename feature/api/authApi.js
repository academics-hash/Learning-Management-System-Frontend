
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
                    console.error("Login failed:", error);
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
                    if (error?.error?.status !== 401 && error?.status !== 401) {
                        console.error("Load user failed:", error);
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