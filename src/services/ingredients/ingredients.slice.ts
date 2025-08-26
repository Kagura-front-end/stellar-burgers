import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { TIngredient } from '../../utils/types';
import { getIngredientsApi } from '../../utils/burger-api';

export type IngredientsState = {
  items: TIngredient[];
  data: TIngredient[];
  buns: TIngredient[];
  sauces: TIngredient[];
  mains: TIngredient[];
  loading: boolean;
  error: string | null;
};

const initialState: IngredientsState = {
  items: [],
  data: [],
  buns: [],
  sauces: [],
  mains: [],
  loading: false,
  error: null,
};

export const fetchIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/fetch',
  async () => await getIngredientsApi(),
);

const slice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchIngredients.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchIngredients.fulfilled, (s, a: PayloadAction<TIngredient[]>) => {
      s.loading = false;
      s.items = a.payload;
      s.data = a.payload;
      s.buns = a.payload.filter((i) => i.type === 'bun');
      s.sauces = a.payload.filter((i) => i.type === 'sauce');
      s.mains = a.payload.filter((i) => i.type === 'main');
    });
    b.addCase(fetchIngredients.rejected, (s, a) => {
      s.loading = false;
      s.error = a.error.message || 'Failed to load ingredients';
    });
  },
});

export default slice.reducer;

// Optional selectors
export const selectIngredientsLoading = (s: { ingredients: IngredientsState }) =>
  s.ingredients.loading;
export const selectAllIngredients = (s: { ingredients: IngredientsState }) => s.ingredients.items;
