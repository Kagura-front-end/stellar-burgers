import type { Meta, StoryObj } from '@storybook/react';
import { BurgerConstructorUI } from '../components/ui/burger-constructor/burger-constructor';

const meta: Meta<typeof BurgerConstructorUI> = {
  title: 'Burger/BurgerConstructor',
  component: BurgerConstructorUI,
};
export default meta;

type Story = StoryObj<typeof BurgerConstructorUI>;

type ConstructorDisplayItem = {
  uuid: string;
  name: string;
  price: number;
  image: string;
};

const bun = {
  name: 'Краторная булка N-200i',
  price: 20,
  image: 'https://via.placeholder.com/64',
};

const middle: ConstructorDisplayItem[] = [
  {
    uuid: '1',
    name: 'Соус традиционный',
    price: 30,
    image: 'https://via.placeholder.com/64',
  },
  {
    uuid: '2',
    name: 'Мясо Protostomia',
    price: 300,
    image: 'https://via.placeholder.com/64',
  },
];

export const Default: Story = {
  args: {
    price: 2349,
    orderRequest: false,
    orderNumber: null,
    onOrderClick: async () => {},
    closeOrderModal: () => {},
    constructorItems: {
      bun,
      middle,
    },
    handleRemove: () => {},
  },
};
