import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { TOrder } from '../../utils/types';

type WSData = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

type PublicOrdersState = {
  list: TOrder[];
  total: number;
  totalToday: number;
  connected: boolean;
  error: string | null;
};

const initialState: PublicOrdersState = {
  list: [],
  total: 0,
  totalToday: 0,
  connected: false,
  error: null,
};

const slice = createSlice({
  name: 'publicOrders',
  initialState,
  reducers: {
    // action shells used only by middleware
    connect: (_s, _a: PayloadAction<string>) => {},
    disconnect: () => {},

    onOpen: (state) => {
      state.connected = true;
      state.error = null;
    },
    onClose: (state) => {
      state.connected = false;
    },
    onError: (state, action: PayloadAction<string | undefined>) => {
      state.error = action.payload ?? 'ws error';
    },

    onMessage: (state, action: PayloadAction<WSData>) => {
      // IMPORTANT: replace, don't append
      const { orders, total, totalToday } = action.payload ?? ({} as WSData);
      state.list = Array.isArray(orders) ? orders : [];
      state.total = total ?? 0;
      state.totalToday = totalToday ?? 0;
    },
  },
});

export const publicOrdersReducer = slice.reducer;
export const publicOrdersActions = slice.actions;

// -------- selectors ----------
export const selectPublicOrders = (s: RootState) => s.publicOrders.list;
export const selectPublicTotals = (s: RootState) => ({
  total: s.publicOrders.total,
  totalToday: s.publicOrders.totalToday,
});
export const selectPublicReadyNumbers = (s: RootState) =>
  s.publicOrders.list
    .filter((o) => o.status === 'done')
    .slice(0, 10)
    .map((o) => o.number);

export const selectPublicPendingNumbers = (s: RootState) =>
  s.publicOrders.list
    .filter((o) => o.status !== 'done')
    .slice(0, 10)
    .map((o) => o.number);
