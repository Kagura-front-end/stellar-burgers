import { createAsyncThunk } from '@reduxjs/toolkit';
import type { TOrder } from '@utils-types';

export type FeedResponse = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

const API_BASE = '/api'; // или 'https://norma.nomoreparties.space/api'

export const refreshFeed = createAsyncThunk<FeedResponse>(
  'feed/refresh',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/orders/all`);
      if (!res.ok) {
        const text = await res.text();
        return rejectWithValue(text || `HTTP ${res.status}`);
      }
      const data = await res.json();
      return data as FeedResponse;
    } catch (e: any) {
      return rejectWithValue(e?.message ?? 'Network error');
    }
  }
);
