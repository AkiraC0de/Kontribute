import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  isLoading : true,
  user: null
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser : (state, action) => {

    },
  }
})

export default authSlice.reducer;