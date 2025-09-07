export type Ingredient = {
  _id: string;
  name: string;
  type: 'bun' | 'main' | 'sauce' | 'filling' | string;
  price?: number;
  image?: string;
};

export type IngredientsFixture = {
  success: boolean;
  data: Ingredient[];
};

export type StoreAction = { type: string; payload?: unknown };

export type WindowWithStore = Window & {
  __store: { dispatch: (action: StoreAction) => void };
};
