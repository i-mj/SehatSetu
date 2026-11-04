import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Polyfill Promise.try for pdfjs-dist and environments lacking TC39 Promise.try
if (typeof Promise !== 'undefined' && typeof (Promise as any).try !== 'function') {
  (Promise as any).try = function (fn: any, ...args: any[]) {
    return new Promise((resolve) => resolve(fn(...args)));
  };
}

createRoot(document.getElementById('root')!).render(<App />);
