import { authApi } from "../feature/api/authApi";
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../feature/authSlice";
import { courseApi } from "../feature/api/courseApi";
import { lectureApi } from "../feature/api/lectureApi";
import { statsApi } from "../feature/api/statsApi";
import { enquiryApi } from "../feature/api/enquiryApi";
import { superadminApi } from "../feature/api/superadminApi";
import { placementApi } from "../feature/api/placementApi";
import { courseProgressApi } from "../feature/api/courseprogressApi";
import { enrollmentApi } from "../feature/api/enrollmentApi";
import { articleApi } from "../feature/api/articleApi";
import { contactUsApi } from "../feature/api/contactusApi";




const rootReducer = combineReducers({

    [authApi.reducerPath]: authApi.reducer,
    [courseApi.reducerPath]: courseApi.reducer,
    [lectureApi.reducerPath]: lectureApi.reducer,
    [statsApi.reducerPath]: statsApi.reducer,
    [enquiryApi.reducerPath]: enquiryApi.reducer,
    [superadminApi.reducerPath]: superadminApi.reducer,
    [placementApi.reducerPath]: placementApi.reducer,
    [courseProgressApi.reducerPath]: courseProgressApi.reducer,
    [enrollmentApi.reducerPath]: enrollmentApi.reducer,
    [articleApi.reducerPath]: articleApi.reducer,
    [contactUsApi.reducerPath]: contactUsApi.reducer,


    auth: authReducer,
});

export default rootReducer;