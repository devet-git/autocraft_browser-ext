import React from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Bootstraps a React component into a given container ID.
 */
export function boot(Component: React.FC, containerId = 'root') {
  const el = document.getElementById(containerId);
  if (!el) throw new Error(`Container #${containerId} not found`);
  createRoot(el).render(<Component />);
}
