import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from 'react-redux';

import ingredientsReducer from './ingredients/ingredients.slice';
import { userReducer } from './user/user.slice';
import constructorReducer from './constructor/constructor.slice';
import { createSocketMiddleware } from './realtime/socketMiddleware';
import { publicOrdersReducer, publicOrdersActions } from './orders/publicOrders.slice';
import { profileOrdersReducer, profileOrdersActions } from './orders/profileOrders.slice';
import { placeOrderReducer } from './orders/placeOrder.slice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  user: userReducer,
  burgerConstructor: constructorReducer,
  publicOrders: publicOrdersReducer,
  profileOrders: profileOrdersReducer,
  placeOrder: placeOrderReducer,
});

// Create WebSocket middlewares
const publicOrdersWS = createSocketMiddleware({
  connect: publicOrdersActions.connect.type,
  disconnect: publicOrdersActions.disconnect.type,
  onOpen: publicOrdersActions.onOpen.type,
  onClose: publicOrdersActions.onClose.type,
  onError: publicOrdersActions.onError.type,
  onMessage: publicOrdersActions.onMessage.type,
});

const profileOrdersWS = createSocketMiddleware({
  connect: profileOrdersActions.connect.type,
  disconnect: profileOrdersActions.disconnect.type,
  onOpen: profileOrdersActions.onOpen.type,
  onClose: profileOrdersActions.onClose.type,
  onError: profileOrdersActions.onError.type,
  onMessage: profileOrdersActions.onMessage.type,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(publicOrdersWS, profileOrdersWS),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// typed hooks
export const useAppSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
export const useAppDispatch = () => useReduxDispatch<AppDispatch>();

export default store;
