import { FC } from 'react';
import styles from './order-status.module.css';

type Props = {
  status: string;
  className?: string;
};

const TEXT: Record<string, string> = {
  done: 'Выполнен',
  pending: 'Готовится',
  created: 'Готовится',
  canceled: 'Отменён',
};

export const OrderStatus: FC<Props> = ({ status, className }) => {
  const text = TEXT[status] ?? status;
  return <span className={[styles.status, className].filter(Boolean).join(' ')}>{text}</span>;
};
