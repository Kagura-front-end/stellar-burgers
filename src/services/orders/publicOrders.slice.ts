import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
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

// --- SELECTORS (memoized) ---
export const selectPublicOrdersState = (s: RootState) => s.publicOrders;

// Orders array (stable reference)
export const selectPublicOrders = createSelector(
  [selectPublicOrdersState],
  (state) => state.orders,
);

// Numbers for the right column (primitives: no rerender issues)
export const selectPublicTotal = createSelector([selectPublicOrdersState], (state) => state.total);

export const selectPublicTotalToday = createSelector(
  [selectPublicOrdersState],
  (state) => state.totalToday,
);

// Combined totals object (memoized)
export const selectPublicTotals = createSelector(
  [selectPublicTotal, selectPublicTotalToday],
  (total, totalToday) => ({ total, totalToday }),
);

// Ready/pending number lists (arrays, but memoized)
export const selectPublicReadyNumbers = createSelector([selectPublicOrders], (orders) =>
  orders.filter((o: TOrder) => o.status === 'done').map((o) => o.number),
);

export const selectPublicPendingNumbers = createSelector([selectPublicOrders], (orders) =>
  orders.filter((o: TOrder) => o.status === 'pending').map((o) => o.number),
);

// Connection status and error
export const selectPublicConnected = (s: RootState) => s.publicOrders.connected;
export const selectPublicError = (s: RootState) => s.publicOrders.error;
