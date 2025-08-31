import { Middleware } from '@reduxjs/toolkit';

type WSConfig = {
  connect: string;
  disconnect: string;
  onOpen: string;
  onClose: string;
  onError: string;
  onMessage: string;
};

export const createSocketMiddleware = (types: WSConfig): Middleware => {
  let socket: WebSocket | null = null;
  let shouldCloseWhenOpen = false;

  return (store) => (next) => (action: unknown) => {
    const result = next(action as any);

    // Small helper to read an action.type safely
    const type = (action as any)?.type as string | undefined;

    if (type === types.connect) {
      // If we already have a socket that is OPEN or CONNECTING, do nothing
      if (
        socket &&
        (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)
      ) {
        return result;
      }

      // Decide URL: allow payload override, else use defaults per slice
      const urlFromAction = (action as any)?.payload as string | undefined;
      if (!urlFromAction) {
        // If your slice hardcodes a URL, you can construct it there and pass here via payload.
        // Without a URL, skip creating a socket.
        return result;
      }

      socket = new WebSocket(urlFromAction);

      socket.onopen = () => {
        store.dispatch({ type: types.onOpen });
        if (shouldCloseWhenOpen && socket?.readyState === WebSocket.OPEN) {
          socket.close();
        }
        shouldCloseWhenOpen = false;
      };

      socket.onclose = () => {
        store.dispatch({ type: types.onClose });
        socket = null;
        shouldCloseWhenOpen = false;
      };

      socket.onerror = () => {
        store.dispatch({ type: types.onError, payload: 'WebSocket error' });
      };

      socket.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          store.dispatch({ type: types.onMessage, payload: data });
        } catch {
          store.dispatch({ type: types.onError, payload: 'Bad message' });
        }
      };
    }

    if (type === types.disconnect) {
      if (!socket) return result;

      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      } else if (socket.readyState === WebSocket.CONNECTING) {
        // Delay the close until it opens to avoid the warning
        shouldCloseWhenOpen = true;
      }
      // Keep `socket` reference; it will be nulled in onclose
    }

    return result;
  };
};
