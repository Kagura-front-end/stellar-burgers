import type { Middleware } from '@reduxjs/toolkit';

export type SocketActions = {
  connect: string; // payload: string (wsUrl)
  disconnect: string;
  onOpen: string;
  onClose: string;
  onError: string; // payload: string
  onMessage: string; // payload: any (JSON parsed)
};

export const createSocketMiddleware =
  (actions: SocketActions): Middleware =>
  (store) => {
    let socket: WebSocket | null = null;

    return (next) => (action) => {
      const { dispatch } = store;

      // 👇 Narrow the action (RTK/Redux types this as unknown)
      const a = action as { type: string; payload?: any };

      if (a.type === actions.connect) {
        const url: string = a.payload;
        if (socket) socket.close();
        socket = new WebSocket(url);

        socket.onopen = () => dispatch({ type: actions.onOpen });
        socket.onerror = () => dispatch({ type: actions.onError, payload: 'WebSocket error' });
        socket.onclose = () => dispatch({ type: actions.onClose });
        socket.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data);
            dispatch({ type: actions.onMessage, payload: data });
          } catch {
            dispatch({ type: actions.onError, payload: 'Bad JSON in WS message' });
          }
        };
      }

      if (a.type === actions.disconnect) {
        if (socket) {
          socket.close();
          socket = null;
        }
      }

      return next(action);
    };
  };
