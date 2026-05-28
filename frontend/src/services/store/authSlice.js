import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiRequest from "../api/index";

const initialState = {
  isAuthenticating : true,
  isAuthenticated: false,
  user: null
}

export const checkAuth = createAsyncThunk("auth/checkAuth", async (_, thunkAPI) => {
  try {
    const data = await apiRequest.get("/v1/auth/me"); 
    return data.user; 
  } catch (error) {
    return thunkAPI.rejectWithValue(null);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser : (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logoutUser : (state, action) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setIsAuthenticated : (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setUser : (state, action) => {
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
        state.isAuthenticated = true;
        state.isAuthenticating = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.isAuthenticating = false;
      });
  },
})

export const { setUser, setIsAuthenticating, loginUser, setIsAuthenticated, logoutUser} = authSlice.actions;
export default authSlice.reducer;