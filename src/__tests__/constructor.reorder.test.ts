import constructorReducer, { addIngredient, reorderIngredient } from '../services/constructor/constructor.slice';
import type { TIngredient } from '@utils-types';

const mk = (id: string): TIngredient => ({
  _id: id,
  name: id,
  type: 'main',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 1,
  image: '',
  image_mobile: '',
  image_large: '',
});

describe('constructor.reorderIngredient', () => {
  it('перемещает начинку по индексам (0 -> 2)', () => {
    let state = constructorReducer(undefined, { type: '@@INIT' });

    state = constructorReducer(state, addIngredient(mk('f1')));
    state = constructorReducer(state, addIngredient(mk('f2')));
    state = constructorReducer(state, addIngredient(mk('f3')));

    state = constructorReducer(state, reorderIngredient({ fromIndex: 0, toIndex: 2 }));

    expect(state.ingredients.map(i => i._id)).toEqual(['f2', 'f3', 'f1']);
  });

  it('игнорирует некорректные индексы и не падает', () => {
    let state = constructorReducer(undefined, { type: '@@INIT' });
    state = constructorReducer(state, addIngredient(mk('a')));
    state = constructorReducer(state, addIngredient(mk('b')));

    const prev = state.ingredients.map(i => i._id);
    state = constructorReducer(state, reorderIngredient({ fromIndex: -1, toIndex: 10 }));
    expect(state.ingredients.map(i => i._id)).toEqual(prev);
  });

  it('игнорирует перестановку в ту же позицию', () => {
    let state = constructorReducer(undefined, { type: '@@INIT' });
    state = constructorReducer(state, addIngredient(mk('x')));
    const prev = state.ingredients.map(i => i._id);
    state = constructorReducer(state, reorderIngredient({ fromIndex: 0, toIndex: 0 }));
    expect(state.ingredients.map(i => i._id)).toEqual(prev);
  });
});
