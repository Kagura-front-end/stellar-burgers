import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { fetchIngredients } from '../../services/ingredients/ingredients.slice';

import { ConstructorPageUI } from '../../components/ui/pages/constructor-page';
import { BurgerIngredients, BurgerConstructor } from '../../components';

export const ConstructorPage: FC = () => {
  const dispatch = useAppDispatch();
  const { loading: isIngredientsLoading } = useAppSelector((s) => s.ingredients);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <ConstructorPageUI isLoading={isIngredientsLoading}>
      <BurgerIngredients />
      <BurgerConstructor />
    </ConstructorPageUI>
  );
};
