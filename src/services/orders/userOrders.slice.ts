import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TOrder } from '@utils-types'; // same alias you use elsewhere
import { getOrdersApi } from '../../utils/burger-api';
import type { RootState } from '../store';

type UserOrdersState = {
  orders: TOrder[] | null;
  loading: boolean;
  error: string | null;
};

const initialState: UserOrdersState = {
  orders: null,
  loading: false,
  error: null,
};

export const fetchUserOrders = createAsyncThunk<TOrder[]>('userOrders/fetch', async () => {
  const orders = await getOrdersApi();
  return orders;
});

const slice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {
    clear(state) {
      state.orders = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action: PayloadAction<TOrder[]>) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.orders = [];
        state.error = action.error.message ?? 'Failed to load orders';
      });
  },
});

export const { reducer: userOrdersReducer, actions: userOrdersActions } = slice;

export const selectUserOrders = (s: RootState) => s.userOrders.orders;
export const selectUserOrdersLoading = (s: RootState) => s.userOrders.loading;
export const selectUserOrdersError = (s: RootState) => s.userOrders.error;

// Handy for details page - fixed with proper typing
export const makeSelectOrderByNumber =
  (num: number | string) =>
  (s: RootState): TOrder | undefined =>
    s.userOrders.orders?.find((o: TOrder) => o.number === Number(num)); // ✅ Added type annotation
