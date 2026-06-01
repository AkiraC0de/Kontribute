import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import accountSetUpReducer from "./accountSetUpSlice";

const store = configureStore({
  reducer: {
    auth: authReducer ,
    accountSetUp: accountSetUpReducer,
  }
})

export default store;