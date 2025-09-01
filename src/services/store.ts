import { configureStore, combineReducers, Middleware } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from 'react-redux';

// Slices
import ingredientsReducer from './ingredients/ingredients.slice';
import { userReducer } from './user/user.slice';
import constructorReducer from './constructor/constructor.slice';

// Public orders slice and middleware
import publicOrdersReducer from './orders/publicOrders.slice';
import { profileOrdersReducer } from './orders/profileOrders.slice';
import { placeOrderReducer } from './orders/placeOrder.slice';
import { currentOrderReducer } from './orders/currentOrder.slice';

// Socket middleware - only one instance
import { socketMiddleware } from './realtime/socketMiddleware';

// ---------------- Root reducer ----------------
const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  user: userReducer,
  burgerConstructor: constructorReducer,

  publicOrders: publicOrdersReducer,
  profileOrders: profileOrdersReducer,

  placeOrder: placeOrderReducer,
  currentOrder: currentOrderReducer,
});

// ---------------- Persist constructor ----------------
const CONSTRUCTOR_STORAGE_KEY = 'sb_constructor';

const persistConstructorMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action as any);

  try {
    const type = (action as any)?.type as string | undefined;
    if (type && type.startsWith('burgerConstructor/')) {
      const state = (store as any).getState();
      const { bun, items } = state.burgerConstructor;
      localStorage.setItem(CONSTRUCTOR_STORAGE_KEY, JSON.stringify({ bun, items }));
    }
  } catch {
    // ignore storage errors
  }

  return result;
};

// ---------------- Store ----------------
export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  // Only one socket middleware instance
  middleware: (getDefault) => getDefault().concat(socketMiddleware(), persistConstructorMiddleware),
});

// Exported types/hooks used across the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
export const useAppDispatch = () => useReduxDispatch<AppDispatch>();

export default store;
