import type { Meta, StoryObj } from '@storybook/react';
import { BurgerConstructorElementUI } from '../components/ui/burger-constructor-element/burger-constructor-element';

const meta: Meta<typeof BurgerConstructorElementUI> = {
  title: 'Burger/BurgerConstructorElement',
  component: BurgerConstructorElementUI,
};
export default meta;

type Story = StoryObj<typeof BurgerConstructorElementUI>;

export const Default: Story = {
  args: {
    ingredient: {
      name: 'Соус фирменный Space Sauce',
      price: 80,
      image: 'https://via.placeholder.com/64',
    },
    onClose: () => {},
  },
};
