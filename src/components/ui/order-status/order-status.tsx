import React, { FC } from 'react';
import styles from './order-status.module.css';

type Props = { status: string };

const statusMap: Record<string, { text: string; className: string }> = {
  done: { text: 'Выполнен', className: 'status_done' },
  pending: { text: 'Готовится', className: 'status_pending' },
  created: { text: 'Готовится', className: 'status_pending' },
  canceled: { text: 'Отменён', className: 'status_canceled' },
};

export const OrderStatus: FC<Props> = ({ status }) => {
  const { text, className } = statusMap[status] ?? { text: status, className: 'status_pending' };
  return <div className={`text text_type_main-default ${styles.root} ${className}`}>{text}</div>;
};
