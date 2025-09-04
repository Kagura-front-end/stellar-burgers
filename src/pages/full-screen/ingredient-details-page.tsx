import React, { useEffect } from 'react';
import { IngredientDetails } from '@components';
import styles from './centered.module.css';

import { useAppDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/ingredients/ingredients.slice';

export default function IngredientDetailsPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <div className={styles.wrap}>
      <IngredientDetails />
    </div>
  );
}
