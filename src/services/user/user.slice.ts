import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { TUser } from '@utils-types';
import {
  getUserApi,
  updateUserApi,
  loginUserApi,
  registerUserApi,
  logoutApi,
} from '../../utils/burger-api';

type UserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  getUserRequest: boolean;
  updateUserRequest: boolean;
  error?: string | null;
};

const initialState: UserState = {
  user: null,
  isAuthChecked: false,
  getUserRequest: false,
  updateUserRequest: false,
  error: null,
};

const unwrapUser = (data: unknown) =>
  (data as any)?.user ? ((data as any).user as TUser) : (data as TUser);

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  const data = await getUserApi();
  return unwrapUser(data);
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (payload: Partial<TUser> & { password?: string }) => {
    const data = await updateUserApi(payload);
    return unwrapUser(data);
  },
);

export const loginUserThunk = createAsyncThunk(
  'user/loginUser',
  async (payload: { email: string; password: string }) => unwrapUser(await loginUserApi(payload)),
);

export const registerUserThunk = createAsyncThunk(
  'user/registerUser',
  async (payload: { name: string; email: string; password: string }) =>
    unwrapUser(await registerUserApi(payload)),
);

export const logoutUserThunk = createAsyncThunk('user/logoutUser', async () => {
  await logoutApi();
  return;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUser(state) {
      state.user = null;
      state.isAuthChecked = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.getUserRequest = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.getUserRequest = false;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.getUserRequest = false;
        state.isAuthChecked = true;
        state.error = action.error.message ?? 'Failed to load user';
      })

      .addCase(updateUser.pending, (state) => {
        state.updateUserRequest = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.updateUserRequest = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateUserRequest = false;
        state.error = action.error.message ?? 'Failed to update user';
      })

      .addCase(loginUserThunk.pending, (state) => {
        state.getUserRequest = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.getUserRequest = false;
        state.isAuthChecked = true;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.getUserRequest = false;
        state.error = action.error.message ?? 'Failed to login';
      })

      .addCase(registerUserThunk.pending, (state) => {
        state.getUserRequest = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
        state.getUserRequest = false;
        state.isAuthChecked = true;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.getUserRequest = false;
        state.error = action.error.message ?? 'Failed to register';
      })

      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      });
  },
});

export const { reducer: userReducer, actions: userActions } = userSlice;

export const selectUser = (s: RootState) => s.user.user;
export const selectIsAuth = (s: RootState) => Boolean(s.user.user);
export const selectUserLoading = (s: RootState) => s.user.getUserRequest || !s.user.isAuthChecked;
export const selectUserUpdating = (s: RootState) => s.user.updateUserRequest;
export const selectUserError = (s: RootState) => s.user.error;
export const selectAuthSubmitting = (s: RootState) => s.user.getUserRequest;
