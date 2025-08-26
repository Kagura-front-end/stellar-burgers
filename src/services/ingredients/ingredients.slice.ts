import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import type { TIngredient } from '../../utils/types';

export type IngredientsState = {
  items: TIngredient[];
  loading: boolean;
  error: string | null;
};

const initialState: IngredientsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchIngredients = createAsyncThunk<TIngredient[]>('ingredients/fetch', async () => {
  const data = await getIngredientsApi();
  return data;
});

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.error.message || 'Failed to load ingredients');
      });
  },
});

export default ingredientsSlice.reducer;

export const selectIngredients = (s: { ingredients: IngredientsState }) => s.ingredients.items;
export const selectIngredientsLoading = (s: { ingredients: IngredientsState }) =>
  s.ingredients.loading;
export const selectIngredientsError = (s: { ingredients: IngredientsState }) => s.ingredients.error;
