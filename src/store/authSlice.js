import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('ytclone_user')) || null,
    token: localStorage.getItem('ytclone_token') || null,
  },
  reducers: {
    loginUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('ytclone_user', JSON.stringify(action.payload.user));
      localStorage.setItem('ytclone_token', action.payload.token);
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('ytclone_user');
      localStorage.removeItem('ytclone_token');
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('ytclone_user', JSON.stringify(action.payload));
    }
  }
});

export const { loginUser, logoutUser, updateUser } = authSlice.actions;
export default authSlice.reducer;
