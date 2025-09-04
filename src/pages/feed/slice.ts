import { createSlice } from '@reduxjs/toolkit';
import { refreshFeed } from './thunk';

type FeedState = {
  orders: any[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
};

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(refreshFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(refreshFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? action.error.message ?? 'Error';
      });
  }
});

export default feedSlice.reducer;
