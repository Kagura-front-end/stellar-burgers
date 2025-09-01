// src/services/realtime/profileSocketMiddleware.ts
import type { Middleware } from '@reduxjs/toolkit';
import { profileOrdersActions } from '../orders/profileOrders.slice';

let socket: WebSocket | null = null;
let currentUrl: string | null = null;

const readCookie = (name: string): string | null => {
  const m = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([$()*+./?[\\\]^{|}])/g, '\\$1') + '=([^;]*)'),
  );
  return m ? m[1] : null;
};

const getAccessToken = (): string | null => {
  // LS may contain "Bearer ...", cookie is usually URL-encoded "Bearer%20..."
  const ls = localStorage.getItem('accessToken') || '';
  const ckRaw = readCookie('accessToken') || '';
  const ck = ckRaw ? decodeURIComponent(ckRaw) : '';
  const raw = ls || ck;
  if (!raw) return null;
  // strip optional "Bearer "
  return raw.replace(/^Bearer\s+/i, '');
};

export const profileSocketMiddleware: Middleware =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    if (profileOrdersActions.connect.match(action)) {
      const token = getAccessToken();
      if (!token) {
        dispatch(profileOrdersActions.onError('no-token'));
        return next(action);
      }

      const url = `wss://norma.nomoreparties.space/orders?token=${token}`;

      if (socket) {
        const same = currentUrl === url;
        const st = socket.readyState;
        if (!(same && (st === WebSocket.OPEN || st === WebSocket.CONNECTING))) {
          try {
            socket.close(1000, 'reconnect');
          } catch {}
          socket = null;
        }
      }

      if (!socket) {
        currentUrl = url;
        socket = new WebSocket(url);

        socket.addEventListener('open', () => {
          dispatch(profileOrdersActions.onOpen());
        });

        socket.addEventListener('message', async (e: MessageEvent) => {
          try {
            let raw: string;
            if (typeof e.data === 'string') raw = e.data;
            else if (e.data instanceof Blob) raw = await e.data.text();
            else if (e.data instanceof ArrayBuffer) raw = new TextDecoder().decode(e.data);
            else return;

            const data = JSON.parse(raw);
            if (Array.isArray(data.orders)) {
              dispatch(profileOrdersActions.onMessage({ orders: data.orders }));
            }
          } catch {
            // ignore malformed frames
          }
        });

        socket.addEventListener('close', () => {
          socket = null;
          currentUrl = null;
          dispatch(profileOrdersActions.onClose());
        });

        socket.addEventListener('error', () => {
          dispatch(profileOrdersActions.onError('ws-error'));
        });
      }
    }

    if (profileOrdersActions.disconnect.match(action)) {
      if (socket) {
        try {
          if (socket.readyState === WebSocket.CONNECTING) {
            const ws = socket;
            ws.addEventListener('open', () => ws.close(1000, 'manual'), { once: true });
          } else {
            socket.close(1000, 'manual');
          }
        } catch {}
        // onClose will null refs
      }
    }

    return next(action);
  };
