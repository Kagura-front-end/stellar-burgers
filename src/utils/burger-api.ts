import { setCookie, getCookie } from './cookie';
import type { TIngredient, TOrder, TUser } from './types';

const URL = (process.env.BURGER_API_URL as string) || 'https://norma.nomoreparties.space/api';

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject({ ...err, status: res.status }));

type TServerResponse<T> = { success: boolean } & T;

type TRefreshResponse = TServerResponse<{
  refreshToken: string;

  accessToken: string;
}>;

type TUserResponse = TServerResponse<{ user: TUser }>;
type TAuthResponse = TServerResponse<{ user: TUser; accessToken: string; refreshToken: string }>;
type TIngredientsResponse = TServerResponse<{ data: TIngredient[] }>;
type TNewOrderResponse = TServerResponse<{ order: TOrder; name: string }>;
export type TFeedsResponse = TServerResponse<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}>;

export const refreshToken = (): Promise<TRefreshResponse> =>
  fetch(`${URL}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({ token: localStorage.getItem('refreshToken') }),
  }).then((res) => checkResponse<TRefreshResponse>(res));

export const fetchWithRefresh = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const accessToken = getCookie('accessToken');
  const baseHeaders = (options.headers as Record<string, string>) || {};

  const hasAuthHeader = Object.keys(baseHeaders).some((k) => k.toLowerCase() === 'authorization');

  const headers: Record<string, string> = {
    ...baseHeaders,
    'Content-Type': 'application/json;charset=utf-8',
  };
  if (!hasAuthHeader && accessToken) {
    headers.Authorization = accessToken.startsWith('Bearer ')
      ? accessToken
      : `Bearer ${accessToken}`;
  }

  const res = await fetch(url, { ...options, headers: headers as HeadersInit });

  try {
    return await checkResponse<T>(res);
  } catch (err: any) {
    const message = err?.message || err?.error?.message;
    const status = err?.status;

    if (
      message === 'jwt expired' ||
      message === 'Token is invalid' ||
      status === 401 ||
      status === 403
    ) {
      const rt = await refreshToken();

      const rawAccess = rt.accessToken.startsWith('Bearer ')
        ? rt.accessToken.slice('Bearer '.length)
        : rt.accessToken;

      setCookie('accessToken', rawAccess);
      localStorage.setItem('refreshToken', rt.refreshToken);

      const retryHeaders: Record<string, string> = {
        ...baseHeaders,
        'Content-Type': 'application/json;charset=utf-8',
      };
      if (!hasAuthHeader && rawAccess) {
        retryHeaders.Authorization = `Bearer ${rawAccess}`;
      }

      const retry = await fetch(url, { ...options, headers: retryHeaders as HeadersInit });
      return checkResponse<T>(retry);
    }

    throw err;
  }
};

export const getIngredientsApi = (): Promise<TIngredient[]> =>
  fetch(`${URL}/ingredients`).then((res) =>
    checkResponse<TIngredientsResponse>(res).then((d) => d.data),
  );

export const registerUserApi = (data: { name: string; email: string; password: string }) =>
  fetch(`${URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(data),
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((d) => {
      const raw = d.accessToken.startsWith('Bearer ')
        ? d.accessToken.slice('Bearer '.length)
        : d.accessToken;
      setCookie('accessToken', raw);
      localStorage.setItem('refreshToken', d.refreshToken);
      return d.user;
    });

export const loginUserApi = (data: { email: string; password: string }) =>
  fetch(`${URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(data),
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((d) => {
      const raw = d.accessToken.startsWith('Bearer ')
        ? d.accessToken.slice('Bearer '.length)
        : d.accessToken;
      setCookie('accessToken', raw);
      localStorage.setItem('refreshToken', d.refreshToken);
      return d.user;
    });

export const logoutApi = () =>
  fetch(`${URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({ token: localStorage.getItem('refreshToken') }),
  })
    .then((res) => checkResponse<TServerResponse<{ message: string }>>(res))
    .finally(() => {
      setCookie('accessToken', '', { expires: -1 });
      localStorage.removeItem('refreshToken');
    });

export const getUserApi = () =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`).then((d) => d.user);

export const updateUserApi = (user: Partial<TUser> & { password?: string }) =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    method: 'PATCH',
    body: JSON.stringify(user),
  }).then((d) => d.user);

export const forgotPasswordApi = ({ email }: { email: string }) =>
  fetch(`${URL}/password-reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({ email }),
  }).then((res) => checkResponse<TServerResponse<{ message: string }>>(res));

export const resetPasswordApi = ({ password, token }: { password: string; token: string }) =>
  fetch(`${URL}/password-reset/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({ password, token }),
  }).then((res) => checkResponse<TServerResponse<{ message: string }>>(res));

export const makeOrderApi = (ingredients: string[]) =>
  fetchWithRefresh<TNewOrderResponse>(`${URL}/orders`, {
    method: 'POST',
    body: JSON.stringify({ ingredients }),
  });

export const orderBurgerApi = makeOrderApi;

export const getOrdersApi = (): Promise<TOrder[]> =>
  fetchWithRefresh<TFeedsResponse>(`${URL}/orders`, {
    method: 'GET',
  }).then((data) => {
    if (data?.success) return data.orders;
    return Promise.reject(data);
  });

export const getFeedsApi = (): Promise<TFeedsResponse> =>
  fetch(`${URL}/orders/all`)
    .then((res) => checkResponse<TFeedsResponse>(res))
    .then((data) => (data?.success ? data : Promise.reject(data)));
