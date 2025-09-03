import { FC, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import type { RootState } from '../../services/store';
import {
  selectConstructorBun,
  selectConstructorItems,
  selectTotalPrice,
  clearConstructor,
} from '../../services/constructor/constructor.slice';
import BurgerConstructorUI from '../ui/burger-constructor/burger-constructor';

import {
  placeOrderThunk,
  currentOrderActions,
  selectOrderNumber,
  selectOrderRequest,
} from '../../services/orders/currentOrder.slice';
import type { TConstructorIngredient as TConstructorItem } from '../../services/constructor/constructor.slice';

const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const bun = useAppSelector((s: RootState) => selectConstructorBun(s));
  const items = useAppSelector((s: RootState) => selectConstructorItems(s));
  const price = useAppSelector((s: RootState) => selectTotalPrice(s));

  const isAuth =
    useAppSelector((s: RootState) => Boolean(s.user?.user)) ||
    Boolean(localStorage.getItem('accessToken'));

  const constructorItems = useMemo(() => ({ bun, ingredients: items }), [bun, items]);

  const orderNumber = useAppSelector(selectOrderNumber);
  const orderRequest = useAppSelector(selectOrderRequest);

  const onOrderClick = async () => {
    if (!bun || items.length === 0) return;

    if (!isAuth) {
      navigate('/login', { replace: true, state: { from: location } });
      return;
    }

    const ingredientIds = [bun._id, ...items.map((i: TConstructorItem) => i._id), bun._id];

    const resultAction = await dispatch(placeOrderThunk(ingredientIds));

    if (placeOrderThunk.fulfilled.match(resultAction)) {
      dispatch(clearConstructor());
    }
  };

  const closeOrderModal = () => {
    dispatch(currentOrderActions.clearOrder());
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderNumber={orderNumber}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};

export default BurgerConstructor;
export { BurgerConstructor };
