import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

import './styles/index.css';

import './services/firebase.ts';
import { Bounce, ToastContainer } from 'react-toastify';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <ToastContainer
      className="text-sm p-3"
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover={false}
      theme="light"
      transition={Bounce}
      stacked
    />
  </React.StrictMode>,
);
