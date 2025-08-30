import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

import { orderBurgerApi } from '../../utils/burger-api';

type CurrentOrderState = {
  number: number | null;
  request: boolean;
  error: string | null;
};

const initialState: CurrentOrderState = {
  number: null,
  request: false,
  error: null,
};

export const placeOrderThunk = createAsyncThunk('order/place', async (ingredientIds: string[]) => {
  // API returns: { success, name, order: { number } }
  const res = await orderBurgerApi(ingredientIds);
  // keep only the number for the modal
  return res.order.number as number;
});

const slice = createSlice({
  name: 'currentOrder',
  initialState,
  reducers: {
    clearOrder(state) {
      state.number = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrderThunk.pending, (state) => {
        state.request = true;
        state.error = null;
      })
      .addCase(placeOrderThunk.fulfilled, (state, action: PayloadAction<number>) => {
        state.request = false;
        state.number = action.payload;
      })
      .addCase(placeOrderThunk.rejected, (state, action) => {
        state.request = false;
        state.error = action.error.message ?? 'Не удалось оформить заказ';
      });
  },
});

export const { reducer: currentOrderReducer, actions: currentOrderActions } = slice;

// selectors
export const selectOrderNumber = (s: RootState) => s.currentOrder.number;
export const selectOrderRequest = (s: RootState) => s.currentOrder.request;
export const selectOrderError = (s: RootState) => s.currentOrder.error;
