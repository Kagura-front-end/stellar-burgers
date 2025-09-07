export type ConstructorBun = {
  name: string;
  price: number;
  image: string;
} | null;

export type ConstructorMiddleItem = {
  uuid: string;
  name: string;
  price: number;
  image: string;
};

export type ConstructorItems = {
  bun: ConstructorBun;
  middle: ConstructorMiddleItem[];
};

export type BurgerConstructorUIProps = {
  constructorItems: ConstructorItems;
  handleRemove: (item: Pick<ConstructorMiddleItem, 'uuid'>) => void;
  price: number;
  orderRequest: boolean;
  orderNumber: number | null;
  onOrderClick: () => void | Promise<void>;
  closeOrderModal: () => void;
  onMove?: (fromIndex: number, toIndex: number) => void;
};
