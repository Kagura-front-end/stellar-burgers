import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import {
  fetchFeeds,
  selectPublicOrders,
  selectPublicTotals,
  selectPublicReadyNumbers,
  selectPublicPendingNumbers,
  selectFeedLoading,
  selectFeedError,
} from '../../services/orders/publicOrders.slice';
import { fetchIngredients } from '../../services/ingredients/ingredients.slice';
import { OrdersList } from '../../components/orders-list/orders-list';
import { Preloader } from '@ui';
import { Button } from '@zlden/react-developer-burger-ui-components';
import styles from './feed.module.css';

const FeedPage: React.FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    void Promise.all([dispatch(fetchIngredients()), dispatch(fetchFeeds())]);
  }, [dispatch]);

  const orders = useAppSelector(selectPublicOrders);
  const totals = useAppSelector(selectPublicTotals);
  const ready = useAppSelector(selectPublicReadyNumbers);
  const pending = useAppSelector(selectPublicPendingNumbers);
  const loading = useAppSelector(selectFeedLoading);
  const error = useAppSelector(selectFeedError);

  const handleRefresh = () => {
    dispatch(fetchFeeds());
  };

  if (loading) return <Preloader />;
  if (error) return <p className='text text_type_main-default'>Ошибка: {error}</p>;

  return (
    <div className={styles.container}>
      <div className={styles.viewport}>
        <div className={styles.headerGrid}>
          <h1 className={`text text_type_main-large ${styles.headerTitle}`}>Лента заказов</h1>
          <div className={styles.headerActions}>
            <Button
              htmlType='button'
              type='primary'
              size='large'
              onClick={handleRefresh}
              disabled={loading}
              data-cy='feed_refresh_button'
            >
              Обновить
            </Button>
          </div>
        </div>

        <div className={styles.layout}>
          <section className={styles.left}>
            <OrdersList orders={orders} />
          </section>

          <div className={styles.separatorCol}>
            <div className={styles.separator} aria-hidden />
          </div>

          <aside className={styles.right}>
            <div className={styles.cols}>
              <div>
                <p className='text text_type_main-medium mb-4'>Готовы:</p>
                <ul className={styles.colList}>
                  {ready.map((n) => (
                    <li
                      key={n}
                      className={`${styles.num} text text_type_digits-default ${styles.ready}`}
                    >
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className='text text_type_main-medium mb-4'>В работе:</p>
                <ul className={styles.colList}>
                  {pending.map((n) => (
                    <li key={n} className={`${styles.num} text text_type_digits-default`}>
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={styles.totals}>
              <div className={styles.statBlock}>
                <p className='text text_type_main-medium'>Выполнено за все время:</p>
                <p className={`text text_type_digits-large ${styles.totalDigits}`}>
                  {totals.total}
                </p>
              </div>
              <div className={styles.statBlock}>
                <p className='text text_type_main-medium'>Выполнено за сегодня:</p>
                <p className={`text text_type_digits-large ${styles.totalDigits}`}>
                  {totals.totalToday}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default FeedPage;
