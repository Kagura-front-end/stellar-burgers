import { FC, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import type { RootState } from '../../services/store';
import type { TOrder } from '@utils-types';

import {
  selectConstructorBun,
  selectConstructorItems,
  selectTotalPrice,
  // clearAll as clearConstructor, // <- uncomment if you already have it and want to clear constructor after order
} from '../../services/constructor/constructor.slice';

import {
  placeOrderThunk,
  selectOrderNumber,
  selectOrderPlacing,
  placeOrderActions,
} from '../../services/orders/placeOrder.slice';

import BurgerConstructorUI from '../ui/burger-constructor/burger-constructor';

const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // constructor state
  const bun = useAppSelector((s: RootState) => selectConstructorBun(s));
  const items = useAppSelector((s: RootState) => selectConstructorItems(s));
  const price = useAppSelector((s: RootState) => selectTotalPrice(s));

  // place-order state
  const orderNumber = useAppSelector((s: RootState) => selectOrderNumber(s));
  const orderRequest = useAppSelector((s: RootState) => selectOrderPlacing(s));

  // auth (keep logic consistent with current project)
  const isAuth =
    useAppSelector((s: RootState) => Boolean(s.user?.user)) ||
    Boolean(localStorage.getItem('accessToken'));

  const constructorItems = useMemo(() => ({ bun, ingredients: items }), [bun, items]);

  // Create full TOrder object for modal
  const orderModalData = useMemo(() => {
    if (!orderNumber) return null;

    const fakeOrder: TOrder = {
      _id: 'tmp',
      status: 'created',
      name: 'Заказ',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      number: orderNumber,
      ingredients: [],
    };
    return fakeOrder;
  }, [orderNumber]);

  const onOrderClick = async () => {
    // must have bun + at least one filling/sauce
    if (!bun || items.length === 0) return;

    // redirect unauthenticated users to login and come back after
    if (!isAuth) {
      navigate('/login', { replace: true, state: { from: location } });
      return;
    }

    // API expects an array of ingredient ids, bun twice (top & bottom)
    const getId = (x: any) => ('id' in x ? x.id : x._id);
    const ingredientIds = [getId(bun), ...items.map(getId), getId(bun)];

    const res = await dispatch(placeOrderThunk(ingredientIds) as any);

    if (res.meta?.requestStatus === 'fulfilled') {
      // optionally clear constructor if you have the action:
      // dispatch(clearConstructor());
    }
  };

  const closeOrderModal = () => {
    dispatch(placeOrderActions.clearOrder());
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
export { BurgerConstructor };
