import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UsernameContext } from './usernameContext.jsx';
import SigmaIcon from './components/SigmaIcon.jsx';

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
    if (!username.trim()) {
      setError('Username is required.');
      return;
    }
    if (captchaInput.trim() !== String(captcha.answer)) {
      setError('CAPTCHA is incorrect.');
      setCaptcha(getRandomMathCaptcha());
      setCaptchaInput('');
      return;
    }
    setError('');
    setCtxUsername(username.trim());
    localStorage.setItem('sigmachat-username', JSON.stringify(username.trim()));
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
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen bg-black text-white flex items-center justify-center">
        {/* Main Content */}
        <div className="text-center px-4">
          <h1 className="text-8xl md:text-9xl font-black mb-4 tracking-tighter">
            SIGMA
          </h1>
          <h2 className="text-2xl md:text-3xl font-light mb-8 text-gray-400">
            A shit chat app for my frds
          </h2>
          <button
            onClick={() => setShowLogin(true)}
            className="px-6 py-3 border border-white text-white hover:bg-white hover:text-black transition-all duration-200"
          >
            enter
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white text-black">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-8">Features</h2>
          <p className="text-6xl font-light text-gray-400 mb-12">None</p>
          <p className="text-sm text-gray-500 font-light">
            Made By OG Rusil
          </p>
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