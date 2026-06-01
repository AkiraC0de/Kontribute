import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  user: {
    username: "",
    firstName: "",
    lastName: "",
    sex: ""
  }
};

const accountSetUpSlice = createSlice({
  name: "accountSetUp",
  initialState, 
  reducers: {
    setUsername: (state, action) => {
      state.user.username = action.payload;
    },
    setFirstName: (state, action) => {
      state.user.firstName = action.payload;
    },
    setLastName: (state, action) => {
      state.user.lastName = action.payload;
    },
    setSex: (state, action) => {
      state.user.sex = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    }
  }
});

export const { 
  setUsername, 
  setFirstName, 
  setLastName, 
  setSex, 
  setIsLoading, 
  resetForm 
} = accountSetUpSlice.actions;

export default accountSetUpSlice.reducer;