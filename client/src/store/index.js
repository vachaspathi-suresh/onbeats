import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth";
import userSlice from "./user";

const store = configureStore({
  reducer: { auth: authSlice, user: userSlice },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
