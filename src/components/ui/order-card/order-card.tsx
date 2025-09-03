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
  const MAX = 6;
  const visible = ingredients.slice(0, MAX);
  const rest = Math.max(ingredients.length - MAX, 0);

  const nextPreview = rest > 0 ? ingredients[MAX] ?? visible[visible.length - 1] : undefined;

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
        <ul className={`${styles.ingredients} ${styles.stack}`} aria-label='Состав'>
          {visible.map((ingredient, idx) => (
            <li
              key={`${ingredient._id}-${idx}`}
              className={styles.img_wrap}
              style={{ zIndex: 100 - idx }}
            >
              <img
                className={styles.img}
                src={ingredient.image_mobile || ingredient.image}
                alt={ingredient.name}
                loading='lazy'
              />
            </li>
          ))}

          {rest > 0 && (
            <li className={`${styles.img_wrap} ${styles.more}`} style={{ zIndex: 0 }}>
              {nextPreview && (
                <img
                  className={styles.img}
                  src={nextPreview.image_mobile || nextPreview.image}
                  alt={nextPreview.name}
                  loading='lazy'
                />
              )}
              <span className={styles.moreText}>+{rest}</span>
            </li>
          )}
        </ul>

        <div className={styles.order_total}>
          <span className='text text_type_digits-default pr-1'>{total}</span>
          <CurrencyIcon type='primary' />
        </div>
      </div>
    </article>
  );
};

export default OrderCardUI;
