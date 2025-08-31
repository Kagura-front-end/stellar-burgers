import type { Middleware } from '@reduxjs/toolkit';

export type SocketActions = {
  connect: string; // action type string
  disconnect: string;
  onOpen: string;
  onClose: string;
  onError: string; // payload?: string
  onMessage: string; // payload: parsed WS JSON
};

export const createSocketMiddleware = (actions: SocketActions): Middleware => {
  let socket: WebSocket | null = null;
  let currentUrl: string | null = null;

  return (store) => (next) => (action: any) => {
    // Используем any для action
    const { type, payload } = action;

    if (type === actions.connect) {
      const url = String(payload);

      // Prevent reconnect storm: if same URL and socket is alive or connecting — ignore
      if (
        socket &&
        (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) &&
        currentUrl === url
      ) {
        return next(action);
      }

      // If URL changed, close old one
      if (socket) {
        try {
          socket.close(1000, 'url changed');
        } catch {}
        socket = null;
      }

      currentUrl = url;
      socket = new WebSocket(url);

      socket.onopen = () => store.dispatch({ type: actions.onOpen });

      socket.onclose = () => {
        store.dispatch({ type: actions.onClose });
        socket = null;
      };

      socket.onerror = () => {
        store.dispatch({ type: actions.onError, payload: 'ws error' });
      };

      socket.onmessage = (evt: MessageEvent<string>) => {
        try {
          const data = JSON.parse(evt.data);
          store.dispatch({ type: actions.onMessage, payload: data });
        } catch {
          // ignore malformed frames
        }
      };
    }

    if (type === actions.disconnect) {
      if (socket) {
        try {
          socket.close(1000, 'manual');
        } catch {}
        socket = null;
        currentUrl = null;
      }
    }

    return next(action);
  };
};
