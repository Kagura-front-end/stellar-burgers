import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { TOrder } from '../../utils/types';
import { getPublicFeedApi } from '../../utils/burger-api';

// ---- Types ----
export type PublicOrdersState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  connected: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: PublicOrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  connected: false,
  loading: false,
  error: null,
};

// HTTP fallback (also used to prefill UI)
export const loadPublicFeed = createAsyncThunk(
  'publicOrders/load',
  async () => await getPublicFeedApi(),
);

// ---- Slice ----
const slice = createSlice({
  name: 'publicOrders',
  initialState,
  reducers: {
    connect: (_state, _action: PayloadAction<string>) => {},
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
    // WS message payload: { success, orders, total, totalToday }
    onMessage: (
      state,
      action: PayloadAction<{ orders?: TOrder[]; total?: number; totalToday?: number } | any>,
    ) => {
      const p = action.payload ?? {};
      if (Array.isArray(p.orders)) state.orders = p.orders;
      if (typeof p.total === 'number') state.total = p.total;
      if (typeof p.totalToday === 'number') state.totalToday = p.totalToday;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadPublicFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadPublicFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(loadPublicFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message ?? 'Failed to load feed';
      });
  },
});

export const publicOrdersReducer = slice.reducer;
export const publicOrdersActions = slice.actions;

// ---- Selectors ----
export const selectPublicOrders = (s: RootState) => s.publicOrders.orders;
export const selectPublicTotal = (s: RootState) => s.publicOrders.total;
export const selectPublicTotalToday = (s: RootState) => s.publicOrders.totalToday;
export const selectPublicConnected = (s: RootState) => s.publicOrders.connected;
export const selectPublicLoading = (s: RootState) => s.publicOrders.loading;

export const selectPublicReadyNumbers = (s: RootState) =>
  s.publicOrders.orders
    .filter((o) => o.status === 'done')
    .map((o) => o.number)
    .slice(0, 20);

export const selectPublicPendingNumbers = (s: RootState) =>
  s.publicOrders.orders
    .filter((o) => o.status !== 'done')
    .map((o) => o.number)
    .slice(0, 20);
