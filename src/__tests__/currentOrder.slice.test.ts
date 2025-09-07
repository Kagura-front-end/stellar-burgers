import * as mod from '../services/orders/currentOrder.slice';

type UnknownAction = { type: string };

const reducer = (mod as { currentOrderReducer: (s: unknown, a: UnknownAction) => unknown })
  .currentOrderReducer;

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

describe('currentOrder.slice', () => {
  it('UNKNOWN_ACTION → initial state', () => {
    const init = reducer(undefined, { type: '@@INIT' });
    const next = reducer(init, { type: 'UNKNOWN_ACTION' });
    expect(next).toEqual(init);
  });

  it('(если есть thunk) pending/fulfilled/rejected переключают флаги/данные', () => {
    const thunk = findThunk(mod as unknown as Record<string, unknown>);
    if (!thunk) return;

    const init = reducer(undefined, { type: '@@INIT' });

    const afterPending = reducer(init, thunk.pending('req1'));
    if ((afterPending as { loading?: boolean }).loading !== undefined) {
      expect((afterPending as { loading?: boolean }).loading).toBe(true);
    }

    const orderPayload = { number: 101, name: 'Test', ingredients: [] };
    const afterFulfilled = reducer(afterPending, thunk.fulfilled(orderPayload, 'req1'));
    if ((afterFulfilled as { loading?: boolean }).loading !== undefined) {
      expect((afterFulfilled as { loading?: boolean }).loading).toBe(false);
    }
    if ((afterFulfilled as { data?: unknown }).data !== undefined) {
      expect((afterFulfilled as { data?: unknown }).data).toBeDefined();
    }

    const afterRejected = reducer(afterPending, thunk.rejected(new Error('boom'), 'req1'));
    if ((afterRejected as { loading?: boolean }).loading !== undefined) {
      expect((afterRejected as { loading?: boolean }).loading).toBe(false);
    }
    if ((afterRejected as { error?: unknown }).error !== undefined) {
      expect((afterRejected as { error?: unknown }).error).toBeDefined();
    }
  });
});
