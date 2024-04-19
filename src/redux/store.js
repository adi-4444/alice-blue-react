import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import dematReducer from './features/demat/dematSlice'

export const store = configureStore({
   reducer: {
      auth: authReducer,
      demat: dematReducer,
   }
})

