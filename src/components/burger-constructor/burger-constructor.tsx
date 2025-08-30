import { FC, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import type { RootState } from '../../services/store';
import {
  selectConstructorBun,
  selectConstructorItems,
  selectTotalPrice,
  // removeItem, // если нужно удаление, вернём позже — текущий UI его не принимает
} from '../../services/constructor/constructor.slice';
import BurgerConstructorUI from '../ui/burger-constructor/burger-constructor';

const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const bun = useAppSelector((s: RootState) => selectConstructorBun(s));
  const items = useAppSelector((s: RootState) => selectConstructorItems(s));
  const price = useAppSelector((s: RootState) => selectTotalPrice(s));

  // авторизация (используем уже имеющиеся данные)
  const isAuth =
    useAppSelector((s: RootState) => Boolean(s.user?.user)) ||
    Boolean(localStorage.getItem('accessToken'));

  const constructorItems = useMemo(() => ({ bun, ingredients: items }), [bun, items]);

  // пока без API-модалки
  const orderRequest = false;
  const orderModalData = null;

  const onOrderClick = () => {
    // запрет на отправку, если нет булки или начинки
    if (!bun || items.length === 0) return;

    // проверка авторизации
    if (!isAuth) {
      navigate('/login', { replace: true, state: { from: location } });
      return;
    }

    // тут позже вызовете реальный POST заказа
    console.log('Create order', { bun, items, price });
  };

  const closeOrderModal = () => {
    // заглушка до подключения API/модалки заказа
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
