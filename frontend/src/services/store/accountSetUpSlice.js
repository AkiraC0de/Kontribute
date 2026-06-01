import { createSlice } from "@reduxjs/toolkit";

const initialState = {
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
    setUser : (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload
      }
    },
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
    }
  }
});

export const { 
  setUsername, 
  setFirstName, 
  setLastName, 
  setSex, 
  setUser,
} = accountSetUpSlice.actions;

export default accountSetUpSlice.reducer;