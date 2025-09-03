import { FC, RefObject } from 'react';
import { Tab } from '@zlden/react-developer-burger-ui-components';
import type { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ingredients-category';
import { BurgerIngredientUI } from '../burger-ingredient';
import { type Location } from 'react-router-dom';
import styles from './burger-ingredients.module.css';

type TabValue = 'buns' | 'fillings';

export type BurgerIngredientsUIProps = {
  currentTab: TabValue;
  buns: TIngredient[];
  sauces: TIngredient[];
  mains: TIngredient[];
  titleBunRef: RefObject<HTMLHeadingElement>;
  titleSauceRef: RefObject<HTMLHeadingElement>;
  titleMainRef: RefObject<HTMLHeadingElement>;
  scrollRef: RefObject<HTMLDivElement>;
  countsMap: Record<string, number>;
  handleAdd: (i: TIngredient) => void;
  onTabClick: (t: TabValue) => void;
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
  scrollRef,
  countsMap,
  handleAdd,
  onTabClick,
  locationState,
}) => (
  <section className={styles.section}>
    <h1 className={styles.title}>Соберите бургер</h1>

    <div className={styles.tabs}>
      <Tab value='buns' active={currentTab === 'buns'} onClick={() => onTabClick('buns')}>
        Булки
      </Tab>
      <Tab
        value='fillings'
        active={currentTab === 'fillings'}
        onClick={() => onTabClick('fillings')}
      >
        Начинки
      </Tab>
    </div>

    <div className={styles.content} ref={scrollRef}>
      <IngredientsCategoryUI title='Булки' titleRef={titleBunRef} id='buns' data-section='bun'>
        {buns.map((ingredient) => (
          <BurgerIngredientUI
            key={ingredient._id}
            ingredient={ingredient}
            count={countsMap[ingredient._id] ?? 0}
            handleAdd={() => handleAdd(ingredient)}
            locationState={locationState}
            className={styles.tile}
          />
        ))}
      </IngredientsCategoryUI>

      <IngredientsCategoryUI
        title='Соусы'
        titleRef={titleSauceRef}
        id='sauces'
        data-section='sauce'
      >
        {sauces.map((ingredient) => (
          <BurgerIngredientUI
            key={ingredient._id}
            ingredient={ingredient}
            count={countsMap[ingredient._id] ?? 0}
            handleAdd={() => handleAdd(ingredient)}
            locationState={locationState}
            className={styles.tile}
          />
        ))}
      </IngredientsCategoryUI>

      <IngredientsCategoryUI title='Начинки' titleRef={titleMainRef} id='mains' data-section='main'>
        {mains.map((ingredient) => (
          <BurgerIngredientUI
            key={ingredient._id}
            ingredient={ingredient}
            count={countsMap[ingredient._id] ?? 0}
            handleAdd={() => handleAdd(ingredient)}
            locationState={locationState}
            className={styles.tile}
          />
        ))}
      </IngredientsCategoryUI>
    </div>
  </section>
);

export default BurgerIngredientsUI;
export { BurgerIngredientsUI };
