import type { Middleware } from '@reduxjs/toolkit';

type SocketActions = {
  connect: string; // payload: string (WS URL)
  disconnect: string;
  onOpen: string;
  onClose: string;
  onError: string; // payload?: string
  onMessage: string; // payload: unknown (parsed JSON)
};

export const createSocketMiddleware = (actions: SocketActions): Middleware => {
  let socket: WebSocket | null = null;

  return (store) => (next) => (action) => {
    const type = (action as any)?.type as string | undefined;
    const payload = (action as any)?.payload as unknown;

    // CONNECT
    if (type === actions.connect) {
      const url = String(payload);

      // Replace existing socket if any
      if (socket) {
        try {
          socket.close(1000, 'reconnect');
        } catch {}
        socket = null;
      }

      socket = new WebSocket(url);

      socket.onopen = () => store.dispatch({ type: actions.onOpen } as any);

      socket.onclose = () => {
        store.dispatch({ type: actions.onClose } as any);
        socket = null;
      };

      socket.onerror = () => {
        store.dispatch({ type: actions.onError, payload: 'ws error' } as any);
      };

      socket.onmessage = (event: MessageEvent<string>) => {
        try {
          const data = JSON.parse(event.data);
          store.dispatch({ type: actions.onMessage, payload: data } as any);
        } catch {
          // ignore malformed frames
        }
      };
    }

    // DISCONNECT
    if (type === actions.disconnect) {
      if (socket) {
        try {
          socket.close(1000, 'manual disconnect');
        } catch {}
        socket = null;
      }
    }

    return next(action as any);
  };
};
