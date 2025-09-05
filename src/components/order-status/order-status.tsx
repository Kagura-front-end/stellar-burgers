import React, { FC } from 'react';

type Props = {
  status: string;
  textStyle?: string;
  className?: string;
};

const statusMap: Record<string, { text: string; className: string }> = {
  done: { text: 'Выполнен', className: 'status_done' },
  pending: { text: 'Готовится', className: 'status_pending' },
  created: { text: 'Готовится', className: 'status_pending' },
  canceled: { text: 'Отменён', className: 'status_canceled' },
};

export const OrderStatus: FC<Props> = ({ status, textStyle, className }) => {
  const { text, className: statusClass } = statusMap[status] ?? {
    text: status,
    className: 'status_pending',
  };

  const textCls = textStyle ?? 'text text_type_main-default';

  return <div className={`${textCls} ${statusClass} ${className ?? ''}`.trim()}>{text}</div>;
};

export default OrderStatus;
