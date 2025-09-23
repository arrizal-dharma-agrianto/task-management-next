import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import navigationReducer from './slices/navigationSlice';
import isWelcomeReducer from './slices/isWelcome';
import breadcrumbReducer from './slices/position';
import uiSlice from './slices/uiSlice';
import  notifSlice from './slices/notifSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    navigation: navigationReducer,
    isWelcome: isWelcomeReducer,
    breadcumb: breadcrumbReducer,
    ui: uiSlice,
    notif: notifSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;