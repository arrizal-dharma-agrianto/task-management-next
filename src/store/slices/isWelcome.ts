import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = false;

export const isWelcomeSlice = createSlice({
  name: 'isWelcome',
  initialState,
  reducers: {
    setIsWelcome(state, action: PayloadAction<boolean>) {
      return action.payload;
    },
    resetIsWelcome() {
      return initialState;
    },
  },
});

export const { setIsWelcome, resetIsWelcome } = isWelcomeSlice.actions;
export default isWelcomeSlice.reducer;