import { combineReducers } from '@reduxjs/toolkit';

import constructorReducer, {
  addIngredient,
  setBun,
  removeItem,
  TConstructorItem
} from '../services/constructor/constructor.slice';

import ingredientsReducer, {
  fetchIngredients
} from '../services/ingredients/ingredients.slice';

import type { TIngredient } from '@utils-types';

describe('rootReducer', () => {
  const rootReducer = combineReducers({
    constructor: constructorReducer,
    ingredients: ingredientsReducer
  });

  it('возвращает initialState при UNKNOWN_ACTION', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state.constructor).toBeDefined();
    expect(state.ingredients).toBeDefined();
  });
});


describe('constructorSlice', () => {
  const makeIng = (_id: string, type: TIngredient['type'], name: string): TIngredient =>
    ({ _id, type, name } as TIngredient);

  const bun: TIngredient = makeIng('bun-1', 'bun', 'Булка');
  const f1: TIngredient = makeIng('f-1', 'main', 'Котлета');
  const f2: TIngredient = makeIng('f-2', 'sauce', 'Соус');

  it('добавляет булку (setBun)', () => {
    const state = constructorReducer(undefined, setBun(bun));
    expect(state.bun?._id).toBe('bun-1');
  });

  it('добавляет начинки (addIngredient)', () => {
    let state = constructorReducer(undefined, addIngredient(f1));
    state = constructorReducer(state, addIngredient(f2));

    const ids = state.ingredients.map((i) => i._id);
    expect(ids).toEqual(['f-1', 'f-2']);

    const allHaveUuid: boolean = state.ingredients.every((i) => typeof i.uuid === 'string' && i.uuid.length > 0);
    expect(allHaveUuid).toBe(true);
  });

  it('удаляет начинку по uuid (removeItem)', () => {
    let state = constructorReducer(undefined, addIngredient(f1));
    state = constructorReducer(state, addIngredient(f2));

    const uuidToRemove: TConstructorItem['uuid'] = state.ingredients[0].uuid;
    state = constructorReducer(state, removeItem(uuidToRemove));

    const ids = state.ingredients.map((i) => i._id);
    expect(ids).toEqual(['f-2']);
  });
});

describe('ingredientsSlice (async)', () => {
  it('pending → loading=true и error=null', () => {
    const state = ingredientsReducer(undefined, { type: fetchIngredients.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fulfilled → пишет данные и loading=false', () => {
    const payload: TIngredient[] = [
      { _id: '1', type: 'bun', name: 'Булка' } as TIngredient
    ];

    const pre = ingredientsReducer(undefined, { type: fetchIngredients.pending.type });
    const state = ingredientsReducer(pre, {
      type: fetchIngredients.fulfilled.type,
      payload
    });

    expect(state.items).toEqual(payload);
    expect(state.loading).toBe(false);
  });

  it('rejected → пишет ошибку и loading=false', () => {
    const pre = ingredientsReducer(undefined, { type: fetchIngredients.pending.type });
    const state = ingredientsReducer(pre, {
      type: fetchIngredients.rejected.type,
      error: { message: 'boom' }
    });

    expect(state.error).toBeDefined();
    expect(state.loading).toBe(false);
  });
});
