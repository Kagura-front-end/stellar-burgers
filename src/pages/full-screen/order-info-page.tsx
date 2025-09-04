import React, { useEffect } from 'react';
import { OrderInfo } from '@components';
import styles from './centered.module.css';

import { useAppDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/ingredients/ingredients.slice';
import { fetchFeeds } from '../../services/orders/publicOrders.slice';

export default function OrderInfoPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchFeeds());
  }, [dispatch]);

  return (
    <div className={styles.wrap}>
      <OrderInfo />
    </div>
  );
}
