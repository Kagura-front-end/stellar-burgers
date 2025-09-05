import { FC } from 'react';
import { useLocation, Link } from 'react-router-dom';
import type { OrdersListProps } from './type';
import OrderCard from '../order-card';
import styles from './orders-list.module.css';

export const OrdersList: FC<OrdersListProps> = ({ orders }) => {
  const location = useLocation();
  const isProfile = location.pathname.startsWith('/profile');
  const makeTo = (num: number | string) => (isProfile ? `/profile/orders/${num}` : `/feed/${num}`);

  return (
    <div className={styles.content}>
      <ul className={styles.list}>
        {orders.map((order) => (
          <li key={order._id} className={styles.item}>
            <Link
              to={makeTo(order.number)}
              state={{ background: location }}
              className={styles.link}
            >
              <OrderCard order={order} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrdersList;
