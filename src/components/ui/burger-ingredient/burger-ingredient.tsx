import { FC, SyntheticEvent } from 'react';
import type { TIngredient } from '@utils-types';
import { Counter, CurrencyIcon } from '@zlden/react-developer-burger-ui-components';
import { Link, type Location } from 'react-router-dom';
import styles from './burger-ingredient.module.css';

export type TBurgerIngredientProps = {
  ingredient: TIngredient;
  count: number;
  handleAdd?: () => void;
  /** Optional state for opening details in a modal route */
  locationState?: { background: Location } | undefined;
};

export const BurgerIngredient: FC<TBurgerIngredientProps> = ({
  ingredient,
  count,
  handleAdd,
  locationState,
}) => {
  const { _id, image, name, price, type } = ingredient;

  const onAddClick = (e: SyntheticEvent) => {
    e.stopPropagation(); // Prevent card navigation
    e.preventDefault(); // Prevent link navigation if inside a Link
    handleAdd?.();
  };

  // Disable button for buns that are already selected (count === 2)
  const isDisabled = type === 'bun' && count === 2;

  const content = (
    <>
      {!!count && <Counter count={count} size='default' />}
      <img className={styles.image} src={image} alt={name} />
      <div className={`${styles.price} mt-1 mb-1`}>
        <p className='text text_type_digits-default mr-2'>{price}</p>
        <CurrencyIcon type='primary' />
      </div>
      <p className={`${styles.title} text text_type_main-default`}>{name}</p>
    </>
  );

  return (
    <article className={styles.card}>
      {locationState ? (
        <Link to={`/ingredients/${_id}`} state={locationState} className={styles.linkArea}>
          {content}
        </Link>
      ) : (
        content
      )}

      <button
        type='button'
        className={styles.addButton}
        onClick={onAddClick}
        disabled={isDisabled}
        aria-label='Добавить ингредиент'
      >
        Добавить
      </button>
    </article>
  );
};

export default BurgerIngredient;
