import { createAsyncThunk, createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { TOrder } from '../../utils/types';
import { getFeedsApi } from '../../utils/burger-api';
import type { TFeedsResponse } from '../../utils/burger-api';

type PublicOrdersState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
};

const initialState: PublicOrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null,
};

// REST thunk (loads the whole feed once)
export const fetchFeeds = createAsyncThunk<TFeedsResponse>(
  'publicOrders/fetchFeeds',
  async () => await getFeedsApi(),
);

const slice = createSlice({
  name: 'publicOrders',
  initialState,
  reducers: {
    clear(state) {
      state.orders = [];
      state.total = 0;
      state.totalToday = 0;
      state.error = null;
    },
    // Keep WS actions as no-op for backward compatibility (temporarily)
    connect: (_s, _a: PayloadAction<string>) => {},
    disconnect: () => {},
    onOpen: (s) => {
      s.loading = false;
    },
    onClose: (s) => {
      s.loading = false;
    },
    onMessage: (s, a: PayloadAction<{ orders: TOrder[]; total: number; totalToday: number }>) => {
      s.orders = a.payload.orders;
      s.total = a.payload.total;
      s.totalToday = a.payload.totalToday;
    },
    onError: (s, a: PayloadAction<string>) => {
      s.error = a.payload;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchFeeds.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchFeeds.fulfilled, (s, a: PayloadAction<TFeedsResponse>) => {
      s.loading = false;
      s.orders = a.payload.orders;
      s.total = a.payload.total;
      s.totalToday = a.payload.totalToday;
    });
    b.addCase(fetchFeeds.rejected, (s, a) => {
      s.loading = false;
      s.error = a.error.message ?? 'Failed to load feed';
    });
  },
});

export const { reducer: publicOrdersReducer, actions: publicOrdersActions } = slice;

// Base selectors (pure reads, no allocation)
const selectPublicOrdersState = (s: RootState) => s.publicOrders;
const selectOrders = (s: RootState) => s.publicOrders.orders;

// Selectors
export const selectPublicOrders = selectOrders;
export const selectPublicConnected = (s: RootState) => !s.publicOrders.loading;
export const selectFeedLoading = (s: RootState) => s.publicOrders.loading;
export const selectFeedError = (s: RootState) => s.publicOrders.error;

// ✅ MEMOIZED: returns the same object ref until totals change
export const selectPublicTotals = createSelector([selectPublicOrdersState], (st) => ({
  total: st.total,
  totalToday: st.totalToday,
}));

// ✅ MEMOIZED: returns the same array ref until orders array identity changes
export const selectPublicReadyNumbers = createSelector([selectOrders], (orders) =>
  orders
    .filter((o) => o.status === 'done')
    .slice(0, 10)
    .map((o) => o.number),
);

export const selectPublicPendingNumbers = createSelector([selectOrders], (orders) =>
  orders
    .filter((o) => o.status !== 'done')
    .slice(0, 10)
    .map((o) => o.number),
);

// ✅ MEMOIZED: selector factory for order by number
export const makeSelectFeedOrderByNumber = (num: number | string) =>
  createSelector([selectOrders], (orders) => orders.find((o) => o.number === Number(num)));
