import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { authApi } from "../feature/api/authApi";
import { courseApi } from "../feature/api/courseApi";
import { lectureApi } from "../feature/api/lectureApi";
import { statsApi } from "../feature/api/statsApi";
import { enquiryApi } from "../feature/api/enquiryApi";

export const appStore = configureStore({
    reducer: rootReducer,
    middleware: (defaultMiddleware) =>
        defaultMiddleware().concat(authApi.middleware, courseApi.middleware, lectureApi.middleware, statsApi.middleware, enquiryApi.middleware),
});


const initializeApp = async () => {
    try {
        await appStore.dispatch(
            authApi.endpoints.loadUser.initiate({}, { forceRefetch: true })
        );
    } catch (error) {
        console.error("Failed to load user:", error);
    }
};

initializeApp();