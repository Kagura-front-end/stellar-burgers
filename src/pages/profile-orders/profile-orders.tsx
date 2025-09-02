import { FC, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { OrdersList } from '../../components/orders-list/orders-list';
import { Preloader } from '@ui';

import { fetchIngredients } from '../../services/ingredients/ingredients.slice';
import {
  fetchUserOrders,
  selectUserOrders,
  selectUserOrdersLoading,
  userOrdersActions,
} from '../../services/orders/userOrders.slice';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // Load once on mount
  useEffect(() => {
    dispatch(userOrdersActions.clear());
    // Ensure ingredients and orders exist just like canonical
    void Promise.all([dispatch(fetchIngredients()), dispatch(fetchUserOrders())]);
  }, [dispatch]);

  const orders = useAppSelector(selectUserOrders);
  const loading = useAppSelector(selectUserOrdersLoading);

  const openOrder = (n: number | string) =>
    navigate(`/profile/orders/${n}`, { state: { background: location } });

  if (loading || orders === null) return <Preloader />;

  return orders.length ? (
    <OrdersList orders={orders} onClick={openOrder} />
  ) : (
    <p className='text text_type_main-default' style={{ padding: 24 }}>
      Заказов пока нет.
    </p>
  );
};
