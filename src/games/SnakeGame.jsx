import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import SigmaIcon from '../components/SigmaIcon.jsx';

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'paused', 'gameOver'
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(localStorage.getItem('snakeHighScore') || 0);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [gameSpeed, setGameSpeed] = useState(150);

  const GRID_SIZE = 20;
  const CANVAS_SIZE = 400;

  // Generate random food position
  const generateFood = useCallback(() => {
    const max = CANVAS_SIZE / GRID_SIZE;
    return {
      x: Math.floor(Math.random() * max),
      y: Math.floor(Math.random() * max)
    };
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection({ x: 0, y: 0 });
    setScore(0);
    setGameSpeed(150);
  }, [generateFood]);

  // Start game
  const startGame = () => {
    resetGame();
    setGameState('playing');
  };

  // Pause/Resume game
  const togglePause = () => {
    setGameState(gameState === 'playing' ? 'paused' : 'playing');
  };

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      setSnake(currentSnake => {
        const newSnake = [...currentSnake];
        const head = { ...newSnake[0] };

        // Move head
        head.x += direction.x;
        head.y += direction.y;

        // Check wall collision
        if (head.x < 0 || head.x >= CANVAS_SIZE / GRID_SIZE || 
            head.y < 0 || head.y >= CANVAS_SIZE / GRID_SIZE) {
          setGameState('gameOver');
          return currentSnake;
        }

        // Check self collision
        if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameState('gameOver');
          return currentSnake;
        }

        newSnake.unshift(head);

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
          setScore(prevScore => {
            const newScore = prevScore + 10;
            if (newScore > highScore) {
              setHighScore(newScore);
              localStorage.setItem('snakeHighScore', newScore);
            }
            return newScore;
          });
          setFood(generateFood());
          setGameSpeed(prevSpeed => Math.max(80, prevSpeed - 2)); // Increase speed
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, gameSpeed);

    return () => clearInterval(gameLoop);
  }, [gameState, direction, food, gameSpeed, highScore, generateFood]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameState === 'playing') {
        switch (e.key) {
          case 'ArrowUp':
            if (direction.y === 0) setDirection({ x: 0, y: -1 });
            break;
          case 'ArrowDown':
            if (direction.y === 0) setDirection({ x: 0, y: 1 });
            break;
          case 'ArrowLeft':
            if (direction.x === 0) setDirection({ x: -1, y: 0 });
            break;
          case 'ArrowRight':
            if (direction.x === 0) setDirection({ x: 1, y: 0 });
            break;
          case ' ':
            e.preventDefault();
            togglePause();
            break;
        }
      } else if (gameState === 'paused' && e.key === ' ') {
        e.preventDefault();
        togglePause();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, direction]);

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw snake
    ctx.fillStyle = '#4ade80';
    snake.forEach((segment, index) => {
      if (index === 0) {
        // Head
        ctx.fillStyle = '#22c55e';
      } else {
        ctx.fillStyle = '#4ade80';
      }
      ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
    });

    // Draw food
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);

    // Draw grid
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_SIZE; i += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }
  }, [snake, food]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="bg-black border-b border-gray-800 fixed top-0 left-0 right-0 z-20">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 hover:text-gray-300 transition-colors">
            <SigmaIcon className="w-8 h-8" />
            <span className="font-bold text-xl">SIGMA</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/games" className="hover:text-gray-300 transition-colors">← Back to Games</Link>
          </div>
        </div>
      </nav>

      <div className="pt-20 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2 text-green-400">Snake Game</h1>
          <div className="flex items-center justify-center space-x-8 text-lg">
            <div>Score: <span className="text-green-400 font-bold">{score}</span></div>
            <div>High Score: <span className="text-yellow-400 font-bold">{highScore}</span></div>
          </div>
        </div>

        <div className="relative">
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className="border-2 border-gray-600 bg-black"
          />

          {/* Game overlays */}
          {gameState === 'menu' && (
            <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center">
              <h2 className="text-3xl font-bold mb-4 text-green-400">Snake Game</h2>
              <p className="text-gray-300 mb-6 text-center max-w-xs">
                Use arrow keys to move. Eat red food to grow. Don't hit walls or yourself!
              </p>
              <button
                onClick={startGame}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold text-lg transition-colors"
              >
                Start Game
              </button>
            </div>
          )}

          {gameState === 'paused' && (
            <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center">
              <h2 className="text-3xl font-bold mb-4 text-yellow-400">Paused</h2>
              <button
                onClick={togglePause}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 rounded-lg font-bold text-lg transition-colors"
              >
                Resume
              </button>
            </div>
          )}

          {gameState === 'gameOver' && (
            <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center">
              <h2 className="text-3xl font-bold mb-2 text-red-400">Game Over!</h2>
              <p className="text-xl mb-4">Final Score: <span className="text-green-400 font-bold">{score}</span></p>
              {score === highScore && score > 0 && (
                <p className="text-yellow-400 mb-4 font-bold">New High Score!</p>
              )}
              <div className="space-x-4">
                <button
                  onClick={startGame}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold transition-colors"
                >
                  Play Again
                </button>
                <Link
                  to="/games"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-bold transition-colors inline-block"
                >
                  Back to Games
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="mt-6 text-center">
          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-4">
            <div></div>
            <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded transition-colors">↑</button>
            <div></div>
            <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded transition-colors">←</button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded transition-colors">↓</button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded transition-colors">→</button>
          </div>
          <p className="text-gray-400 text-sm">
            Use arrow keys or buttons above • Press SPACE to pause
          </p>
          {gameState === 'playing' && (
            <button
              onClick={togglePause}
              className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Pause Game
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
