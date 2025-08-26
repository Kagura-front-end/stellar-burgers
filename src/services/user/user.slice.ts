import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '../../utils/types';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  refreshToken as apiRefresh,
} from '../../utils/burger-api';

type AuthPayload = {
  user: TUser;
  accessToken: string;
  refreshToken: string;
};

type UserState = {
  user: TUser | null;
  accessToken: string;
  refreshToken: string;
  loading: boolean;
  error: string | null;
};

const initialState: UserState = {
  user: null,
  accessToken: '',
  refreshToken: '',
  loading: false,
  error: null,
};

export const loginThunk = createAsyncThunk<AuthPayload, { email: string; password: string }>(
  'user/login',
  async (credentials) => {
    const data = await loginUserApi(credentials);
    return data;
  },
);

export const registerThunk = createAsyncThunk<
  AuthPayload,
  { name: string; email: string; password: string }
>('user/register', async (body) => {
  const data = await registerUserApi(body);
  return data;
});

export const fetchUserThunk = createAsyncThunk<TUser>('user/fetch', async () => {
  const data = await getUserApi();
  return data;
});

export const updateUserThunk = createAsyncThunk<
  TUser,
  Partial<{ name: string; email: string; password: string }>
>('user/update', async (patch) => {
  const data = await updateUserApi(patch);
  return data;
});

export const refreshThunk = createAsyncThunk<{
  accessToken: string;
  refreshToken: string;
}>('user/refresh', async () => {
  const data = await apiRefresh();
  return { accessToken: data.accessToken, refreshToken: data.refreshToken };
});

export const logoutThunk = createAsyncThunk('user/logout', async () => {
  await logoutApi();
});

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearAuth(state) {
      state.user = null;
      state.accessToken = '';
      state.refreshToken = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginThunk.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(loginThunk.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;
        s.accessToken = a.payload.accessToken;
        s.refreshToken = a.payload.refreshToken;
      })
      .addCase(loginThunk.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message || 'Login failed';
      })
      // register
      .addCase(registerThunk.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(registerThunk.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;
        s.accessToken = a.payload.accessToken;
        s.refreshToken = a.payload.refreshToken;
      })
      .addCase(registerThunk.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message || 'Register failed';
      })
      // fetch user
      .addCase(fetchUserThunk.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchUserThunk.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload;
      })
      .addCase(fetchUserThunk.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message || 'Fetch user failed';
      })
      // update user
      .addCase(updateUserThunk.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(updateUserThunk.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload;
      })
      .addCase(updateUserThunk.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message || 'Update user failed';
      })
      // refresh tokens
      .addCase(refreshThunk.fulfilled, (s, a) => {
        s.accessToken = a.payload.accessToken;
        s.refreshToken = a.payload.refreshToken;
      })
      // logout
      .addCase(logoutThunk.fulfilled, (s) => {
        s.user = null;
        s.accessToken = '';
        s.refreshToken = '';
      });
  },
});

export const { clearAuth } = slice.actions;
export default slice.reducer;
