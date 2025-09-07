import { createAsyncThunk } from '@reduxjs/toolkit';
import type { TOrder } from '@utils-types';

export type FeedResponse = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

const API_BASE = '/api';

export const refreshFeed = createAsyncThunk<FeedResponse, void, { rejectValue: string }>(
  'feed/refresh',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/orders/all`);
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        return rejectWithValue(text || `HTTP ${res.status}`);
      }

      const raw: unknown = await res.json();
      const data = raw as Partial<FeedResponse>;

      const isValid =
        data !== null &&
        typeof data === 'object' &&
        Array.isArray(data.orders) &&
        typeof data.total === 'number' &&
        typeof data.totalToday === 'number';

      if (!isValid) {
        return rejectWithValue('Invalid response payload');
      }

      return {
        orders: data.orders as TOrder[],
        total: data.total as number,
        totalToday: data.totalToday as number,
      };
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Network error';
      return rejectWithValue(message);
    }
  },
);
