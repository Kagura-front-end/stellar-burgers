import { FC, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { OrdersList } from '../../components/orders-list/orders-list';
import { Preloader, ProfileMenuUI } from '@ui';

import { fetchIngredients } from '../../services/ingredients/ingredients.slice';
import {
  fetchUserOrders,
  selectUserOrders,
  selectUserOrdersLoading,
  selectUserOrdersError,
  userOrdersActions,
} from '../../services/orders/userOrders.slice';
import styles from '../profile/profile.module.css';
import { logoutUserThunk } from '../../services/user/user.slice';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const orders = useAppSelector(selectUserOrders);
  const loading = useAppSelector(selectUserOrdersLoading);
  const error = useAppSelector(selectUserOrdersError);

  // Load once on mount
  useEffect(() => {
    dispatch(userOrdersActions.clear());
    // Ensure ingredients and orders exist just like canonical
    void Promise.all([dispatch(fetchIngredients()), dispatch(fetchUserOrders())]);
  }, [dispatch]);

  const openOrder = (n: number | string) =>
    navigate(`/profile/orders/${n}`, { state: { background: location } });

  const onLogout = async () => {
    await dispatch(logoutUserThunk() as any);
    navigate('/login', { replace: true, state: { from: location } });
  };

  if (loading) return <Preloader />;

  if (error)
    return (
      <div className={styles.page}>
        <aside className={styles.menu}>
          <ProfileMenuUI pathname={location.pathname} handleLogout={onLogout} />
        </aside>
        <section className={styles.content}>
          <p className='text text_type_main-default' style={{ padding: 24 }}>
            Ошибка загрузки заказов: {error}
          </p>
        </section>
      </div>
    );

  if (!orders || orders.length === 0)
    return (
      <div className={styles.page}>
        <aside className={styles.menu}>
          <ProfileMenuUI pathname={location.pathname} handleLogout={onLogout} />
        </aside>
        <section className={styles.content}>
          <p className='text text_type_main-default' style={{ padding: 24 }}>
            Заказов пока нет.
          </p>
        </section>
      </div>
    );

  return (
    <div className={styles.page}>
      <aside className={styles.menu}>
        <ProfileMenuUI pathname={location.pathname} handleLogout={onLogout} />
      </aside>
      <section className={styles.content}>
        <OrdersList orders={orders} onClick={openOrder} />
      </section>
    </div>
  );
};
