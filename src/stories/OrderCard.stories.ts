import type { Meta, StoryObj } from '@storybook/react';
import { OrderCard } from '../components/order-card/order-card';
import type { TOrder } from '@utils-types';

const meta: Meta<typeof OrderCard> = {
  title: 'Components/OrderCard',
  component: OrderCard,
};
export default meta;

type Story = StoryObj<typeof OrderCard>;

const sampleOrder: TOrder = {
  _id: 'order-123',
  status: 'done',
  name: 'Краторный бургер',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  number: 424242,
  ingredients: [
    '60d3b41abdacab0026a733c6',
    '60d3b41abdacab0026a733cd',
    '60d3b41abdacab0026a733ce',
  ],
};

export const Default: Story = {
  args: {
    order: sampleOrder,
  },
};
