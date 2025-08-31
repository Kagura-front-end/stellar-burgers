import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import type { TOrder } from '@utils-types';
import type { RootState } from '../store';

type FeedPayload = {
  success?: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
};

type State = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  connected: boolean;
  error: string | null;
};

const initialState: State = {
  orders: [],
  total: 0,
  totalToday: 0,
  connected: false,
  error: null,
};

const slice = createSlice({
  name: 'publicOrders',
  initialState,
  reducers: {
    // websocket control
    connect: (state, _action: PayloadAction<string>) => state,
    disconnect: (state) => state,

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

    // main update (WS or HTTP fallback both dispatch this)
    onMessage: (state, action: PayloadAction<FeedPayload>) => {
      const { orders, total, totalToday } = action.payload;
      state.orders = orders ?? [];
      state.total = total ?? 0;
      state.totalToday = totalToday ?? 0;
    },

    // explicit hydrate for HTTP fallback (same as onMessage, kept for clarity)
    hydrate: (state, action: PayloadAction<FeedPayload>) => {
      const { orders, total, totalToday } = action.payload;
      state.orders = orders ?? [];
      state.total = total ?? 0;
      state.totalToday = totalToday ?? 0;
    },
  },
});

export const publicOrdersReducer = slice.reducer;
export const publicOrdersActions = slice.actions;

/* ---------- Selectors ---------- */
export const selectPublicOrders = (s: RootState) => s.publicOrders.orders;
export const selectPublicTotal = (s: RootState) => s.publicOrders.total;
export const selectPublicTotalToday = (s: RootState) => s.publicOrders.totalToday;
export const selectPublicConnected = (s: RootState) => s.publicOrders.connected;

export const selectPublicReadyNumbers = createSelector(selectPublicOrders, (orders) =>
  orders
    .filter((o) => o.status === 'done')
    .slice(0, 10)
    .map((o) => o.number),
);

export const selectPublicPendingNumbers = createSelector(selectPublicOrders, (orders) =>
  orders
    .filter((o) => o.status !== 'done')
    .slice(0, 10)
    .map((o) => o.number),
);
