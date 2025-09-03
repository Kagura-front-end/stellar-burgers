import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { orderBurgerApi } from '../../utils/burger-api';

export const placeOrderThunk = createAsyncThunk(
  'placeOrder/place',
  async (ingredientIds: string[]) => {
    const data = await orderBurgerApi(ingredientIds);
    return (data as unknown as { order: { number: number } }).order.number;
  },
);

type State = {
  orderNumber: number | null;
  placing: boolean;
  error: string | null;
};

const initialState: State = {
  orderNumber: null,
  placing: false,
  error: null,
};

const slice = createSlice({
  name: 'placeOrder',
  initialState,
  reducers: {
    clearOrder(state) {
      state.orderNumber = null;
      state.error = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(placeOrderThunk.pending, (s) => {
      s.placing = true;
      s.error = null;
    });
    b.addCase(placeOrderThunk.fulfilled, (s, a: PayloadAction<number>) => {
      s.placing = false;
      s.orderNumber = a.payload;
    });
    b.addCase(placeOrderThunk.rejected, (s, a) => {
      s.placing = false;
      s.error = a.error.message ?? 'Не удалось оформить заказ';
    });
  },
});

export const { reducer: placeOrderReducer, actions: placeOrderActions } = slice;

export const selectOrderNumber = (s: RootState) => s.placeOrder.orderNumber;
export const selectOrderPlacing = (s: RootState) => s.placeOrder.placing;
