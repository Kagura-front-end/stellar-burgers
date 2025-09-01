// src/components/ui/order-card/order-card.tsx
import React, { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CurrencyIcon, FormattedDate } from '@zlden/react-developer-burger-ui-components';
import styles from './order-card.module.css';
import type { OrderCardUIProps } from './type';
import { OrderStatus } from '@components';

export const OrderCardUI: FC<OrderCardUIProps> = ({ order, onClick }) => {
  const location = useLocation();

  // Simple visual stub; replace with real price/images when you wire ingredients
  const shown = order.ingredients.slice(0, 6);
  const remains = Math.max(0, order.ingredients.length - shown.length);
  const total = 0; // TODO: calculate based on ingredients data

  return (
    <li>
      <Link
        to={`/feed/${order.number}`}
        state={{ background: location }}
        className={`${styles.order} p-6`}
        onClick={onClick}
      >
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
            {shown.map((id, i) => (
              <li key={`${id}-${i}`} className={styles.img} style={{ zIndex: 6 - i }}>
                {/* put real <img> here later; keep the slot for the “+N” badge */}
                {i === 5 && remains > 0 && (
                  <span className={`text text_type_main-default ${styles.remains}`}>
                    +{remains}
                  </span>
                )}
              </li>
            ))}
          </ul>

          <div>
            <span className='text text_type_digits-default pr-1'>{total}</span>
            <CurrencyIcon type='primary' />
          </div>
        </div>
      </Link>
    </li>
  );
};

export default OrderCardUI;
