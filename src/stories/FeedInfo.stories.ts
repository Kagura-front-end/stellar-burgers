import type { Meta, StoryObj } from '@storybook/react';
import { FeedInfoUI } from '@ui';

const meta = {
  title: 'UI/FeedInfo',
  component: FeedInfoUI,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof FeedInfoUI>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    feed: { total: 12345, totalToday: 67 },
    readyOrders: [87512, 87511, 87510, 87509, 87508],
    pendingOrders: [87520, 87519, 87518],
  },
};
