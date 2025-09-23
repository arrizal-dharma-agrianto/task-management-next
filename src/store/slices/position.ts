import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { JSX } from 'react';

interface Breadcrumb {
  name: string;
  id: string;
  url: string;
}

interface BreadcrumbState {
  breadcrumbs: Breadcrumb[];
}

const initialState: BreadcrumbState = {
  breadcrumbs: [],
};

const breadcrumbSlice = createSlice({
  name: 'breadcrumb',
  initialState,
  reducers: {
    setBreadcrumbs(state, action: PayloadAction<Breadcrumb[]>) {
      state.breadcrumbs = action.payload;
    },
    addBreadcrumb(state, action: PayloadAction<Breadcrumb>) {
      state.breadcrumbs.push(action.payload);
    },
    clearBreadcrumbs(state) {
      state.breadcrumbs = [];
    },
  },
});

export const { setBreadcrumbs, addBreadcrumb, clearBreadcrumbs } = breadcrumbSlice.actions;
export default breadcrumbSlice.reducer;