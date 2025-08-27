import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { fetchIngredients, selectIngredients } from '../../services/ingredients/ingredients.slice';
import type { TIngredient } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';

type TabKey = 'bun' | 'sauce' | 'main';

export const BurgerIngredients: FC = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectIngredients);

  useEffect(() => {
    if (!items.length) dispatch(fetchIngredients());
  }, [dispatch, items.length]);

  const buns = useMemo(() => items.filter((i: TIngredient) => i.type === 'bun'), [items]);
  const sauces = useMemo(() => items.filter((i: TIngredient) => i.type === 'sauce'), [items]);
  const mains = useMemo(() => items.filter((i: TIngredient) => i.type === 'main'), [items]);

  const [currentTab, setCurrentTab] = useState<TabKey>('bun');

  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleSauceRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      sauces={sauces}
      mains={mains}
      titleBunRef={titleBunRef}
      titleSauceRef={titleSauceRef}
      titleMainRef={titleMainRef}
      onTabClick={(t: TabKey) => setCurrentTab(t)}
    />
  );
};

export default BurgerIngredients;
