import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: null,
  avatar: null,
  name: null,
  userstatus:"cmn",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsername(state, action) {
      state.username = action.payload;
    },
    setAvatar(state, action) {
      state.avatar = action.payload;
    },
    setName(state, action) {
      state.name = action.payload;
    },
    setStatus(state, action) {
      state.userstatus = action.payload;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
