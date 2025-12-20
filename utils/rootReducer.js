import { authApi } from "../feature/api/authApi";
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../feature/authSlice";
import { courseApi } from "../feature/api/courseApi";
import { lectureApi } from "../feature/api/lectureApi";
import { statsApi } from "../feature/api/statsApi";
import { enquiryApi } from "../feature/api/enquiryApi";


const rootReducer = combineReducers({

    [authApi.reducerPath]: authApi.reducer,
    [courseApi.reducerPath]: courseApi.reducer,
    [lectureApi.reducerPath]: lectureApi.reducer,
    [statsApi.reducerPath]: statsApi.reducer,
    [enquiryApi.reducerPath]: enquiryApi.reducer,
    auth: authReducer,
});

export default rootReducer;