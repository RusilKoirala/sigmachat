import React from 'react';
import { Link } from 'react-router-dom';
import SigmaIcon from './components/SigmaIcon.jsx';
import { AdBanner1, AdBanner2 } from './components/AdManager.jsx';

const Games = () => {
  const games = [
    {
      id: 'snake',
      title: 'Snake Game',
      description: 'Classic snake game with modern controls. Eat food, grow longer, avoid walls!',
      difficulty: 'Easy',
      players: 'Single Player',
      category: 'Arcade',
      route: '/games/snake'
    },
    {
      id: 'tetris',
      title: 'Tetris',
      description: 'The legendary block-stacking puzzle game. Clear lines and beat your high score!',
      difficulty: 'Medium',
      players: 'Single Player',
      category: 'Puzzle',
      route: '/games/tetris'
    },
    {
      id: 'pong',
      title: 'Pong',
      description: 'Classic arcade tennis game. Control the paddle and beat the AI opponent!',
      difficulty: 'Easy',
      players: 'Single Player vs AI',
      category: 'Arcade',
      route: '/games/pong'
    },
    {
      id: 'breakout',
      title: 'Breakout',
      description: 'Break all the bricks with your ball and paddle. Classic arcade action!',
      difficulty: 'Medium',
      players: 'Single Player',
      category: 'Arcade',
      route: '/games/breakout'
    },
    {
      id: 'space-invaders',
      title: 'Space Invaders',
      description: 'Defend Earth from alien invasion! Shoot enemies and avoid their attacks.',
      difficulty: 'Hard',
      players: 'Single Player',
      category: 'Shooter',
      route: '/games/space-invaders'
    },
    {
      id: 'flappy-bird',
      title: 'Flappy Bird',
      description: 'Navigate through pipes by tapping to flap. Simple but challenging!',
      difficulty: 'Hard',
      players: 'Single Player',
      category: 'Arcade',
      route: '/games/flappy-bird'
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-900/20 border-green-600';
      case 'Medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-600';
      case 'Hard': return 'text-red-400 bg-red-900/20 border-red-600';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar */}
      <nav className="bg-black border-b border-gray-800 fixed top-0 left-0 right-0 z-20">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 hover:text-gray-300 transition-colors">
            <SigmaIcon className="w-8 h-8" />
            <span className="font-bold text-xl">SIGMA</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/chat" className="hover:text-gray-300 transition-colors">Chat</Link>
            <Link to="/codes" className="hover:text-gray-300 transition-colors">Codes</Link>
            <Link to="/games" className="text-blue-400 font-medium">Games</Link>
            <Link to="/bhailang" className="hover:text-gray-300 transition-colors">Bhai Lang</Link>
          </div>
        </div>
      </nav>

      {/* Responsive Main Content with Sidebar */}
      <div className="pt-20 flex flex-col lg:flex-row">
        {/* Responsive Ad Sidebar */}
        <aside className="w-full lg:w-44 xl:w-48 bg-gray-950 border-b lg:border-b-0 lg:border-r border-gray-800 lg:min-h-screen">
          <div className="sticky top-20 p-2 lg:space-y-2 max-h-screen overflow-hidden flex flex-row lg:flex-col gap-2 lg:gap-0 justify-center lg:justify-start">
            <div className="w-1/2 lg:w-full">
              <AdBanner1 className="mx-auto" show={true} />
            </div>
            <div className="w-1/2 lg:w-full">
              <AdBanner2 className="mx-auto" show={true} />
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto lg:max-w-none lg:ml-0">
          {/* Header */}
          <div className="text-center mb-8 pt-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Interactive Games
            </h1>
            <p className="text-lg text-gray-400 mb-6">
              Play classic arcade games right in your browser!
            </p>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {games.map((game) => (
              <div key={game.id} className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 transition-all duration-300 hover:transform hover:scale-105">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-white">{game.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor(game.difficulty)}`}>
                      {game.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    {game.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xs text-gray-500">
                      <div>{game.players}</div>
                      <div className="text-blue-400">{game.category}</div>
                    </div>
                  </div>
                  
                  <Link
                    to={game.route}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors text-center block"
                  >
                    Play Game
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Installation Instructions */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Want to Download Games?</h2>
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-green-400 mb-4">Install Python Games</h3>
                  <div className="bg-black rounded p-4 font-mono text-green-400 text-sm mb-4">
                    pip install pygame
                  </div>
                  <p className="text-gray-400 text-sm">
                    Install pygame to run Python-based games on your computer with better graphics and performance.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-blue-400 mb-4">Browser Games</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    All games on this page run directly in your browser - no installation required! 
                    Just click "Play Game" and start playing immediately.
                  </p>
                  <div className="text-xs text-gray-500">
                    Works on: Chrome, Firefox, Safari, Edge
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="text-center py-8">
            <p className="text-xs text-gray-500 font-light">
              Games built with HTML5 Canvas • No downloads required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Games;
