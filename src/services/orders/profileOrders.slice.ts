import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { TOrder } from '@utils-types';

type ProfileOrdersState = {
  connected: boolean;
  orders: TOrder[];
  error?: string | null;
};

const initialState: ProfileOrdersState = {
  connected: false,
  orders: [],
  error: null,
};

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    connect: (_s, _a: PayloadAction<string>) => {},
    disconnect: () => {},
    onOpen: (state) => {
      state.connected = true;
      state.error = null;
    },
    onClose: (state) => {
      state.connected = false;
    },
    onError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    onMessage: (state, action: PayloadAction<{ orders: TOrder[] }>) => {
      state.orders = action.payload.orders ?? [];
    },
  },
});

export const { reducer: profileOrdersReducer, actions: profileOrdersActions } = profileOrdersSlice;

export const selectProfileOrders = (s: RootState) => s.profileOrders.orders;
export const selectProfileConnected = (s: RootState) => s.profileOrders.connected;
export const selectProfileError = (s: RootState) => s.profileOrders.error;
