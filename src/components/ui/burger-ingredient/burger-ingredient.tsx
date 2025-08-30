import React, { FC, memo } from 'react';
import { Link } from 'react-router-dom';
import styles from './burger-ingredient.module.css';

import { Counter, CurrencyIcon, AddButton } from '@zlden/react-developer-burger-ui-components';

import { TBurgerIngredientUIProps } from './type';

export const BurgerIngredientUI: FC<TBurgerIngredientUIProps> = memo(
  ({ ingredient, count, handleAdd, locationState }) => {
    const { _id, image, price, name } = ingredient;

    return (
      <li className={styles.container}>
        <Link to={`/ingredients/${_id}`} state={locationState} className={styles.article}>
          {count > 0 && <Counter count={count} size='default' />}
          <img src={image} alt={name} />
          <div className={styles.cost}>
            <p className='text text_type_digits-default mr-2'>{price}</p>
            <CurrencyIcon type='primary' />
          </div>
          <p className={`text text_type_main-default ${styles.text}`}>{name}</p>
        </Link>

        <AddButton text='Добавить' onClick={handleAdd} extraClass={`${styles.addButton} mt-8`} />
      </li>
    );
  },
);

export default BurgerIngredientUI;
