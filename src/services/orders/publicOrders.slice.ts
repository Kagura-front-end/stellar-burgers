import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
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

// Selectors (names unchanged to minimize refactors)
export const selectPublicOrders = (s: RootState) => s.publicOrders.orders;
export const selectPublicConnected = (s: RootState) => !s.publicOrders.loading;
export const selectPublicTotals = (s: RootState) => ({
  total: s.publicOrders.total,
  totalToday: s.publicOrders.totalToday,
});
export const selectFeedLoading = (s: RootState) => s.publicOrders.loading;
export const selectFeedError = (s: RootState) => s.publicOrders.error;

// For /feed/:number details
export const makeSelectFeedOrderByNumber =
  (num: number | string) =>
  (s: RootState): TOrder | undefined =>
    s.publicOrders.orders.find((o: TOrder) => o.number === Number(num));

// Memoized selectors for ready/pending numbers
export const selectPublicReadyNumbers = (s: RootState): number[] =>
  s.publicOrders.orders
    .filter((o: TOrder) => o.status === 'done')
    .slice(0, 10)
    .map((o: TOrder) => o.number);

export const selectPublicPendingNumbers = (s: RootState): number[] =>
  s.publicOrders.orders
    .filter((o: TOrder) => o.status !== 'done')
    .slice(0, 10)
    .map((o: TOrder) => o.number);
