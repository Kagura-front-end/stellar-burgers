import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { TOrder } from '@utils-types';

type PublicOrdersState = {
  connected: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
  error?: string | null;
};

const initialState: PublicOrdersState = {
  connected: false,
  orders: [],
  total: 0,
  totalToday: 0,
  error: null,
};

const publicOrdersSlice = createSlice({
  name: 'publicOrders',
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
    onMessage: (
      state,
      action: PayloadAction<{ orders: TOrder[]; total: number; totalToday: number }>,
    ) => {
      state.orders = action.payload.orders ?? [];
      state.total = action.payload.total ?? 0;
      state.totalToday = action.payload.totalToday ?? 0;
    },
  },
});

export const { reducer: publicOrdersReducer, actions: publicOrdersActions } = publicOrdersSlice;

export const selectPublicOrders = (s: RootState) => s.publicOrders.orders;
export const selectPublicTotals = (s: RootState) => ({
  total: s.publicOrders.total,
  totalToday: s.publicOrders.totalToday,
});
export const selectPublicConnected = (s: RootState) => s.publicOrders.connected;
export const selectPublicError = (s: RootState) => s.publicOrders.error;
