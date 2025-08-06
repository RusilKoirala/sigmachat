import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SigmaIcon from './components/SigmaIcon.jsx';

const BouncingBallGame = () => {
  const [copiedCommand, setCopiedCommand] = useState('');

  const copyCommand = async (command) => {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedCommand(command);
      setTimeout(() => setCopiedCommand(''), 2000);
    } catch (err) {
      console.error('Failed to copy command: ', err);
    }
  };

  const downloadFile = (filename, content) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const samplePygameCode = `import pygame
import random
import sys

# Initialize Pygame
pygame.init()

# Constants
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)
BLUE = (0, 0, 255)

# Create screen
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Sigma Ball Game")

# Ball properties
ball_x = SCREEN_WIDTH // 2
ball_y = SCREEN_HEIGHT // 2
ball_speed_x = random.choice([-5, 5])
ball_speed_y = random.choice([-5, 5])
ball_radius = 20

# Game loop
clock = pygame.time.Clock()
running = True

while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
    
    # Move ball
    ball_x += ball_speed_x
    ball_y += ball_speed_y
    
    # Bounce off walls
    if ball_x <= ball_radius or ball_x >= SCREEN_WIDTH - ball_radius:
        ball_speed_x = -ball_speed_x
    if ball_y <= ball_radius or ball_y >= SCREEN_HEIGHT - ball_radius:
        ball_speed_y = -ball_speed_y
    
    # Fill screen
    screen.fill(BLACK)
    
    # Draw ball
    pygame.draw.circle(screen, RED, (ball_x, ball_y), ball_radius)
    
    # Update display
    pygame.display.flip()
    clock.tick(60)

pygame.quit()
sys.exit()`;

  return (
    <div className="min-h-screen bg-black text-white">
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

      {/* Main Content */}
      <div className="pt-20 px-4 max-w-4xl mx-auto">
        {/* Back Button */}
        <Link 
          to="/codes"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Code Vault
        </Link>

        {/* Game Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
            🎮 Bouncing Ball Game
          </h1>
         
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {/* Step 1 */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg mr-4">1</span>
              Install Python
            </h2>
            <p className="text-gray-300 text-lg mb-4">
              🐍 Make sure you have Python installed. Check by running this command:
            </p>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
              <div className="flex items-center justify-between">
                <code className="text-green-400 text-lg">python --version</code>
                <button
                  onClick={() => copyCommand('python --version')}
                  className="ml-4 p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                  title="Copy command"
                >
                  {copiedCommand === 'python --version' ? (
                    <span className="text-green-400 text-sm">✓ Copied!</span>
                  ) : (
                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg mr-4">2</span>
              Install Pygame
            </h2>

            {/* Screenshot First */}
            <div className="mb-6">
              <p className="text-gray-300 text-lg mb-4">
                This is what it should look like in your terminal:
              </p>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                <img
                  src="/cmdpygame.png"
                  alt="Command line showing pip install pygame"
                  className="w-full rounded border border-gray-600"
                />
              </div>
            </div>

            {/* Command */}
            <p className="text-gray-300 text-lg mb-4">
              📦 Now run this command to install pygame:
            </p>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
              <div className="flex items-center justify-between">
                <code className="text-green-400 text-xl font-bold">pip install pygame</code>
                <button
                  onClick={() => copyCommand('pip install pygame')}
                  className="ml-4 p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                  title="Copy command"
                >
                  {copiedCommand === 'pip install pygame' ? (
                    <span className="text-green-400 text-sm">✓ Copied!</span>
                  ) : (
                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg mr-4">3</span>
              Download & Run
            </h2>
            <p className="text-gray-300 text-lg mb-6">
               Download the game and just click on it to run:
            </p>

            <div className="space-y-6">
              <button
                onClick={() => downloadFile('ball_game.py', samplePygameCode)}
                className="w-full bg-white text-black font-bold py-4 px-6 rounded-lg hover:bg-gray-200 transition-colors text-lg"
              >
                Download ball_game.py
              </button>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
                <h3 className="text-white font-bold mb-3 text-lg"> How to Run:</h3>
                <div className="space-y-3 text-gray-300">
                  <p className="flex items-center">
                    <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">1</span>
                    Find the downloaded file (ball_game.py)
                  </p>
                  <p className="flex items-center">
                    <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">2</span>
                    Double-click on it
                  </p>
                  <p className="flex items-center">
                    <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">3</span>
                    Game window will open automatically!
                  </p>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center py-12">
          <Link 
            to="/codes"
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            ← Back to Code Vault
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BouncingBallGame;
