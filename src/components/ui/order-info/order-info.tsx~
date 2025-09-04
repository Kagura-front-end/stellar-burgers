import React, { FC, memo } from 'react';
import { CurrencyIcon, FormattedDate } from '@zlden/react-developer-burger-ui-components';

import styles from './order-info.module.css';

import { OrderInfoUIProps } from './type';

export const OrderInfoUI: FC<OrderInfoUIProps> = memo(({ orderInfo }) => {
  const statusMap: Record<string, { text: string; className: string }> = {
    done: { text: 'Выполнен', className: 'status_done' },
    pending: { text: 'Готовится', className: 'status_pending' },
    created: { text: 'Готовится', className: 'status_pending' },
    canceled: { text: 'Отменён', className: 'status_canceled' },
  };

  const { text: statusText, className: statusClass } = statusMap[orderInfo.status] ?? {
    text: orderInfo.status,
    className: 'status_pending',
  };

  return (
    <div className={styles.wrap}>
      <h3 className={`text text_type_main-medium pb-3 pt-10 ${styles.header}`}>{orderInfo.name}</h3>
      <div className={`text text_type_main-default ${styles.status} ${styles[statusClass]}`}>
        {statusText}
      </div>
      <p className={`text text_type_main-medium pt-15 pb-6`}>Состав:</p>
      <ul className={`${styles.list} mb-8`}>
        {Object.values(orderInfo.ingredientsInfo).map((item, index) => (
          <li className={`pb-4 pr-6 ${styles.item}`} key={index}>
            <div className={styles.modalIcon}>
              <img
                className={styles.modalIconImg}
                src={item.image_mobile || item.image}
                alt={item.name}
              />
            </div>
            <span className='text text_type_main-default pl-4'>{item.name}</span>
            <span className={`text text_type_digits-default pl-4 pr-4 ${styles.quantity}`}>
              {item.count} x {item.price}
            </span>
            <CurrencyIcon type={'primary'} />
          </li>
        ))}
      </ul>
      <div className={styles.bottom}>
        <p className='text text_type_main-default text_color_inactive'>
          <FormattedDate date={orderInfo.date} />
        </p>
        <span className={`text text_type_digits-default pr-4 ${styles.total}`}>
          {orderInfo.total}
        </span>
        <CurrencyIcon type={'primary'} />
      </div>
    </div>
  );
});
