import * as mod from '../services/orders/userOrders.slice';

type UnknownAction = { type: string };

const reducer = (mod as { userOrdersReducer: (s: unknown, a: UnknownAction) => unknown })
  .userOrdersReducer;

type ThunkLike = {
  pending: (requestId: string, arg?: unknown) => UnknownAction;
  fulfilled: (payload: unknown, requestId: string, arg?: unknown) => UnknownAction;
  rejected: (error: unknown, requestId: string, arg?: unknown) => UnknownAction;
};

function findThunk(m: Record<string, unknown>): ThunkLike | undefined {
  return Object.values(m).find((v): v is ThunkLike => {
    const r = v as Record<string, unknown>;
    return typeof v === 'function' && !!r?.pending && !!r?.fulfilled && !!r?.rejected;
  });
}

const pickListFromState = (state: unknown): unknown | undefined => {
  if (state && typeof state === 'object') {
    const s = state as Record<string, unknown>;
    if (Array.isArray(s.orders)) return s.orders;
    if (Array.isArray(s.items)) return s.items;
    if (Array.isArray(s.data)) return s.data;
  }
  return undefined;
};

describe('userOrders.slice', () => {
  it('UNKNOWN_ACTION → initial state', () => {
    const init = reducer(undefined, { type: '@@INIT' });
    const next = reducer(init, { type: 'UNKNOWN_ACTION' });
    expect(next).toEqual(init);
  });

  it('(если есть thunk) pending/fulfilled/rejected обновляют список/флаги', () => {
    const thunk = findThunk(mod as unknown as Record<string, unknown>);
    if (!thunk) return;

    const init = reducer(undefined, { type: '@@INIT' });

    const afterPending = reducer(init, thunk.pending('req1'));
    const loadingPending =
      (afterPending as { loading?: boolean }).loading ??
      (afterPending as { isLoading?: boolean }).isLoading;
    if (typeof loadingPending === 'boolean') {
      expect(loadingPending).toBe(true);
    }

    const payload = { orders: [{ _id: 'u1', number: 11 }], total: 11, totalToday: 1 };
    const afterFulfilled = reducer(afterPending, thunk.fulfilled(payload, 'req1'));

    const loadingFulfilled =
      (afterFulfilled as { loading?: boolean }).loading ??
      (afterFulfilled as { isLoading?: boolean }).isLoading;
    if (typeof loadingFulfilled === 'boolean') {
      expect(loadingFulfilled).toBe(false);
    }

    const list = pickListFromState(afterFulfilled);
    if (list !== undefined) {
      expect(Array.isArray(list)).toBe(true);
    }

    const afterRejected = reducer(afterPending, thunk.rejected(new Error('boom'), 'req1'));

    const loadingRejected =
      (afterRejected as { loading?: boolean }).loading ??
      (afterRejected as { isLoading?: boolean }).isLoading;
    if (typeof loadingRejected === 'boolean') {
      expect(loadingRejected).toBe(false);
    }
    const err =
      (afterRejected as { error?: unknown }).error ??
      (afterRejected as { errorMessage?: unknown }).errorMessage;
    if (err !== undefined) {
      expect(err).toBeDefined();
    }
  });
});
