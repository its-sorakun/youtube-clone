import { createSlice } from '@reduxjs/toolkit';

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: {
    isExpanded: true,
  },
  reducers: {
    toggleSidebar: (state) => {
      state.isExpanded = !state.isExpanded;
    },
    setSidebarExpanded: (state, action) => {
      state.isExpanded = action.payload;
    }
  }
});

export const { toggleSidebar, setSidebarExpanded } = sidebarSlice.actions;
export default sidebarSlice.reducer;
