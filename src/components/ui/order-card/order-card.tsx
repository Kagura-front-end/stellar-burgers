import React, { FC } from 'react';
import { CurrencyIcon, FormattedDate } from '@zlden/react-developer-burger-ui-components';
import styles from './order-card.module.css';
import type { TOrder, TIngredient } from '@utils-types';
import { OrderStatus } from '@components';

export type OrderCardUIProps = {
  order: TOrder;
  ingredients: TIngredient[];
};

export const OrderCardUI: FC<OrderCardUIProps> = ({ order, ingredients }) => {
  const shownIngredients = ingredients.slice(0, 6);
  const remains = Math.max(0, ingredients.length - shownIngredients.length);

  // Calculate total price from ingredients
  const total = ingredients.reduce((sum, ingredient) => sum + ingredient.price, 0);

  return (
    <article className={`${styles.order} p-6`}>
      <div className='mb-6' style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p className='text text_type_digits-default'>#{order.number}</p>
        <FormattedDate
          className='text text_type_main-default text_color_inactive'
          date={new Date(order.createdAt)}
        />
      </div>

      <h3 className='text text_type_main-medium mb-2'>{order.name}</h3>
      <OrderStatus status={order.status} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <ul className={styles.ingredients}>
          {shownIngredients.map((ingredient, i) => (
            <li key={`${ingredient._id}-${i}`} className={styles.img} style={{ zIndex: 6 - i }}>
              <img
                src={ingredient.image_mobile || ingredient.image}
                alt={ingredient.name}
                width={64}
                height={64}
                style={{ borderRadius: '50%', objectFit: 'cover' }}
              />
              {i === 5 && remains > 0 && (
                <span className={`text text_type_main-default ${styles.remains}`}>+{remains}</span>
              )}
            </li>
          ))}
        </ul>

        <div>
          <span className='text text_type_digits-default pr-1'>{total}</span>
          <CurrencyIcon type='primary' />
        </div>
      </div>
    </article>
  );
};

export default OrderCardUI;
