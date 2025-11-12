import React, { useState, useEffect, useRef } from 'react';
import { gameAPI } from './gameAPI';
import './GamePage.css';

const GamePage = ({ user, gameSettings, onBack }) => {
  const [questionData, setQuestionData] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [gameStatus, setGameStatus] = useState('playing'); // playing, correct, wrong, timeout, gameOver
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [rabbitAnimation, setRabbitAnimation] = useState('idle');
  const [showGameOver, setShowGameOver] = useState(false);
  const [gameSessionId, setGameSessionId] = useState(null);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isMiniGame, setIsMiniGame] = useState(false);
  const [miniGameChances, setMiniGameChances] = useState(3); // 3 chances to continue
  const [showMiniGamePopup, setShowMiniGamePopup] = useState(false);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  // Simple carrot counting mini-game data (including 0 carrots)
  const miniGames = [
    {
      question: "",
      solution: 0,
      carrots: 5,
      description: "No carrots! Count carefully!"
    },
    {
      question: "🥕",
      solution: 1,
      carrots: 5
    },
    {
      question: "🥕🥕",
      solution: 2,
      carrots: 10
    },
    {
      question: "🥕🥕🥕",
      solution: 3,
      carrots: 10
    },
    {
      question: "🥕🥕🥕🥕",
      solution: 4,
      carrots: 10
    },
    {
      question: "🥕🥕🥕🥕🥕",
      solution: 5,
      carrots: 15
    },
    {
      question: "🥕🥕🥕🥕🥕🥕",
      solution: 6,
      carrots: 20
    },
    {
      question: "🥕🥕🥕🥕🥕🥕🥕",
      solution: 7,
      carrots: 25
    },
    {
      question: "🥕🥕🥕🥕🥕🥕🥕🥕",
      solution: 8,
      carrots: 30
    }
  ];

  // Get user from localStorage
  const getStoredUser = () => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : user;
    } catch (error) {
      console.error('Error reading user from localStorage:', error);
      return user;
    }
  };

  // Get time based on difficulty from level selection
  const getTimeForDifficulty = () => {
    if (!gameSettings) return 60;

    switch (gameSettings.name) {
      case 'Easy': return 60;
      case 'Medium': return 40;
      case 'Hard': return 30;
      case 'Expert': return 15;
      default: return 60;
    }
  };

  // Save score to backend - FIXED VERSION
  const saveScoreToBackend = async (finalScore, status, correctAnswers) => {
    try {
      const currentUser = getStoredUser();

      // Map frontend status to backend enum values
      const statusMap = {
        'correct': 'completed',
        'wrong': 'completed',
        'timeout': 'completed',
        'gameOver': 'completed',
        'playing': 'active'
      };

      const gameData = {
        userId: currentUser?.id,
        username: currentUser?.username,
        score: finalScore,
        difficulty: gameSettings?.name || 'Easy',
        status: statusMap[status] || 'completed',
        correctAnswers: correctAnswers,
        totalQuestions: totalQuestions,
        gameType: isMiniGame ? 'mini-carrot-counting' : 'carrot-counting',
        sessionId: gameSessionId
      };

      console.log('Saving score:', gameData);
      await gameAPI.saveScore(gameData);
      console.log('Score saved successfully');
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  // Start new game session
  const startNewGameSession = async () => {
    try {
      const currentUser = getStoredUser();
      const sessionData = {
        userId: currentUser?.id,
        username: currentUser?.username,
        difficulty: gameSettings?.name || 'Easy',
        startTime: new Date().toISOString(),
        status: 'active'
      };

      const response = await gameAPI.saveGameSession(sessionData);
      setGameSessionId(response.data.sessionId);
    } catch (error) {
      console.error('Error starting game session:', error);
    }
  };

  // Update game session
  const updateGameSession = async (status, finalScore) => {
    try {
      if (gameSessionId) {
        const updateData = {
          endTime: new Date().toISOString(),
          status: status,
          finalScore: finalScore,
          correctAnswers: consecutiveCorrect,
          totalQuestions: totalQuestions
        };

        console.log('Updating session:', gameSessionId, updateData);
        await gameAPI.updateGameSession(gameSessionId, updateData);
      }
    } catch (error) {
      console.error('Error updating game session:', error);
    }
  };

  // Fetch question from heart API
  const fetchQuestion = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setRabbitAnimation('thinking');
      setIsMiniGame(false);

      const response = await fetch('https://marcconrad.com/uob/heart/api.php');

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      setQuestionData(data);
      setGameStatus('playing');
      setUserAnswer('');

      // Reset timer for new question with the correct difficulty time
      const initialTime = getTimeForDifficulty();
      setTimeLeft(initialTime);
      setRabbitAnimation('idle');

      // Increment total questions counter
      setTotalQuestions(prev => prev + 1);

    } catch (err) {
      console.error('Error fetching question:', err);
      setError('Failed to load question. Please try again.');
      setRabbitAnimation('sad');
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // Simple carrot counting mini-game
  const startMiniGame = () => {
    setIsLoading(true);
    setRabbitAnimation('excited');

    setTimeout(() => {
      // Select a random mini-game
      const randomGame = miniGames[Math.floor(Math.random() * miniGames.length)];
      setQuestionData(randomGame);
      setGameStatus('playing');
      setUserAnswer('');

      // Set shorter time for mini-game
      setTimeLeft(20);
      setIsMiniGame(true);
      setRabbitAnimation('idle');
      setIsLoading(false);

      setTimeout(() => inputRef.current?.focus(), 100);
    }, 1000);
  };

  // Handle mini-game continuation
  const handleMiniGameContinue = () => {
    setShowMiniGamePopup(false);
    setGameStatus('playing');
    
    // Start mini-game
    startMiniGame();
  };

  // Handle mini-game success
  const handleMiniGameSuccess = () => {
    setShowMiniGamePopup(false);
    setMiniGameChances(prev => prev - 1);
    setGameStatus('playing');
    setRabbitAnimation('happy');
    
    // Continue with main game
    setTimeout(() => {
      fetchQuestion();
    }, 1000);
  };

  // Handle mini-game failure
  const handleMiniGameFailure = () => {
    setShowMiniGamePopup(false);
    setMiniGameChances(prev => prev - 1);
    
    if (miniGameChances <= 1) {
      // No more chances, game over
      handleGameOver('wrong');
    } else {
      // Show mini-game popup again
      setTimeout(() => {
        setShowMiniGamePopup(true);
      }, 500);
    }
  };

  useEffect(() => {
    const initialTime = getTimeForDifficulty();
    setTimeLeft(initialTime);
    fetchQuestion();
    startNewGameSession();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft > 0 && gameStatus === 'playing') {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);

        // Change rabbit animation based on time left
        const totalTime = isMiniGame ? 20 : getTimeForDifficulty();
        if (timeLeft <= totalTime * 0.3) {
          setRabbitAnimation('nervous');
        } else if (timeLeft <= totalTime * 0.6) {
          setRabbitAnimation('alert');
        }
      }, 1000);
    } else if (timeLeft === 0 && gameStatus === 'playing') {
      if (isMiniGame) {
        handleMiniGameFailure();
      } else {
        handleGameOver('timeout');
      }
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

  // Handle game over
  const handleGameOver = async (reason) => {
    setGameStatus('gameOver');
    setRabbitAnimation('sad');

    // Save score to backend
    await saveScoreToBackend(score, reason, consecutiveCorrect);
    await updateGameSession('completed', score);

    // Show game over popup after a short delay
    setTimeout(() => {
      setShowGameOver(true);
    }, 1000);
  };

  // Handle answer submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userAnswer.trim() || !questionData || gameStatus !== 'playing') return;

    const userAnswerNum = parseInt(userAnswer);
    
    // Allow 0 as valid answer
    if (userAnswerNum === questionData.solution) {
      if (isMiniGame) {
        // Mini-game success
        setGameStatus('correct');
        const carrotsEarned = questionData.carrots;
        const newScore = score + carrotsEarned;
        setScore(newScore);
        setRabbitAnimation('happy');
        
        // Save progress
        await saveScoreToBackend(newScore, 'correct', consecutiveCorrect);
        
        // Show success message and then continue to main game
        setTimeout(() => {
          handleMiniGameSuccess();
        }, 1500);
      } else {
        // Main game success
        setGameStatus('correct');
        const carrotsEarned = questionData.carrots || 10; // Default carrots if not specified
        const newScore = score + carrotsEarned;
        setScore(newScore);
        setConsecutiveCorrect(prev => prev + 1);
        setRabbitAnimation('happy');
        
        // Save progress after correct answer
        await saveScoreToBackend(newScore, 'correct', consecutiveCorrect + 1);
      }
    } else {
      if (isMiniGame) {
        // Mini-game failure
        handleMiniGameFailure();
      } else {
        // Main game failure - offer mini-game chance
        if (miniGameChances > 0) {
          setShowMiniGamePopup(true);
        } else {
          handleGameOver('wrong');
        }
      }
    }
  };

  // Continue with mini-game (from game over popup)
  const handleContinue = async () => {
    setShowGameOver(false);
    setGameStatus('playing');
    setMiniGameChances(3); // Reset chances
    
    // Start mini-game instead of regular game
    startMiniGame();
  };

  // Try again - restart the game
  const handleTryAgain = async () => {
    setShowGameOver(false);
    setShowMiniGamePopup(false);

    // Reset all game state
    setScore(0);
    setConsecutiveCorrect(0);
    setTotalQuestions(0);
    setGameStatus('playing');
    setRabbitAnimation('idle');
    setIsMiniGame(false);
    setMiniGameChances(3);

    // Start new session
    await startNewGameSession();

    // Load new question from main API
    await fetchQuestion();
  };

  // Next Question (for correct answers in main game)
  const handleNext = () => {
    setRabbitAnimation('excited');
    setTimeout(() => {
      fetchQuestion();
    }, 500);
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Get timer color based on remaining time
  const getTimerColor = () => {
    const totalTime = isMiniGame ? 20 : getTimeForDifficulty();
    const percentage = (timeLeft / totalTime) * 100;

    if (percentage > 50) return '#4CAF50'; // Green
    if (percentage > 25) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  // Get timer warning state
  const getTimerWarning = () => {
    const totalTime = isMiniGame ? 20 : getTimeForDifficulty();
    const percentage = (timeLeft / totalTime) * 100;

    if (percentage > 50) return 'normal';
    if (percentage > 25) return 'warning';
    return 'critical';
  };

  // Get rabbit emoji based on animation state
  const getRabbitEmoji = () => {
    switch (rabbitAnimation) {
      case 'happy': return '🐰✨';
      case 'sad': return '🐰😢';
      case 'excited': return '🐰⚡';
      case 'thinking': return '🐰🤔';
      case 'nervous': return '🐰😰';
      case 'alert': return '🐰👀';
      case 'timeout': return '🐰⏰';
      case 'idle':
      default: return '🐰';
    }
  };

  return (
    <div className="jungle-game-container">
      {/* Jungle Background */}
      <div className="jungle-game-background">
        <div className="jungle-tree tree-1">🌴</div>
        <div className="jungle-tree tree-2">🌳</div>
        <div className="jungle-tree tree-3">🎄</div>
        <div className="jungle-vine vine-1">🌿</div>
        <div className="jungle-vine vine-2">🍃</div>
        <div className="jungle-rock rock-1">🪨</div>
        <div className="jungle-rock rock-2">🥌</div>
        <div className="floating-carrot carrot-1">🥕</div>
        <div className="floating-carrot carrot-2">🥕</div>
        <div className="floating-carrot carrot-3">🥕</div>
        <div className="jungle-flower flower-1">🌼</div>
        <div className="jungle-flower flower-2">🌺</div>
        <div className="jungle-flower flower-3">🌸</div>
      </div>

      <div className="jungle-game-content">
        {/* Header */}
        <header className="jungle-game-header">
          <div className="jungle-header-left">
            <button className="jungle-back-button" onClick={onBack}>
              <span className="jungle-back-icon">←</span>
              Back to Jungle
            </button>
          </div>

          <div className="jungle-header-center">
            <h1>
              {isMiniGame ? "Thumper's Quick Challenge" : "Thumper's Carrot Challenge"}
            </h1>
            <p>
              {isMiniGame
                ? "Quick! Count the carrots before time runs out!"
                : "Help Thumper count the carrots in the garden!"
              }
            </p>
            {gameSettings && !isMiniGame && (
              <div className="jungle-difficulty-info">
                <span className="jungle-difficulty-badge">{gameSettings.name} Mode</span>
                <span className="jungle-difficulty-time">{getTimeForDifficulty()}s per question</span>
              </div>
            )}
            {isMiniGame && (
              <div className="jungle-difficulty-info">
                <span className="jungle-difficulty-badge" style={{ background: '#FF9800' }}>Mini-Game</span>
                <span className="jungle-difficulty-time">20s per question</span>
              </div>
            )}
          </div>

          <div className="jungle-header-right">
            <div className="jungle-user-stats">
              <div className="jungle-stat-item">
                <span className="jungle-stat-label">Player</span>
                <span className="jungle-stat-value">@{user?.username}</span>
              </div>
              <div className="jungle-stat-item">
                <span className="jungle-stat-label">Carrots</span>
                <span className="jungle-stat-value">{score} 🥕</span>
              </div>
              <div className="jungle-stat-item">
                <span className="jungle-stat-label">Streak</span>
                <span className="jungle-stat-value">{consecutiveCorrect} 🔥</span>
              </div>
              {!isMiniGame && (
                <div className="jungle-stat-item">
                  <span className="jungle-stat-label">Second Chances</span>
                  <span className="jungle-stat-value">{miniGameChances} 🎯</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="jungle-main-content">
          {/* Left Side - Game Area */}
          <div className="jungle-game-area">
            {isLoading ? (
              <div className="jungle-loading-state">
                <div className="jungle-loading-spinner"></div>
                <div className="jungle-rabbit-animation">{getRabbitEmoji()}</div>
                <h3>
                  {isMiniGame ? "Thumper is preparing a quick challenge..." : "Thumper is preparing the garden..."}
                </h3>
                <p>
                  {isMiniGame ? "Getting carrots ready..." : "Counting carrots and setting up the challenge..."}
                </p>
              </div>
            ) : error ? (
              <div className="jungle-error-state">
                <div className="jungle-error-icon">{getRabbitEmoji()}</div>
                <h3>Oh no! Thumper needs help!</h3>
                <p>{error}</p>
                <button onClick={isMiniGame ? startMiniGame : fetchQuestion} className="jungle-retry-button">
                  Try Again
                </button>
              </div>
            ) : (
              <div className="jungle-game-card">
                {/* Rabbit Character */}
                <div className="jungle-rabbit-character">
                  <div className={`thumper-rabbit ${rabbitAnimation}`}>
                    <div className="rabbit-ears">
                      <div className="ear left-ear"></div>
                      <div className="ear right-ear"></div>
                    </div>
                    <div className="rabbit-face">
                      <div className="rabbit-eyes">
                        <div className="eye left-eye"></div>
                        <div className="eye right-eye"></div>
                      </div>
                      <div className="rabbit-nose">🐰</div>
                    </div>
                    <div className="rabbit-body"></div>
                  </div>
                  <div className="rabbit-message">
                    {gameStatus === 'playing' && timeLeft > (isMiniGame ? 6 : getTimeForDifficulty() * 0.3) &&
                      (isMiniGame ? "Quick! Count these carrots!" : "Count the carrots quickly!")}
                    {gameStatus === 'playing' && timeLeft <= (isMiniGame ? 6 : getTimeForDifficulty() * 0.3) && "Hurry up! Time's running out!"}
                    {gameStatus === 'correct' && isMiniGame && "Great! You earned bonus carrots! 🎉"}
                    {gameStatus === 'correct' && !isMiniGame && "Yay! You got it right! 🎉"}
                    {gameStatus === 'wrong' && "Oh no! Let's try again! 💪"}
                    {gameStatus === 'timeout' && "Too slow! Be faster next time! ⏰"}
                    {gameStatus === 'gameOver' && "Game Over! Let's play again! 🎮"}
                  </div>
                </div>

                {/* Timer Display */}
                {gameStatus === 'playing' && (
                  <div className="jungle-timer-section">
                    <div className={`jungle-timer-display ${getTimerWarning()}`}>
                      <div className="jungle-timer-circle">
                        <svg className="jungle-timer-svg" viewBox="0 0 100 100">
                          <circle
                            className="jungle-timer-bg"
                            cx="50"
                            cy="50"
                            r="45"
                          />
                          <circle
                            className="jungle-timer-progress"
                            cx="50"
                            cy="50"
                            r="45"
                            style={{
                              stroke: getTimerColor(),
                              strokeDashoffset: 283 - (283 * timeLeft) / (isMiniGame ? 20 : getTimeForDifficulty())
                            }}
                          />
                        </svg>
                        <div className="jungle-timer-text">
                          <span className="jungle-time-left">{formatTime(timeLeft)}</span>
                          <span className="jungle-timer-label">Time Left</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="jungle-game-card-header">
                  <h2>
                    {isMiniGame ? "Count the Carrots! 🥕" : "Count the Carrots in the Garden! 🥕"}
                  </h2>
                  <p>
                    {isMiniGame
                      ? questionData?.description || "How many carrots do you see below?"
                      : "How many carrots can you spot in the image below?"
                    }
                  </p>
                  {isMiniGame && questionData?.solution === 0 && (
                    <div className="zero-carrot-warning">
                      ⚠️ Careful! There might be zero carrots!
                    </div>
                  )}
                </div>

                <div className="jungle-image-container">
                  {isMiniGame ? (
                    <div className="mini-game-display">
                      <div className="carrot-display">
                        {questionData?.question || "No carrots visible!"}
                      </div>
                      {!questionData?.question && (
                        <div className="empty-carrot-message">
                          Look carefully! No carrots here!
                        </div>
                      )}
                      <div className="mini-game-hint">
                        {questionData?.solution === 0 
                          ? "Look carefully! Count might be zero!" 
                          : "Simple carrot counting challenge!"
                        }
                      </div>
                    </div>
                  ) : (
                    <img
                      src={questionData?.question}
                      alt="Carrot counting puzzle"
                      className="jungle-puzzle-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300/8bc34a/ffffff?text=Carrot+Counting+Puzzle';
                      }}
                    />
                  )}
                </div>

                {/* Answer Section */}
                {gameStatus === 'playing' && (
                  <div className="jungle-answer-section">
                    <form onSubmit={handleSubmit} className="jungle-answer-form">
                      <div className="jungle-input-container">
                        <input
                          ref={inputRef}
                          type="number"
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          placeholder={isMiniGame 
                            ? "Enter number (0 is possible)..." 
                            : "Enter total number (0 is possible)..."
                          }
                          min="0"
                          max={isMiniGame ? "10" : "100"}
                          required
                          disabled={gameStatus !== 'playing'}
                        />
                        <button
                          type="submit"
                          className="jungle-submit-btn"
                          disabled={!userAnswer.trim()}
                        >
                          <span>Submit Answer</span>
                          <span className="jungle-btn-icon">🎯</span>
                        </button>
                      </div>
                    </form>
                    <div className="zero-hint">
                      💡 Remember: 0 can be a valid answer if there are no carrots!
                    </div>
                  </div>
                )}

                {/* Results Section */}
                {gameStatus === 'correct' && !isMiniGame && (
                  <div className={`jungle-results-section ${gameStatus}`}>
                    <div className="jungle-result-icon">
                      🎉
                    </div>
                    <div className="jungle-result-text">
                      <h3>Brilliant! 🎊</h3>
                      <p>
                        Thumper is happy! You earned {questionData?.carrots || 10} carrots! 🥕
                      </p>
                    </div>
                    <button onClick={handleNext} className="jungle-next-btn">
                      <span>Next Challenge</span>
                      <span className="jungle-btn-icon">➡️</span>
                    </button>
                  </div>
                )}

                {gameStatus === 'correct' && isMiniGame && (
                  <div className={`jungle-results-section ${gameStatus}`}>
                    <div className="jungle-result-icon">
                      🎯
                    </div>
                    <div className="jungle-result-text">
                      <h3>Mini-Game Success! 🎊</h3>
                      <p>
                        You earned {questionData?.carrots} bonus carrots! Continue to main game...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Side - Instructions */}
          <div className="jungle-instructions-sidebar">
            <div className="jungle-instructions-card">
              <h3>
                {isMiniGame ? "Mini-Game Rules 📝" : "How to Play 📝"}
              </h3>
              <div className="jungle-instructions-list">
                {isMiniGame ? (
                  <>
                    <div className="jungle-instruction-item">
                      <span className="jungle-instruction-icon">👀</span>
                      <span>Count the carrots shown above carefully</span>
                    </div>
                    <div className="jungle-instruction-item">
                      <span className="jungle-instruction-icon">⏱️</span>
                      <span>You have 20 seconds to answer</span>
                    </div>
                    <div className="jungle-instruction-item">
                      <span className="jungle-instruction-icon">🔢</span>
                      <span>Enter the number (0 is possible!)</span>
                    </div>
                    <div className="jungle-instruction-item">
                      <span className="jungle-instruction-icon">✅</span>
                      <span>Get it right to earn bonus carrots and continue!</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="jungle-instruction-item">
                      <span className="jungle-instruction-icon">👀</span>
                      <span>Count all carrots in the image carefully</span>
                    </div>
                    <div className="jungle-instruction-item">
                      <span className="jungle-instruction-icon">⏱️</span>
                      <span>Answer before Thumper gets impatient!</span>
                    </div>
                    <div className="jungle-instruction-item">
                      <span className="jungle-instruction-icon">🔢</span>
                      <span>Enter the total number (0 is possible!)</span>
                    </div>
                    <div className="jungle-instruction-item">
                      <span className="jungle-instruction-icon">✅</span>
                      <span>Submit your answer to help Thumper collect carrots</span>
                    </div>
                  </>
                )}
                <div className="jungle-instruction-item">
                  <span className="jungle-instruction-icon">🥕</span>
                  <span>Earn carrots for each correct answer</span>
                </div>
                {!isMiniGame && (
                  <div className="jungle-instruction-item">
                    <span className="jungle-instruction-icon">🎯</span>
                    <span>You have {miniGameChances} second chance(s) with mini-games</span>
                  </div>
                )}
              </div>

              <div className="jungle-pro-tips">
                <h4>Thumper's Tips 💡</h4>
                <p>
                  {isMiniGame 
                    ? "This is your second chance! Count carefully but don't take too long!" 
                    : "Look for carrot patterns and groups to count faster! Start from one corner and work systematically."
                  }
                </p>
                <p className="zero-tip">
                  🎯 <strong>Important:</strong> 0 can be a valid answer! Always count carefully!
                </p>
              </div>

              {/* Game Stats */}
              <div className="jungle-stats-card">
                <h4>Current Game Stats</h4>
                <div className="jungle-stats-details">
                  <div className="stat-row">
                    <span>Current Score:</span>
                    <span className="stat-value">{score} 🥕</span>
                  </div>
                  <div className="stat-row">
                    <span>Correct Streak:</span>
                    <span className="stat-value">{consecutiveCorrect} 🔥</span>
                  </div>
                  <div className="stat-row">
                    <span>Total Questions:</span>
                    <span className="stat-value">{totalQuestions}</span>
                  </div>
                  <div className="stat-row">
                    <span>Second Chances:</span>
                    <span className="stat-value">{miniGameChances} 🎯</span>
                  </div>
                  <div className="stat-row">
                    <span>Game Mode:</span>
                    <span className="stat-value">{isMiniGame ? "Mini-Game" : "Main Game"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mini-Game Chance Popup */}
      {showMiniGamePopup && (
        <div className="jungle-popup-overlay">
          <div className="jungle-popup-dialog mini-game-popup">
            <div className="jungle-popup-header">
              <div className="jungle-popup-icon">
                🎯
              </div>
              <h2 className="jungle-popup-title">
                Second Chance!
              </h2>
            </div>
            
            <div className="jungle-popup-content">
              <div className="mini-game-chance-info">
                <div className="chance-stat">
                  <span className="chance-label">Chances Left</span>
                  <span className="chance-value">{miniGameChances}</span>
                </div>
                <p className="jungle-popup-message">
                  You have {miniGameChances} second chance(s) remaining! 
                  Complete a mini-game to continue your main game with your current score of <strong>{score} carrots</strong>.
                </p>
                <div className="mini-game-rules">
                  <h4>Mini-Game Rules:</h4>
                  <ul>
                    <li>Count the carrots in the simple challenge</li>
                    <li>You have 20 seconds to answer</li>
                    <li>Get it right to continue your main game</li>
                    <li>Get it wrong and lose one chance</li>
                    <li>0 can be a valid answer!</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="jungle-popup-actions">
              <button 
                className="jungle-popup-button jungle-popup-button-secondary"
                onClick={handleTryAgain}
              >
                <span className="button-icon">🔄</span>
                Restart Game
              </button>
              <button 
                className="jungle-popup-button jungle-popup-button-primary"
                onClick={handleMiniGameContinue}
              >
                <span className="button-icon">🎮</span>
                Try Mini-Game ({miniGameChances} left)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Popup */}
      {showGameOver && (
        <div className="jungle-popup-overlay">
          <div className="jungle-popup-dialog">
            <div className="jungle-popup-header">
              <div className="jungle-popup-icon">
                {gameStatus === 'wrong' ? '❌' : '⏰'}
              </div>
              <h2 className="jungle-popup-title">
                {gameStatus === 'wrong' ? 'Game Over!' : "Time's Up!"}
              </h2>
            </div>

            <div className="jungle-popup-content">
              <div className="jungle-final-stats">
                <div className="final-stat">
                  <span className="final-stat-label">Final Score</span>
                  <span className="final-stat-value">{score} 🥕</span>
                </div>
                <div className="final-stat">
                  <span className="final-stat-label">Correct Answers</span>
                  <span className="final-stat-value">{consecutiveCorrect}</span>
                </div>
                <div className="final-stat">
                  <span className="final-stat-label">Total Questions</span>
                  <span className="final-stat-value">{totalQuestions}</span>
                </div>
              </div>
              
              <p className="jungle-popup-message">
                {gameStatus === 'wrong' 
                  ? `The correct answer was ${questionData?.solution}. Don't give up!` 
                  : `Time ran out! The answer was ${questionData?.solution}. Be quicker next time!`
                }
              </p>
            </div>

            <div className="jungle-popup-actions">
              <button 
                className="jungle-popup-button jungle-popup-button-secondary"
                onClick={handleTryAgain}
              >
                <span className="button-icon">🔄</span>
                Try Again
              </button>
              <button 
                className="jungle-popup-button jungle-popup-button-primary"
                onClick={handleContinue}
              >
                <span className="button-icon">🎮</span>
                Play Mini-Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePage;