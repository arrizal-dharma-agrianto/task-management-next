import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: UserProps = {
  id: '',
  name: '',
  email: '',
  avatar: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserProps>) {
      return action.payload;
    },
    resetUser() {
      return initialState;
    },
  },
});

export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
