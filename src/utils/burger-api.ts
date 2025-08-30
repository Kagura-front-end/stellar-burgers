import { setCookie, getCookie } from './cookie';
import { TIngredient, TOrder, TOrdersData, TUser } from './types';

/**
 * Base URL is injected via dotenv-webpack.
 * .env must contain: BURGER_API_URL=https://norma.nomoreparties.space/api
 */
const URL = process.env.BURGER_API_URL as string;
if (process.env.NODE_ENV === 'development') console.log('BURGER_API_URL =', URL);

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

type TServerResponse<T> = {
  success: boolean;
} & T;

type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

/**
 * Refresh access token using refresh token from localStorage.
 * On success, updates cookies/localStorage.
 */

export const refreshToken = (): Promise<TRefreshResponse> =>
  fetch(`${URL}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken'),
    }),
  }).then((res) => checkResponse<TRefreshResponse>(res));

/**
 * Fetch wrapper that retries once on JWT expiration.
 * It expects Authorization header to be present OR will add it from cookie.
 */

export const fetchWithRefresh = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const opts: RequestInit = {
    ...options,
    headers: {
      ...(options.headers as Record<string, string>),
      authorization:
        (options.headers as Record<string, string>)?.authorization ??
        getCookie('accessToken') ??
        '',
    } as HeadersInit,
  };

  try {
    const res = await fetch(url, opts);
    return await checkResponse<T>(res);
  } catch (err: any) {
    const message = err?.message || err?.error?.message;

    // If token expired — try to refresh & retry once
    if (message === 'jwt expired' || message === 'Token is invalid') {
      const refreshData = await refreshToken();
      if (refreshData?.success) {
        // update storage
        setCookie('accessToken', refreshData.accessToken);
        localStorage.setItem('refreshToken', refreshData.refreshToken);

        // retry with new token
        const retryRes = await fetch(url, {
          ...options,
          headers: {
            ...(options.headers as Record<string, string>),
            authorization: refreshData.accessToken,
          } as HeadersInit,
        });
        return await checkResponse<T>(retryRes);
      }
    }
    return Promise.reject(err);
  }
};

type TIngredientsResponse = TServerResponse<{
  data: TIngredient[];
}>;
export const getIngredientsApi = () =>
  fetch(`${URL}/ingredients`).then((res) =>
    checkResponse<TIngredientsResponse>(res).then((d) => d.data),
  );

export const getFeedsApi = () =>
  fetch(`${URL}/orders/all`).then((res) => checkResponse<TServerResponse<TOrdersData>>(res));

export const getOrdersApi = () =>
  fetchWithRefresh<TServerResponse<TOrdersData>>(`${URL}/orders`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken') ?? '',
    } as HeadersInit,
  });

type TNewOrderResponse = TServerResponse<{
  name: string;
  order: TOrder;
}>;
export const orderBurgerApi = (ingredients: string[]) =>
  fetchWithRefresh<TNewOrderResponse>(`${URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken') ?? '',
    } as HeadersInit,
    body: JSON.stringify({ ingredients }),
  });

type TOrderByNumberResponse = TServerResponse<{
  orders: TOrder[];
}>;
export const getOrderByNumberApi = (number: number) =>
  fetch(`${URL}/orders/${number}`).then((res) =>
    checkResponse<TOrderByNumberResponse>(res).then((d) => d.orders?.[0]),
  );

type TRegisterData = { email: string; password: string; name: string };
type TLoginData = { email: string; password: string };

type TAuthResponse = TServerResponse<{
  user: TUser;
  accessToken: string;
  refreshToken: string;
}>;

export const registerUserApi = (data: TRegisterData) =>
  fetch(`${URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(data),
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((auth) => {
      setCookie('accessToken', auth.accessToken);
      localStorage.setItem('refreshToken', auth.refreshToken);
      return auth;
    });

export const loginUserApi = (data: TLoginData) =>
  fetch(`${URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(data),
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((auth) => {
      setCookie('accessToken', auth.accessToken);
      localStorage.setItem('refreshToken', auth.refreshToken);
      return auth;
    });

export const forgotPasswordApi = (data: { email: string }) =>
  fetch(`${URL}/password-reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(data),
  }).then((res) => checkResponse<TServerResponse<{}>>(res));

export const resetPasswordApi = (data: { password: string; token: string }) =>
  fetch(`${URL}/password-reset/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(data),
  }).then((res) => checkResponse<TServerResponse<{}>>(res));

type TUserResponse = TServerResponse<{ user: TUser }>;

export const getUserApi = () =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken') ?? '',
    } as HeadersInit,
  }).then((d) => d.user);

export const updateUserApi = (user: Partial<TRegisterData>) =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken') ?? '',
    } as HeadersInit,
    body: JSON.stringify(user),
  }).then((d) => d.user);

export const logoutApi = () =>
  fetch(`${URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken'),
    }),
  }).then((res) => checkResponse<TServerResponse<{}>>(res));
