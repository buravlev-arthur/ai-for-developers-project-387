import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/tokens.css';

async function start() {
  // MSW mock server — раскомментировать для включения моков вместо реального бэкенда
  // const { worker } = await import('./mocks/browser');
  // await worker.start({ onUnhandledRequest: 'bypass' });

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

start();
