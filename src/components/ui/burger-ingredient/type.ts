import type { TIngredient } from '@utils-types';
import type { Location } from 'react-router-dom';

export type TBurgerIngredientUIProps = {
  ingredient: TIngredient;
  count: number;
  handleAdd: () => void;
  locationState?: { background: Location };
  className?: string;
};
