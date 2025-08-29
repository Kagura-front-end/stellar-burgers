import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

export const BurgerConstructor: FC = () => {
  // Until the constructor is wired to the store, keep an empty stub:
  const constructorItems: {
    bun: null | { price: number; name?: string; image?: string };
    ingredients: TConstructorIngredient[];
  } = {
    bun: null, // IMPORTANT: null → UI shows "Выберите булки"
    ingredients: [], // empty → UI shows "Выберите начинку"
  };

  const orderRequest = false;
  const orderModalData = null;

  // Matches the UI's expected "price" prop
  const price = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const itemsPrice = constructorItems.ingredients.reduce((sum, it) => sum + it.price, 0);
    return bunPrice + itemsPrice;
  }, [constructorItems]);

  const onOrderClick = () => {
    // no-op for now — will be replaced when we wire the API
  };

  const closeOrderModal = () => {
    // no-op for now — modal won't open until we have order data
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};

export default BurgerConstructor;
