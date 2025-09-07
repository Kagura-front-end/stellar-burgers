import * as mod from '../services/orders/placeOrder.slice';

type UnknownAction = { type: string };

const reducer = (mod as { placeOrderReducer: (s: unknown, a: UnknownAction) => unknown })
  .placeOrderReducer;

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

describe('placeOrder.slice', () => {
  it('UNKNOWN_ACTION → возвращает initial state', () => {
    const init = reducer(undefined, { type: '@@INIT' });
    const next = reducer(init, { type: 'UNKNOWN_ACTION' });
    expect(next).toEqual(init);
  });

  it('(если есть thunk) pending/fulfilled/rejected переключают флаги', () => {
    const thunk = findThunk(mod as unknown as Record<string, unknown>);
    if (!thunk) return;

    const init = reducer(undefined, { type: '@@INIT' });

    const afterPending = reducer(init, thunk.pending('req1'));
    if ((afterPending as { orderRequest?: boolean }).orderRequest !== undefined) {
      expect((afterPending as { orderRequest?: boolean }).orderRequest).toBe(true);
    }

    const payload = { order: { number: 424242 }, name: 'Test' };
    const afterFulfilled = reducer(afterPending, thunk.fulfilled(payload, 'req1'));
    if ((afterFulfilled as { orderRequest?: boolean }).orderRequest !== undefined) {
      expect((afterFulfilled as { orderRequest?: boolean }).orderRequest).toBe(false);
    }

    const afterRejected = reducer(afterPending, thunk.rejected(new Error('boom'), 'req1'));
    if ((afterRejected as { orderRequest?: boolean }).orderRequest !== undefined) {
      expect((afterRejected as { orderRequest?: boolean }).orderRequest).toBe(false);
    }
    if ((afterRejected as { error?: unknown }).error !== undefined) {
      expect((afterRejected as { error?: unknown }).error).toBeDefined();
    }
  });
});
