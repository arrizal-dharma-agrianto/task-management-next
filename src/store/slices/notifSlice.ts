import { getNotifications, getNotificationsCount } from '@/service/notification';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { get } from 'http';

const initialState: any[] | any = null;

export const notifSlice = createSlice({
  name: 'notif',
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<any[]>) {
      return action.payload;
    },
    addNotification(state, action: PayloadAction<any>) {
      return [action.payload, ...state];
    },
    removeNotification(state, action: PayloadAction<string>) {
      return state.filter((notif: { id: string; }) => notif.id !== action.payload);
    },
    getNotifications(state, action: PayloadAction<any[]>) {
      const notifications = getNotifications();
      return notifications;
    },
    getNotificationsCount(state, action: PayloadAction<any[]>) {
      const count = state.filter((notif: { read: boolean; }) => !notif.read).length;
      return count;
    },
    reduceNotification(state, action: PayloadAction<string>) {
      const notification = state.find((notif: { id: string; }) => notif.id === action.payload);
      if (notification) {
        notification.read = true;
      }
      return state;
    },
  },
});

export const { setNotifications, addNotification, removeNotification, reduceNotification } = notifSlice.actions;
export default notifSlice.reducer;

