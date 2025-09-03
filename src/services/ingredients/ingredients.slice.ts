import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { TIngredient } from '@utils-types';
import { getIngredientsApi } from '../../utils/burger-api';

type IngredientsState = {
  items: TIngredient[];
  loading: boolean;
  error: string | null;
};

const initialState: IngredientsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/fetch',
  async () => await getIngredientsApi(),
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchIngredients.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchIngredients.fulfilled, (s, a) => {
      s.loading = false;
      s.items = a.payload;
    });
    b.addCase(fetchIngredients.rejected, (s, a) => {
      s.loading = false;
      s.error = (a.error?.message as string) || 'Failed to load ingredients';
    });
  },
});

export default ingredientsSlice.reducer;

export const selectIngredients = (s: RootState) => s.ingredients.items;
export const selectIngredientsLoading = (s: RootState) => s.ingredients.loading;
export const selectIngredientsError = (s: RootState) => s.ingredients.error;
