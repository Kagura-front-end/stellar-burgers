import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { TUser } from '../../utils/types';
import {
  loginUserApi,
  getUserApi,
  logoutApi,
  refreshToken as refreshTokenApi,
} from '../../utils/burger-api';

type UserState = {
  user: TUser | null;
  loading: boolean;
  error: string | null;
  isAuth: boolean;
};

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  isAuth: false,
};

export const loginUser = createAsyncThunk<TUser, { email: string; password: string }>(
  'user/login',
  async (credentials) => {
    const data = await loginUserApi(credentials); // returns { success, user, accessToken, refreshToken }
    return data.user;
  },
);

export const fetchUser = createAsyncThunk<TUser>('user/fetch', async () => {
  const user = await getUserApi();
  return user;
});

export const logoutUser = createAsyncThunk<void>('user/logout', async () => {
  await logoutApi();
});

export const refreshSession = createAsyncThunk<void>('user/refresh', async () => {
  await refreshTokenApi();
});

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUser(state) {
      state.user = null;
      state.isAuth = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (b) => {
    b
      // login
      .addCase(loginUser.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload; // <- payload is TUser
        s.isAuth = true;
      })
      .addCase(loginUser.rejected, (s, a) => {
        s.loading = false;
        s.error = String(a.error.message || 'Login failed');
        s.user = null;
        s.isAuth = false;
      })

      // fetch user
      .addCase(fetchUser.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchUser.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload;
        s.isAuth = true;
      })
      .addCase(fetchUser.rejected, (s, a) => {
        s.loading = false;
        s.error = String(a.error.message || 'Fetch user failed');
        s.user = null;
        s.isAuth = false;
      })

      // logout
      .addCase(logoutUser.fulfilled, (s) => {
        s.user = null;
        s.isAuth = false;
      });
  },
});

export const { resetUser } = slice.actions;
export default slice.reducer;
export const selectUser = (s: { user: UserState }) => s.user.user;
export const selectIsAuth = (s: { user: UserState }) => s.user.isAuth;
