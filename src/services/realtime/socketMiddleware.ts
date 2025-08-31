import type { Middleware, MiddlewareAPI, UnknownAction } from '@reduxjs/toolkit';

type SocketActions = {
  connect: string; // payload: string (ws URL)
  disconnect: string;
  onOpen: string;
  onClose: string;
  onError: string; // payload?: string
  onMessage: string; // payload: unknown (parsed json)
};

// Safe readers for an unknown action
const getType = (a: unknown): string | undefined =>
  typeof a === 'object' && a !== null && typeof (a as any).type === 'string'
    ? (a as any).type
    : undefined;

const getPayload = (a: unknown): unknown =>
  typeof a === 'object' && a !== null ? (a as any).payload : undefined;

export const createSocketMiddleware = (actions: SocketActions): Middleware => {
  let socket: WebSocket | null = null;

  const middleware: Middleware =
    (store: MiddlewareAPI) =>
    (next: (action: unknown) => unknown) =>
    (action: unknown): unknown => {
      const type = getType(action);

      // CONNECT
      if (type === actions.connect) {
        const url = String(getPayload(action) ?? '');

        // close any existing socket before reconnecting
        if (socket) {
          try {
            socket.close(1000, 'reconnect');
          } catch {}
          socket = null;
        }

        socket = new WebSocket(url);

        socket.onopen = () => store.dispatch({ type: actions.onOpen } as UnknownAction);

        socket.onclose = () => {
          store.dispatch({ type: actions.onClose } as UnknownAction);
          socket = null;
        };

        socket.onerror = () =>
          store.dispatch({
            type: actions.onError,
            payload: 'ws error',
          } as UnknownAction);

        socket.onmessage = (evt: MessageEvent<string>) => {
          try {
            const data = JSON.parse(evt.data);
            store.dispatch({
              type: actions.onMessage,
              payload: data,
            } as UnknownAction);
          } catch {
            // ignore malformed frames
          }
        };
      }

      // DISCONNECT
      if (type === actions.disconnect && socket) {
        try {
          socket.close(1000, 'manual disconnect');
        } catch {}
        socket = null;
      }

      return next(action); // must return unknown
    };

  return middleware;
};
