// src/services/realtime/socketMiddleware.ts
import type { Middleware } from '@reduxjs/toolkit';
import { publicOrdersActions } from '../orders/publicOrders.slice';

export const socketMiddleware = (): Middleware => {
  let socket: WebSocket | null = null;
  let currentUrl: string | null = null;

  return ({ dispatch }) =>
    (next) =>
    (action) => {
      // CONNECT — always replace anything that's not the same OPEN socket
      if (publicOrdersActions.connect.match(action)) {
        const url = action.payload as string;

        if (socket) {
          const sameUrl = currentUrl === url;
          const state = socket.readyState;
          if (!(sameUrl && state === WebSocket.OPEN)) {
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
            dispatch(publicOrdersActions.onOpen());
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
                dispatch(
                  publicOrdersActions.onMessage({
                    orders: data.orders,
                    total: Number(data.total) || 0,
                    totalToday: Number(data.totalToday) || 0,
                  }),
                );
              }
            } catch (err) {
              console.warn('[WS] parse error', err);
            }
          });

          socket.addEventListener('close', () => {
            socket = null;
            currentUrl = null;
            dispatch(publicOrdersActions.onClose());
          });

          socket.addEventListener('error', () => {
            dispatch(publicOrdersActions.onError());
          });
        }
      }

      if (publicOrdersActions.disconnect.match(action)) {
        if (socket) {
          try {
            if (socket.readyState === WebSocket.CONNECTING) {
              const ws = socket;
              ws.addEventListener('open', () => ws.close(1000, 'manual'), { once: true });
            } else {
              socket.close(1000, 'manual');
            }
          } catch {}
          // let 'close' null the refs
        }
      }

      return next(action);
    };
};
