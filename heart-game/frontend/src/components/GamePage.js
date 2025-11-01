import React, { useState, useEffect, useRef } from 'react';
import './GamePage.css';

const GamePage = ({ user, gameSettings, onBack }) => {
  const [questionData, setQuestionData] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [gameStatus, setGameStatus] = useState('playing'); // playing, correct, wrong, timeout
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0); // Start with 0, will be set based on difficulty
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  // Get time based on difficulty from level selection
  const getTimeForDifficulty = () => {
    if (!gameSettings) return 60;
    
    switch(gameSettings.name) { // Changed from 'label' to 'name' to match LevelSelection data
      case 'Easy': return 60;
      case 'Medium': return 40;
      case 'Hard': return 30;
      case 'Expert': return 15;
      default: return 60;
    }
  };

  // ✅ Fetch question directly from API
  const fetchQuestion = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('https://marcconrad.com/uob/heart/api.php');

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      setQuestionData(data);
      setGameStatus('playing');
      setUserAnswer('');
      
      // Reset timer for new question with the correct difficulty time
      const initialTime = getTimeForDifficulty();
      setTimeLeft(initialTime);
      
    } catch (err) {
      console.error('Error fetching question:', err);
      setError('Failed to load question. Please try again.');
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  useEffect(() => {
    // Set initial time based on difficulty when component mounts
    const initialTime = getTimeForDifficulty();
    setTimeLeft(initialTime);
    fetchQuestion();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft > 0 && gameStatus === 'playing') {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameStatus === 'playing') {
      setGameStatus('timeout');
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, gameStatus]);

  // Reset timer when game status changes
  useEffect(() => {
    if (gameStatus !== 'playing') {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }
  }, [gameStatus]);

  // ✅ Handle answer submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userAnswer.trim() || !questionData || gameStatus !== 'playing') return;

    const userAnswerNum = parseInt(userAnswer);
    if (userAnswerNum === questionData.solution) {
      setGameStatus('correct');
      setScore(score + questionData.carrots);
    } else {
      setGameStatus('wrong');
    }
  };

  // ✅ Next Question
  const handleNext = () => {
    fetchQuestion();
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Get timer color based on remaining time
  const getTimerColor = () => {
    const totalTime = getTimeForDifficulty();
    const percentage = (timeLeft / totalTime) * 100;
    
    if (percentage > 50) return '#4CAF50'; // Green
    if (percentage > 25) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  // Get timer warning state
  const getTimerWarning = () => {
    const totalTime = getTimeForDifficulty();
    const percentage = (timeLeft / totalTime) * 100;
    
    if (percentage > 50) return 'normal';
    if (percentage > 25) return 'warning';
    return 'critical';
  };

  return (
    <div className="heart-game-container">
      {/* Background Elements */}
      <div className="heart-game-background">
        <div className="heart-floating-hearts">
          <div className="heart-item heart-1">❤️</div>
          <div className="heart-item heart-2">❤️</div>
          <div className="heart-item heart-3">❤️</div>
          <div className="heart-item heart-4">❤️</div>
        </div>
      </div>

      <div className="heart-game-content">
        {/* Header */}
        <header className="heart-game-header">
          <div className="heart-header-left">
            <button className="heart-back-button" onClick={onBack}>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Back
            </button>
          </div>
          
          <div className="heart-header-center">
            <h1>Heart Math Challenge</h1>
            <p>Test your counting skills!</p>
            {gameSettings && (
              <div className="heart-difficulty-info">
                <span className="heart-difficulty-badge">{gameSettings.name} Mode</span>
                <span className="heart-difficulty-time">{getTimeForDifficulty()}s per question</span>
              </div>
            )}
          </div>

          <div className="heart-header-right">
            <div className="heart-user-stats">
              <div className="heart-stat-item">
                <span className="heart-stat-label">Player</span>
                <span className="heart-stat-value">@{user?.username}</span>
              </div>
              <div className="heart-stat-item">
                <span className="heart-stat-label">Score</span>
                <span className="heart-stat-value">{score} 🥕</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="heart-main-content">
          {/* Left Side - Game Area */}
          <div className="heart-game-area">
            {isLoading ? (
              <div className="heart-loading-state">
                <div className="heart-loading-spinner"></div>
                <h3>Loading Your Challenge...</h3>
                <p>Preparing the heart math puzzle...</p>
              </div>
            ) : error ? (
              <div className="heart-error-state">
                <div className="heart-error-icon">⚠️</div>
                <h3>Oops! Something went wrong</h3>
                <p>{error}</p>
                <button onClick={fetchQuestion} className="heart-retry-button">
                  Try Again
                </button>
              </div>
            ) : (
              <div className="heart-game-card">
                {/* Timer Display */}
                <div className="heart-timer-section">
                  <div className={`heart-timer-display ${getTimerWarning()}`}>
                    <div className="heart-timer-circle">
                      <svg className="heart-timer-svg" viewBox="0 0 100 100">
                        <circle 
                          className="heart-timer-bg" 
                          cx="50" 
                          cy="50" 
                          r="45" 
                        />
                        <circle 
                          className="heart-timer-progress" 
                          cx="50" 
                          cy="50" 
                          r="45" 
                          style={{ 
                            stroke: getTimerColor(),
                            strokeDashoffset: 283 - (283 * timeLeft) / getTimeForDifficulty() 
                          }}
                        />
                      </svg>
                      <div className="heart-timer-text">
                        <span className="heart-time-left">{formatTime(timeLeft)}</span>
                        <span className="heart-timer-label">Time Left</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="heart-game-card-header">
                  <h2>Solve the Heart Puzzle! 🧩</h2>
                  <p>Count all the hearts in the image below</p>
                </div>

                <div className="heart-image-container">
                  <img
                    src={questionData.question}
                    alt="Heart Math Puzzle"
                    className="heart-puzzle-image"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300/667eea/ffffff?text=Heart+Math+Puzzle';
                    }}
                  />
                </div>

                {/* Answer Section */}
                {gameStatus === 'playing' && (
                  <div className="heart-answer-section">
                    <form onSubmit={handleSubmit} className="heart-answer-form">
                      <div className="heart-input-container">
                        <input
                          ref={inputRef}
                          type="number"
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          placeholder="Enter the total number of hearts..."
                          min="1"
                          max="100"
                          required
                          disabled={gameStatus !== 'playing'}
                        />
                        <button 
                          type="submit" 
                          className="heart-submit-btn"
                          disabled={!userAnswer.trim()}
                        >
                          <span>Submit Answer</span>
                          <span className="heart-btn-icon">🎯</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Results Section */}
                {gameStatus !== 'playing' && (
                  <div className={`heart-results-section ${gameStatus}`}>
                    <div className="heart-result-icon">
                      {gameStatus === 'correct' && '🎉'}
                      {gameStatus === 'wrong' && '❌'}
                      {gameStatus === 'timeout' && '⏰'}
                    </div>
                    <div className="heart-result-text">
                      <h3>
                        {gameStatus === 'correct' && 'Brilliant! 🎊'}
                        {gameStatus === 'wrong' && 'Nice Try! 💪'}
                        {gameStatus === 'timeout' && "Time's Up! ⏳"}
                      </h3>
                      <p>
                        {gameStatus === 'correct' && 
                         `You earned ${questionData.carrots} carrots! Keep going! 🥕`}
                        {gameStatus === 'wrong' && 
                         `The correct answer was ${questionData.solution}. You'll get the next one!`}
                        {gameStatus === 'timeout' && 
                         `Time ran out! The answer was ${questionData.solution}. Be faster next time!`}
                      </p>
                    </div>
                    <button onClick={handleNext} className="heart-next-btn">
                      <span>Next Challenge</span>
                      <span className="heart-btn-icon">➡️</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Side - Instructions */}
          <div className="heart-instructions-sidebar">
            <div className="heart-instructions-card">
              <h3>How to Play 📝</h3>
              <div className="heart-instructions-list">
                <div className="heart-instruction-item">
                  <span className="heart-instruction-icon">👀</span>
                  <span>Count all hearts in the image carefully</span>
                </div>
                <div className="heart-instruction-item">
                  <span className="heart-instruction-icon">⏱️</span>
                  <span>Answer before the timer runs out</span>
                </div>
                <div className="heart-instruction-item">
                  <span className="heart-instruction-icon">🔢</span>
                  <span>Enter the total number in the input field</span>
                </div>
                <div className="heart-instruction-item">
                  <span className="heart-instruction-icon">✅</span>
                  <span>Submit your answer to check if you're correct</span>
                </div>
                <div className="heart-instruction-item">
                  <span className="heart-instruction-icon">🥕</span>
                  <span>Earn carrots for each correct answer</span>
                </div>
              </div>

              <div className="heart-pro-tips">
                <h4>Pro Tips 💡</h4>
                <p>Look for patterns and groups to count faster! Start from one corner and work systematically. Watch the timer - it changes color as time runs low!</p>
              </div>

              {/* Difficulty Info */}
              {gameSettings && (
                <div className="heart-difficulty-card">
                  <h4>Current Difficulty</h4>
                  <div className="heart-difficulty-details">
                    <span className="heart-difficulty-name">{gameSettings.name}</span>
                    <span className="heart-difficulty-timer">{getTimeForDifficulty()} seconds per question</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;