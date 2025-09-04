import React, { useEffect } from 'react';
import { OrderInfo } from '@components';
import styles from './centered.module.css';

import { useAppDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/ingredients/ingredients.slice';
import { fetchUserOrders } from '../../services/orders/userOrders.slice';

export default function ProfileOrderInfoPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchUserOrders());
  }, [dispatch]);

  return (
    <div className={styles.wrap}>
      <OrderInfo />
    </div>
  );
}
