import { FC, RefObject } from 'react';
import { Tab } from '@zlden/react-developer-burger-ui-components';
import type { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ingredients-category';
import { BurgerIngredientUI } from '../burger-ingredient';
import { type Location } from 'react-router-dom';
import styles from './burger-ingredients.module.css';

type TabKey = 'bun' | 'sauce' | 'main';

export type BurgerIngredientsUIProps = {
  currentTab: TabKey;
  buns: TIngredient[];
  sauces: TIngredient[];
  mains: TIngredient[];
  titleBunRef: RefObject<HTMLHeadingElement>;
  titleSauceRef: RefObject<HTMLHeadingElement>;
  titleMainRef: RefObject<HTMLHeadingElement>;
  listBunsRef: RefObject<HTMLDivElement>;
  listSaucesRef: RefObject<HTMLDivElement>;
  listMainsRef: RefObject<HTMLDivElement>;
  onTabClick: (t: TabKey) => void;
  countsMap: Record<string, number>;
  handleAdd: (i: TIngredient) => void;
  locationState?: { background: Location } | undefined;
};

const BurgerIngredientsUI: FC<BurgerIngredientsUIProps> = ({
  currentTab,
  buns,
  sauces,
  mains,
  titleBunRef,
  titleSauceRef,
  titleMainRef,
  listBunsRef,
  listSaucesRef,
  listMainsRef,
  onTabClick,
  countsMap,
  handleAdd,
  locationState,
}) => (
  <section className={styles.section}>
    <div className={styles.tabs}>
      <Tab value='bun' active={currentTab === 'bun'} onClick={() => onTabClick('bun')}>
        Булки
      </Tab>
      <Tab value='sauce' active={currentTab === 'sauce'} onClick={() => onTabClick('sauce')}>
        Соусы
      </Tab>
      <Tab value='main' active={currentTab === 'main'} onClick={() => onTabClick('main')}>
        Начинки
      </Tab>
    </div>

    <IngredientsCategoryUI title='Булки' titleRef={titleBunRef} ref={listBunsRef}>
      {buns.map((ingredient) => (
        <BurgerIngredientUI
          key={ingredient._id}
          ingredient={ingredient}
          count={countsMap[ingredient._id] ?? 0}
          handleAdd={() => handleAdd(ingredient)}
          locationState={locationState}
        />
      ))}
    </IngredientsCategoryUI>

    <IngredientsCategoryUI title='Соусы' titleRef={titleSauceRef} ref={listSaucesRef}>
      {sauces.map((ingredient) => (
        <BurgerIngredientUI
          key={ingredient._id}
          ingredient={ingredient}
          count={countsMap[ingredient._id] ?? 0}
          handleAdd={() => handleAdd(ingredient)}
          locationState={locationState}
        />
      ))}
    </IngredientsCategoryUI>

    <IngredientsCategoryUI title='Начинки' titleRef={titleMainRef} ref={listMainsRef}>
      {mains.map((ingredient) => (
        <BurgerIngredientUI
          key={ingredient._id}
          ingredient={ingredient}
          count={countsMap[ingredient._id] ?? 0}
          handleAdd={() => handleAdd(ingredient)}
          locationState={locationState}
        />
      ))}
    </IngredientsCategoryUI>
  </section>
);

export default BurgerIngredientsUI;
export { BurgerIngredientsUI };
