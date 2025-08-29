import { forwardRef, RefObject } from 'react';
import type { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { BurgerIngredientUI } from '../ui/burger-ingredient';
import { type Location } from 'react-router-dom';

type IngredientsCategoryProps = {
  title: string;
  titleRef: RefObject<HTMLHeadingElement>;
  ingredients: TIngredient[];
  ingredientsCounters: Record<string, number>;
  onAdd: (ingredient: TIngredient) => void;
  locationState?: { background: Location } | undefined;
};

const IngredientsCategory = forwardRef<HTMLDivElement, IngredientsCategoryProps>(
  ({ title, titleRef, ingredients, ingredientsCounters, onAdd, locationState }, ref) => (
    <IngredientsCategoryUI title={title} titleRef={titleRef} ref={ref}>
      {ingredients.map((ingredient) => (
        <BurgerIngredientUI
          key={ingredient._id}
          ingredient={ingredient}
          count={ingredientsCounters[ingredient._id] ?? 0}
          handleAdd={() => onAdd(ingredient)}
          locationState={locationState}
        />
      ))}
    </IngredientsCategoryUI>
  ),
);

export default IngredientsCategory;
export { IngredientsCategory };
