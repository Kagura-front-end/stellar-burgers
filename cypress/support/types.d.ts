export {};

type StoreAction = { type: string; payload?: unknown };

declare global {
  interface Window {
    __store: { dispatch: (action: StoreAction) => void };
  }
}

declare namespace Cypress {
  interface AUTWindow extends Window {}
}
