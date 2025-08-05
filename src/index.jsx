import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { UsernameProvider } from './usernameContext.jsx';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <UsernameProvider>
        <App />
      </UsernameProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);