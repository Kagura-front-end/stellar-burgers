import type { RootState } from '../../services/store';
import { FC, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  selectConstructorBun,
  selectConstructorItems,
  selectTotalPrice,
  clearConstructor,
  removeItem,
} from '../../services/constructor/constructor.slice';
import { BurgerConstructorUI } from '../ui/burger-constructor/burger-constructor';
import {
  placeOrderThunk,
  currentOrderActions,
  selectOrderNumber,
  selectOrderRequest,
} from '../../services/orders/currentOrder.slice';

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

  const constructorItems = useMemo(
    () => ({
      bun: bun ? { name: bun.name, price: bun.price, image: bun.image } : null,
      middle: items.map((i) => ({
        uuid: i.uuid,
        name: i.name,
        price: i.price,
        image: i.image,
      })),
    }),
    [bun, items],
  );

  const orderNumber = useAppSelector(selectOrderNumber);
  const orderRequest = useAppSelector(selectOrderRequest);

  const handleRemove = (item: { uuid: string }) => {
    dispatch(removeItem(item.uuid));
  };

  const onOrderClick = async () => {
    if (!bun || items.length === 0) return;

    if (!isAuth) {
      navigate('/login', { replace: true, state: { from: location } });
      return;
    }

    const ingredientIds = [bun._id, ...items.map((i) => i._id), bun._id];

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
      handleRemove={handleRemove}
    />
  );
};

export default BurgerConstructor;
export { BurgerConstructor };
