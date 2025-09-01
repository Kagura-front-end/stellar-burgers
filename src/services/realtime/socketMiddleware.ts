// src/services/realtime/socketMiddleware.ts
import type { Middleware } from '@reduxjs/toolkit';
import { publicOrdersActions } from '../orders/publicOrders.slice';

// Module-level refs
let socket: WebSocket | null = null;
let currentUrl: string | null = null;
let wantUrl: string | null = null;
let refs = 0; // how many components currently want the WS

function safeClose(ws: WebSocket, reason: string) {
  if (ws.readyState === WebSocket.CONNECTING) {
    ws.addEventListener('open', () => ws.close(1000, reason), { once: true });
  } else if (ws.readyState === WebSocket.OPEN) {
    try {
      ws.close(1000, reason);
    } catch {}
  } else {
    try {
      ws.close(1000, reason);
    } catch {}
  }
}

function openSocket(url: string, dispatch: any) {
  currentUrl = url;
  socket = new WebSocket(url);

  socket.addEventListener('open', () => {
    // (mute dev logs)
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
    } catch {
      /* ignore malformed frames */
    }
  });

  socket.addEventListener('close', () => {
    // (mute dev logs)
    socket = null;
    currentUrl = null;
    dispatch(publicOrdersActions.onClose());

    // If the app still wants a socket, reopen quietly
    if (refs > 0 && wantUrl) {
      openSocket(wantUrl, dispatch);
    }
  });

  socket.addEventListener('error', () => {
    // mute normal dev noise
    dispatch(publicOrdersActions.onError());
  });
}

export const socketMiddleware =
  (): Middleware =>
  ({ dispatch }) =>
  (next) =>
  (action) => {
    // CONNECT: declare intent and ensure a socket is/will be open
    if (publicOrdersActions.connect.match(action)) {
      const url = action.payload as string;
      refs += 1;
      wantUrl = url;

      if (!socket) {
        openSocket(url, dispatch);
      } else if (currentUrl !== url) {
        // switch URL: close current safely; close handler will reopen to wantUrl
        const ws = socket;
        socket = null;
        safeClose(ws, 'switch');
      } else {
        // same URL: if CONNECTING/OPEN, leave it; if CLOSING/CLOSED, close handler will reopen
      }
    }

    // DISCONNECT: drop intent; close when nobody wants it
    if (publicOrdersActions.disconnect.match(action)) {
      if (refs > 0) refs -= 1;

      if (refs === 0 && socket) {
        const ws = socket;
        socket = null;
        safeClose(ws, 'manual'); // no “closed before established” warnings
        // close handler will not reopen because refs === 0
      }
    }

    return next(action);
  };
