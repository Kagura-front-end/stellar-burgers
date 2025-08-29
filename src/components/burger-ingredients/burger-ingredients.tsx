import { FC, useEffect, useMemo, useRef, useState, UIEventHandler } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { fetchIngredients, selectIngredients } from '../../services/ingredients/ingredients.slice';
import { addItem, setBun, selectCountsMap } from '../../services/constructor/constructor.slice';
import type { TIngredient } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useLocation } from 'react-router-dom';

type TabKey = 'bun' | 'sauce' | 'main';

export const BurgerIngredients: FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const items = useAppSelector(selectIngredients);
  const countsMap = useAppSelector(selectCountsMap);

  useEffect(() => {
    if (!items.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, items.length]);

  const buns = useMemo(() => items.filter((i: TIngredient) => i.type === 'bun'), [items]);
  const sauces = useMemo(() => items.filter((i: TIngredient) => i.type === 'sauce'), [items]);
  const mains = useMemo(() => items.filter((i: TIngredient) => i.type === 'main'), [items]);

  const [currentTab, setCurrentTab] = useState<TabKey>('bun');

  const scrollRef = useRef<HTMLDivElement>(null);
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleSauceRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);

  const listBunsRef = useRef<HTMLDivElement>(null);
  const listSaucesRef = useRef<HTMLDivElement>(null);
  const listMainsRef = useRef<HTMLDivElement>(null);

  const handleAdd = (ingredient: TIngredient) => {
    if (ingredient.type === 'bun') {
      dispatch(setBun(ingredient));
    } else {
      dispatch(addItem(ingredient));
    }
  };

  const onTabClick = (tab: TabKey) => {
    setCurrentTab(tab);
    const targetRef = tab === 'bun' ? titleBunRef : tab === 'sauce' ? titleSauceRef : titleMainRef;

    targetRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const onScroll: UIEventHandler<HTMLDivElement> = () => {
    if (!scrollRef.current) return;

    const containerTop = scrollRef.current.getBoundingClientRect().top;

    const distance = (el: HTMLElement | null) =>
      Math.abs((el?.getBoundingClientRect().top ?? 0) - containerTop);

    const distances = [
      ['bun', distance(titleBunRef.current)],
      ['sauce', distance(titleSauceRef.current)],
      ['main', distance(titleMainRef.current)],
    ];

    const closest = distances.sort((a, b) => (a[1] as number) - (b[1] as number))[0][0] as TabKey;

    if (closest !== currentTab) {
      setCurrentTab(closest);
    }
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      sauces={sauces}
      mains={mains}
      titleBunRef={titleBunRef}
      titleSauceRef={titleSauceRef}
      titleMainRef={titleMainRef}
      listBunsRef={listBunsRef}
      listSaucesRef={listSaucesRef}
      listMainsRef={listMainsRef}
      onTabClick={onTabClick}
      scrollRef={scrollRef}
      onScroll={onScroll}
      countsMap={countsMap}
      handleAdd={handleAdd}
      locationState={{ background: location }}
    />
  );
};

export default BurgerIngredients;
