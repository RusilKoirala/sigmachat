import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UsernameContext } from './usernameContext.jsx';
import SigmaIcon from './components/SigmaIcon.jsx';
import { isValidUsername, getUsernameWarning } from './utils/profanityFilter';

function getRandomMathCaptcha() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  return {
    question: `${a} + ${b} = ?`,
    answer: a + b,
  };
}

const MainPage = () => {
  const [username, setUsername] = useState('');
  const [captcha, setCaptcha] = useState(getRandomMathCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const { setUsername: setCtxUsername } = useContext(UsernameContext);
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setError('Username is required.');
      return;
    }

    // Validate username for profanity and appropriateness
    if (!isValidUsername(trimmedUsername)) {
      setError(getUsernameWarning());
      return;
    }

    if (captchaInput.trim() !== String(captcha.answer)) {
      setError('CAPTCHA is incorrect.');
      setCaptcha(getRandomMathCaptcha());
      setCaptchaInput('');
      return;
    }

    setError('');
    setCtxUsername(trimmedUsername);
    localStorage.setItem('sigmachat-username', JSON.stringify(trimmedUsername));
    navigate('/chat');
  };

  return (
    <div className="relative">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-white text-xl font-bold tracking-wider flex items-center space-x-2">
                <SigmaIcon className="w-6 h-6" />
                <span>SIGMA</span>
              </Link>
            </div>
            <div className="flex space-x-8">
              <Link
                to="/chat"
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              >
                Chat
              </Link>
              <Link
                to="/codes"
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              >
                Code
              </Link>
              <Link
                to="/bhailang"
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              >
                Bhai Lang
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Responsive */}
      <section className="relative h-screen bg-black text-white flex flex-col items-center justify-center px-4">
        {/* Main Content */}
        <div className="text-center flex flex-col justify-center items-center max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-black mb-3 md:mb-4 tracking-tighter">
            SIGMA
          </h1>
          <h2 className="text-base md:text-lg lg:text-xl xl:text-2xl font-light mb-6 md:mb-8 text-gray-400">
            A shit chat app for my frds
          </h2>
          <button
            onClick={() => setShowLogin(true)}
            className="px-6 py-3 border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-200 text-sm md:text-base font-medium"
          >
            enter
          </button>
        </div>

        {/* Disclaimer - Responsive Code Window Style */}
        <div className="absolute bottom-2 left-0 right-0 px-2">
          <div className="max-w-xs md:max-w-lg lg:max-w-2xl mx-auto bg-gray-900 border border-gray-700 rounded shadow-lg">
            {/* Window Header */}
            <div className="flex items-center justify-between px-2 py-1 bg-gray-800 border-b border-gray-700 rounded-t">
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-xs text-gray-400 font-mono hidden lg:block">disclaimer.txt</div>
              <div className="w-4"></div>
            </div>

            {/* Content - Responsive */}
            <div className="p-1.5 lg:p-3 font-mono text-xs leading-tight">
              <div className="text-gray-500 mb-0.5">
                <span className="text-gray-600">01</span> <span className="text-blue-400">/**</span>
              </div>
              <div className="text-gray-500 mb-0.5">
                <span className="text-gray-600">02</span> <span className="text-blue-400"> * DISCLAIMER</span>
              </div>
              <div className="text-gray-500 mb-0.5">
                <span className="text-gray-600">03</span> <span className="text-blue-400"> */</span>
              </div>
              <div className="text-gray-300 mb-0.5 leading-tight">
                <span className="text-gray-600">04</span> <span className="text-yellow-400">Users</span> responsible for <span className="text-green-400">content</span> and <span className="text-green-400">actions</span>.
              </div>
              <div className="text-gray-300 mb-0.5 leading-tight">
                <span className="text-gray-600">05</span> Basic <span className="text-purple-400">moderation</span> provided. Use implies
              </div>
              <div className="text-gray-300 leading-tight">
                <span className="text-gray-600">06</span> <span className="text-blue-400">agreement</span>.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-100 text-black">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
              Features
            </h2>
            <p className="text-7xl font-light text-gray-300 mb-8 tracking-wider">None</p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Just a simple, no-nonsense chat for friends. No fancy features, no bloat, no BS.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="text-3xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">Real-time Chat</h3>
              <p className="text-gray-600">Instant messaging with your friends</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Basic Moderation</h3>
              <p className="text-gray-600">Simple spam protection and filters</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Fast & Simple</h3>
              <p className="text-gray-600">No unnecessary features or complexity</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500 font-medium tracking-wide">
              Made with ❤️ by OG Rusil
            </p>
          </div>
        </div>
      </section>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
          <div className="bg-white text-black p-8 rounded-lg shadow-2xl w-full max-w-md mx-4 transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Join the Chat</h2>
              <button
                onClick={() => setShowLogin(false)}
                className="text-gray-500 hover:text-black text-2xl"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:outline-none focus:border-black transition-colors"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  autoFocus
                  maxLength={20}
                  required
                  placeholder="Enter your username"
                />
                <p className="text-xs text-gray-500 mt-1">
                  2-20 characters, letters/numbers only, no bad words
                </p>
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Verification: {captcha.question}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:outline-none focus:border-black transition-colors"
                  value={captchaInput}
                  onChange={e => setCaptchaInput(e.target.value)}
                  required
                  placeholder="Enter the answer"
                />
              </div>
              {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
              <button
                type="submit"
                className="w-full bg-black text-white font-bold py-3 px-4 rounded hover:bg-gray-800 transition-colors"
              >
                ENTER CHAT
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;