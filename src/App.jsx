import React from 'react';
import { Routes, Route } from 'react-router-dom';
// Firebase modular SDK
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// Hooks
import { useDarkMode } from './hooks';
// Components
import MainPage from './MainPage.jsx';
import ChatPage from './ChatPage.jsx';
import MyCodes from './MyCodesNew.jsx';
import BouncingBallGame from './BouncingBallGame.jsx';
import CProgramming, { VipCodes } from './CProgramming.jsx';
import HTMLProgramming from './HTMLProgramming.jsx';
import BhaiLang from './BhaiLang.jsx';
import Loader from './components/Loader.jsx';
import AdBlockerOverlay from './components/AdBlockerOverlay.jsx';
import { AdProvider } from './components/AdManager.jsx';

import './app.css'; // or './App.css'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_AUTH_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);

const MoonIcon = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="theme-icon"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
      clipRule="evenodd"
    />
  </svg>
);

const SunIcon = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="theme-icon"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M10 2a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 2.22a1 1 0 011.42 1.42l-1.42 1.42a1 1 0 01-1.42-1.42l1.42-1.42zM18 9a1 1 0 100 2h-2a1 1 0 100-2h2zm-2.22 6.78a1 1 0 00-1.42-1.42l-1.42 1.42a1 1 0 001.42 1.42l1.42-1.42zM10 16a1 1 0 01-1-1v-2a1 1 0 112 0v2a1 1 0 01-1 1zm-4.22-2.22a1 1 0 00-1.42 1.42l1.42 1.42a1 1 0 001.42-1.42l-1.42-1.42zM4 11a1 1 0 100-2H2a1 1 0 100 2h2zm2.22-6.78a1 1 0 00-1.42 1.42l1.42 1.42a1 1 0 001.42-1.42L6.22 4.22z"
      clipRule="evenodd"
    />
  </svg>
);

function App() {
  const [darkMode, setDarkMode] = useDarkMode();

  const brandLogo = '/'; // Vite does not support process.env.PUBLIC_URL

  const ThemeIcon = darkMode ? SunIcon : MoonIcon;

  return (
    <AdProvider>
      <div className={`app ${darkMode ? 'dark' : 'light'}-mode`}>
        {/* Ad Blocker Overlay - Blocks entire app */}
        <AdBlockerOverlay />

        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/codes" element={<MyCodes />} />
          <Route path="/codes/bouncing-ball" element={<BouncingBallGame />} />
          <Route path="/codes/vip" element={<VipCodes />} />
          <Route path="/codes/c-programming" element={<CProgramming />} />
          <Route path="/codes/html-programming" element={<HTMLProgramming />} />
          <Route path="/bhailang" element={<BhaiLang />} />
        </Routes>
      </div>
    </AdProvider>
  );
}

export default App;