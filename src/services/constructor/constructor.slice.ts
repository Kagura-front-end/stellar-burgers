import { createSlice, PayloadAction, nanoid, createSelector } from '@reduxjs/toolkit';
import type { TIngredient } from '@utils-types';
import type { RootState } from '../store';

export type TConstructorIngredient = TIngredient & { uuid: string };

type ConstructorState = {
  bun: TIngredient | null;
  items: TConstructorIngredient[];
};

const CONSTRUCTOR_STORAGE_KEY = 'sb_constructor';

type PersistedConstructor = {
  bun: any | null;
  items: any[];
};

function loadConstructorFromStorage(): PersistedConstructor {
  try {
    const raw = localStorage.getItem(CONSTRUCTOR_STORAGE_KEY);
    if (!raw) return { bun: null, items: [] };
    const parsed = JSON.parse(raw);
    return {
      bun: parsed?.bun ?? null,
      items: Array.isArray(parsed?.items) ? parsed.items : [],
    };
  } catch {
    return { bun: null, items: [] };
  }
}

const persisted = loadConstructorFromStorage();

const initialState: ConstructorState = {
  bun: persisted.bun,
  items: persisted.items,
};

const slice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    setBun(state, action: PayloadAction<TIngredient>) {
      state.bun = action.payload;
    },
    addItem(state, action: PayloadAction<TIngredient>) {
      const ing = action.payload;
      if (ing.type === 'bun') {
        state.bun = ing;
      } else {
        state.items.push({ ...ing, uuid: nanoid() });
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.uuid !== action.payload);
    },
    moveItem(state, action: PayloadAction<{ from: number; to: number }>) {
      const { from, to } = action.payload;
      if (
        from === to ||
        from < 0 ||
        to < 0 ||
        from >= state.items.length ||
        to >= state.items.length
      )
        return;
      const copy = state.items.slice();
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      state.items = copy;
    },
    reset(state) {
      state.bun = null;
      state.items = [];
    },
    clear: (state) => {
      state.bun = null;
      state.items = [];
    },
  },
});

export const {
  setBun,
  addItem,
  removeItem,
  moveItem,
  reset,
  clear: clearConstructor,
} = slice.actions;
export default slice.reducer;

export const selectConstructor = (s: RootState) => s.burgerConstructor;
export const selectConstructorBun = (s: RootState) => s.burgerConstructor.bun;
export const selectConstructorItems = (s: RootState) => s.burgerConstructor.items;

export const selectCountsMap = createSelector(
  [selectConstructorBun, selectConstructorItems],
  (bun, items) => {
    const map: Record<string, number> = {};
    if (bun) map[bun._id] = 2;
    for (const i of items) map[i._id] = (map[i._id] ?? 0) + 1;
    return map;
  },
);

export const selectTotalCount = createSelector(
  [selectConstructorBun, selectConstructorItems],
  (bun, items) => (bun ? 2 : 0) + items.length,
);

export const selectTotalPrice = createSelector(
  [selectConstructorBun, selectConstructorItems],
  (bun, items): number => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const itemsTotal = items.reduce<number>(
      (sum: number, it: { price: number }) => sum + (typeof it.price === 'number' ? it.price : 0),
      0,
    );
    return bunPrice + itemsTotal;
  },
);

// --- Auto-save middleware ---
export const constructorPersistMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action);

  if (action.type?.startsWith('burgerConstructor/')) {
    const state = store.getState().burgerConstructor;
    try {
      localStorage.setItem(
        CONSTRUCTOR_STORAGE_KEY,
        JSON.stringify({
          bun: state.bun,
          items: state.items,
        }),
      );
    } catch (error) {
      console.warn('Failed to save constructor to localStorage:', error);
    }
  }

  return result;
};
