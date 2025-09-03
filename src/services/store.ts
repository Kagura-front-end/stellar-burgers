import { configureStore, combineReducers, Middleware } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from 'react-redux';

import ingredientsReducer from './ingredients/ingredients.slice';
import { userReducer } from './user/user.slice';
import constructorReducer from './constructor/constructor.slice';

import { publicOrdersReducer } from './orders/publicOrders.slice';
import { userOrdersReducer } from './orders/userOrders.slice';
import { placeOrderReducer } from './orders/placeOrder.slice';
import { currentOrderReducer } from './orders/currentOrder.slice';

const CONSTRUCTOR_LS_KEY = 'sb:constructor';

function loadConstructorFromLS() {
  try {
    const raw = localStorage.getItem(CONSTRUCTOR_LS_KEY);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}

function saveConstructorToLS(state: any) {
  try {
    localStorage.setItem(CONSTRUCTOR_LS_KEY, JSON.stringify(state));
  } catch {
    console.warn('Failed to save constructor to localStorage');
  }
}

function throttle<T extends (...args: any[]) => void>(fn: T, wait = 300): T {
  let last = 0;
  return function (this: any, ...args: any[]) {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn.apply(this, args);
    }
  } as T;
}

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  user: userReducer,
  burgerConstructor: constructorReducer,

  publicOrders: publicOrdersReducer,
  userOrders: userOrdersReducer,

  placeOrder: placeOrderReducer,
  currentOrder: currentOrderReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: {
    burgerConstructor: loadConstructorFromLS(),
  } as any,
  devTools: process.env.NODE_ENV !== 'production',
});

store.subscribe(
  throttle(() => {
    const { burgerConstructor } = store.getState() as any;
    saveConstructorToLS(burgerConstructor);
  }, 300),
);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
export const useAppDispatch = () => useReduxDispatch<AppDispatch>();

export default store;
