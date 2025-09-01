// src/services/orders/publicOrders.slice.ts
import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { TOrder } from '../../utils/types';

// ----- State types -----
type PublicOrdersState = {
  list: TOrder[];
  total: number;
  totalToday: number;
  connected: boolean;
};

type WSFeed = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

// ----- Initial state -----
const initialState: PublicOrdersState = {
  list: [],
  total: 0,
  totalToday: 0,
  connected: false,
};

// ----- Slice -----
const slice = createSlice({
  name: 'publicOrders',
  initialState,
  reducers: {
    connect: (_s, _a: PayloadAction<string>) => {},
    disconnect: () => {},
    onOpen: (s) => {
      s.connected = true;
    },
    onClose: (s) => {
      s.connected = false;
    },
    onMessage: (s, a: PayloadAction<WSFeed>) => {
      s.list = a.payload.orders;
      s.total = a.payload.total;
      s.totalToday = a.payload.totalToday;
    },
    onError: () => {},
  },
});

export const publicOrdersActions = slice.actions;
export default slice.reducer;

// ----- Selectors -----
export const selectPublicOrders = (s: RootState): TOrder[] => s.publicOrders.list;
export const selectPublicConnected = (s: RootState): boolean => s.publicOrders.connected;

export const selectPublicTotals = createSelector(
  (s: RootState) => s.publicOrders.total,
  (s: RootState) => s.publicOrders.totalToday,
  (total: number, totalToday: number): { total: number; totalToday: number } => ({
    total,
    totalToday,
  }),
);

export const selectPublicReadyNumbers = createSelector(
  selectPublicOrders,
  (list: TOrder[]): number[] =>
    list
      .filter((o: TOrder) => o.status === 'done') // API uses 'done' for completed
      .slice(0, 10)
      .map((o: TOrder) => o.number),
);

export const selectPublicPendingNumbers = createSelector(
  selectPublicOrders,
  (list: TOrder[]): number[] =>
    list
      .filter((o: TOrder) => o.status !== 'done')
      .slice(0, 10)
      .map((o: TOrder) => o.number),
);
