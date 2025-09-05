import type { Meta, StoryObj } from '@storybook/react';
import { OrderStatus } from '../components/order-status/order-status';

const meta: Meta<typeof OrderStatus> = {
  title: 'Components/OrderStatus',
  component: OrderStatus,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 'fit-content', margin: 20 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof OrderStatus>;

export const Done: Story = {
  args: {
    status: 'done',
    textStyle: 'text text_type_main-default',
  },
};

export const Pending: Story = {
  args: {
    status: 'pending',
  },
};

export const Canceled: Story = {
  args: {
    status: 'canceled',
    textStyle: 'text text_type_main-default',
  },
};
