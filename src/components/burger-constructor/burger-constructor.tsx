import { FC, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import type { RootState } from '../../services/store';
import {
  selectConstructorBun,
  selectConstructorItems,
  selectTotalPrice,
} from '../../services/constructor/constructor.slice';
import BurgerConstructorUI from '../ui/burger-constructor/burger-constructor';

// ⬇️ NEW: real order thunk + selectors
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

  // auth check (as you already used)
  const isAuth =
    useAppSelector((s: RootState) => Boolean(s.user?.user)) ||
    Boolean(localStorage.getItem('accessToken'));

  const constructorItems = useMemo(() => ({ bun, ingredients: items }), [bun, items]);

  // ⬇️ read order state (for modal)
  const orderNumber = useAppSelector(selectOrderNumber);
  const orderRequest = useAppSelector(selectOrderRequest);

  const onOrderClick = async () => {
    if (!bun || items.length === 0) return;

    if (!isAuth) {
      navigate('/login', { replace: true, state: { from: location } });
      return;
    }

    // API expects bun twice: at start and end
    const ingredientIds = [bun._id, ...items.map((i) => i._id), bun._id];
    await dispatch(placeOrderThunk(ingredientIds));
    // Feed (/feed) will update via WS automatically.
  };

  const closeOrderModal = () => {
    dispatch(currentOrderActions.clearOrder());
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderNumber={orderNumber} // ✅ use the new prop
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};

export default BurgerConstructor;
export { BurgerConstructor };
