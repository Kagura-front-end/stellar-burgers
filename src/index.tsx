import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import type { DragDropManager } from 'dnd-core';
import { createDragDropManager } from 'dnd-core';

import { store } from './services/store';
import { router } from './components/app/routes';
import './styles/scrollbar.css';
import './index.css';
import './styles/normalize.css';

declare global {
  interface Window {
    __dndManager?: DragDropManager;
  }
}

function getDndManager(): DragDropManager {
  if (typeof window !== 'undefined') {
    if (!window.__dndManager) {
      window.__dndManager = createDragDropManager(HTML5Backend, window);
    }
    return window.__dndManager;
  }
  return createDragDropManager(HTML5Backend);
}

const container = document.getElementById('root');
if (!container) throw new Error('#root not found');

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <DndProvider manager={getDndManager()}>
        <RouterProvider router={router} />
      </DndProvider>
    </Provider>
  </React.StrictMode>,
);
