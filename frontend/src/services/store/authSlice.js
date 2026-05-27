import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiRequest from "../api/index";

const initialState = {
  isAuthenticating : true,
  user: null
}

export const checkAuth = createAsyncThunk("auth/checkAuth", async (_, thunkAPI) => {
  try {
    const data = await apiRequest.get("/v1/auth/me"); 
    return data.user; 
  } catch (error) {
    console.log(error.message)
    return thunkAPI.rejectWithValue(null);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin : (state, action) => {
      state.user = action.payload;
    },
    setIsAuthenticating: (state, action) => {
      state.isAuthenticating = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isAuthenticating = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticating = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.isAuthenticating = false;
      });
  },
})

export const { setLogin, setIsAuthenticating} = authSlice.actions;
export default authSlice.reducer;