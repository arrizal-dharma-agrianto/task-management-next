import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  isSheetOpen: false,
  sheetContent: '',
  id: '', 
};

export const uiSlice = createSlice({
  name: 'uiSlice',
  initialState,
  reducers: {
    openSheet: (state, action: PayloadAction<any>) => {
      state.isSheetOpen = action.payload.isSheetOpen || true;
      state.sheetContent = action.payload.sheetContent || '';
      state.id = action.payload.id || ''; 
    },

    closeSheet: (state) => {
      state.isSheetOpen = false;
      state.sheetContent = '';
      state.id = '';
    },
  },
});

export const { openSheet, closeSheet } = uiSlice.actions;
export default uiSlice.reducer;