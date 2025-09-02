import { FC, useEffect, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

import { fetchFeeds, makeSelectFeedOrderByNumber } from '../../services/orders/publicOrders.slice';

import {
  fetchUserOrders,
  makeSelectOrderByNumber as makeSelectPrivateOrderByNumber,
} from '../../services/orders/userOrders.slice';

import { selectIngredients } from '../../services/ingredients/ingredients.slice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();

  const ingredients: TIngredient[] = useAppSelector(selectIngredients);

  const isFeed = pathname.startsWith('/feed');

  const selector = useMemo(
    () =>
      isFeed
        ? makeSelectFeedOrderByNumber(number ?? '')
        : makeSelectPrivateOrderByNumber(number ?? ''),
    [isFeed, number],
  );

  const order = useAppSelector(selector);

  useEffect(() => {
    if (!order) {
      if (isFeed) {
        dispatch(fetchFeeds());
      } else {
        dispatch(fetchUserOrders());
      }
    }
  }, [order, isFeed, dispatch]);

  const orderInfo = useMemo(() => {
    if (!order || !ingredients.length) return null;

    const date = new Date(order.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = order.ingredients.reduce((acc: TIngredientsWithCount, item) => {
      if (!acc[item]) {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) {
          acc[item] = {
            ...ingredient,
            count: 1,
          };
        }
      } else {
        acc[item].count++;
      }

      return acc;
    }, {});

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0,
    );

    return {
      ...order,
      ingredientsInfo,
      date,
      total,
    };
  }, [order, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
