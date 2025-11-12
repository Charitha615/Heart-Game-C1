import React, { useState, useEffect } from 'react';
import LevelSelection from './LevelSelection';
import { gameAPI } from './gameAPI';
import './Dashboard.css';

const Dashboard = ({ user, onLogout, onStartGame }) => {
    const [currentView, setCurrentView] = useState('dashboard');
    const [isVisible, setIsVisible] = useState(false);
    const [rabbitAnimation, setRabbitAnimation] = useState('idle');
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [userScores, setUserScores] = useState([]);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('global'); // 'global' or 'personal'
    const [userStats, setUserStats] = useState({
        highScore: 0,
        totalCarrots: 0,
        gamesPlayed: 0
    });

    useEffect(() => {
        setIsVisible(true);
        if (user?.id) {
            fetchUserScores();
        }
    }, [user]);

    const handleStartAdventure = () => {
        setRabbitAnimation('excited');
        setTimeout(() => {
            setCurrentView('level-selection');
        }, 1000);
    };

    const handleBackToDashboard = () => {
        setCurrentView('dashboard');
    };

    const handleLevelSelect = (levelSettings) => {
        onStartGame(levelSettings);
    };

    const fetchLeaderboard = async () => {
        try {
            setIsLoading(true);
            const response = await gameAPI.getLeaderboard(3); // Get top 3 global
            if (response.success) {
                setLeaderboardData(response.data || []);
            }
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            setLeaderboardData([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserScores = async () => {
        try {
            if (user?.id) {
                const response = await gameAPI.getUserScores(user.id);
                if (response.success && response.data) {
                    const scores = response.data;
                    setUserScores(scores);
                    
                    // Calculate stats
                    const highScore = scores.length > 0 
                        ? Math.max(...scores.map(score => score.score || 0))
                        : 0;
                    
                    const totalCarrots = scores.reduce((total, score) => 
                        total + (score.score || 0), 0
                    );
                    
                    const gamesPlayed = scores.length;

                    setUserStats({
                        highScore,
                        totalCarrots,
                        gamesPlayed
                    });
                } else {
                    // If no scores, reset to 0
                    setUserStats({
                        highScore: 0,
                        totalCarrots: 0,
                        gamesPlayed: 0
                    });
                    setUserScores([]);
                }
            }
        } catch (error) {
            console.error('Error fetching user scores:', error);
            setUserScores([]);
            setUserStats({
                highScore: 0,
                totalCarrots: 0,
                gamesPlayed: 0
            });
        }
    };

    const handleShowLeaderboard = async () => {
        setShowLeaderboard(true);
        setActiveTab('global');
        await fetchLeaderboard();
        // Refresh user scores when opening leaderboard to get latest data
        await fetchUserScores();
    };

    const handleCloseLeaderboard = () => {
        setShowLeaderboard(false);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    const getRankIcon = (rank) => {
        switch(rank) {
            case 1: return '🥇';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return '🏆';
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch(difficulty) {
            case 'Easy': return '#4CAF50';
            case 'Medium': return '#FF9800';
            case 'Hard': return '#F44336';
            case 'Expert': return '#9C27B0';
            default: return '#666';
        }
    };

    // Get top 3 user scores for personal leaderboard
    const getTopUserScores = () => {
        return userScores
            .sort((a, b) => (b.score || 0) - (a.score || 0))
            .slice(0, 3);
    };

    if (currentView === 'level-selection') {
        return (
            <LevelSelection 
                user={user}
                onBack={handleBackToDashboard}
                onLevelSelect={handleLevelSelect}
            />
        );
    }

    return (
        <div className="dashboard-container">
            {/* Jungle Background Elements */}
            <div className="jungle-background">
                <div className="jungle-tree tree-1">🌴</div>
                <div className="jungle-tree tree-2">🌳</div>
                <div className="jungle-tree tree-3">🎄</div>
                <div className="jungle-vine vine-1">🌿</div>
                <div className="jungle-vine vine-2">🍃</div>
                <div className="jungle-vine vine-3">🌱</div>
                <div className="jungle-rock rock-1">🪨</div>
                <div className="jungle-rock rock-2">🥌</div>
                <div className="floating-carrot carrot-1">🥕</div>
                <div className="floating-carrot carrot-2">🥕</div>
                <div className="floating-carrot carrot-3">🥕</div>
                <div className="jungle-flower flower-1">🌼</div>
                <div className="jungle-flower flower-2">🌺</div>
                <div className="jungle-flower flower-3">🌸</div>
            </div>

            <div className={`dashboard-content ${isVisible ? 'visible' : ''}`}>
                {/* User Info Card */}
                <div className="user-info-card">
                    <div className="user-avatar">
                        {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-details">
                        <h3 className="username">@{user?.username}</h3>
                        <p className="user-email">{user?.email}</p>
                        <p className="user-id">ID: {user?.id}</p>
                    </div>
                    <button className="logout-btn" onClick={onLogout}>
                        <span>🌿</span>
                        Logout
                    </button>
                </div>

                {/* Main Game Card */}
                <div className="game-intro-card">
                    <div className="rabbit-character">
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
                                <div className="rabbit-nose"></div>
                            </div>
                            <div className="rabbit-body"></div>
                        </div>
                    </div>
                    
                    <h1 className="game-title">
                        <span className="title-text">Hop Into Adventure!</span>
                        <div className="title-underline"></div>
                    </h1>
                    
                    <p className="game-description">
                        Join Thumper the rabbit in an exciting jungle adventure! Collect carrots, 
                        avoid obstacles, and explore the magical forest. Ready to hop? 
                        Tap Start to begin your journey!
                    </p>

                    <button 
                        className="start-button"
                        onClick={handleStartAdventure}
                        onMouseEnter={() => setRabbitAnimation('alert')}
                        onMouseLeave={() => setRabbitAnimation('idle')}
                    >
                        <span className="button-text">Start Hopping</span>
                        <span className="button-icon">🏃‍♂️</span>
                        <div className="button-shine"></div>
                    </button>

                    <div className="game-stats">
                        <div className="stat-item">
                            <div className="stat-icon">🏆</div>
                            <div className="stat-info">
                                <div className="stat-value">{userStats.highScore}</div>
                                <div className="stat-label">High Score</div>
                            </div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-icon">🥕</div>
                            <div className="stat-info">
                                <div className="stat-value">{userStats.totalCarrots}</div>
                                <div className="stat-label">Total Carrots</div>
                            </div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-icon">⭐</div>
                            <div className="stat-info">
                                <div className="stat-value">{userStats.gamesPlayed}</div>
                                <div className="stat-label">Games Played</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions - Only Leaderboard */}
                <div className="quick-actions">
                    <button 
                        className="action-btn leaderboard-btn"
                        onClick={handleShowLeaderboard}
                    >
                        <span className="action-icon">📊</span>
                        Leaderboard
                    </button>
                </div>
            </div>

            {/* Leaderboard Popup */}
            {showLeaderboard && (
                <div className="leaderboard-popup-overlay">
                    <div className="leaderboard-popup">
                        <div className="leaderboard-header">
                            <h2>🏆 Leaderboard 🏆</h2>
                            <button 
                                className="close-leaderboard-btn"
                                onClick={handleCloseLeaderboard}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Tab Navigation */}
                        <div className="leaderboard-tabs">
                            <button 
                                className={`tab-btn ${activeTab === 'global' ? 'active' : ''}`}
                                onClick={() => handleTabChange('global')}
                            >
                                🌍 Global Top 3
                            </button>
                            <button 
                                className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
                                onClick={() => handleTabChange('personal')}
                            >
                                👤 My Top Scores
                            </button>
                        </div>

                        <div className="leaderboard-content">
                            {isLoading ? (
                                <div className="leaderboard-loading">
                                    <div className="loading-spinner"></div>
                                    <p>Loading leaderboard...</p>
                                </div>
                            ) : activeTab === 'global' ? (
                                leaderboardData.length > 0 ? (
                                    <div className="leaderboard-list">
                                        {leaderboardData.map((player, index) => (
                                            <div 
                                                key={player.userId || index} 
                                                className={`leaderboard-item ${index === 0 ? 'first-place' : ''}`}
                                            >
                                                <div className="player-rank">
                                                    <span className="rank-icon">
                                                        {getRankIcon(index + 1)}
                                                    </span>
                                                    <span className="rank-number">#{index + 1}</span>
                                                </div>
                                                
                                                <div className="player-info">
                                                    <div className="player-name">
                                                        @{player.username}
                                                        {player.userId === user?.id && (
                                                            <span className="you-badge"> (You)</span>
                                                        )}
                                                    </div>
                                                    <div className="player-stats">
                                                        <span className="player-score">
                                                            {player.totalScore} 🥕
                                                        </span>
                                                        <span 
                                                            className="player-difficulty"
                                                            style={{ color: getDifficultyColor(player.difficulty) }}
                                                        >
                                                            {player.difficulty || 'Easy'}
                                                        </span>
                                                    </div>
                                                    {player.lastPlayed && (
                                                        <div className="player-date">
                                                            {formatDate(player.lastPlayed)}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="player-additional-stats">
                                                    <div className="additional-stat">
                                                        <span className="stat-label">Games:</span>
                                                        <span className="stat-value">{player.gamesPlayed || 1}</span>
                                                    </div>
                                                    {player.avgScore && (
                                                        <div className="additional-stat">
                                                            <span className="stat-label">Avg:</span>
                                                            <span className="stat-value">{Math.round(player.avgScore)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="leaderboard-empty">
                                        <div className="empty-icon">🌍</div>
                                        <h3>No Global Scores Yet</h3>
                                        <p>Be the first to play and top the global leaderboard!</p>
                                        <button 
                                            className="start-from-leaderboard-btn"
                                            onClick={handleStartAdventure}
                                        >
                                            Start Playing
                                        </button>
                                    </div>
                                )
                            ) : (
                                // Personal Scores Tab
                                getTopUserScores().length > 0 ? (
                                    <div className="leaderboard-list">
                                        {getTopUserScores().map((score, index) => (
                                            <div 
                                                key={score._id || index} 
                                                className="leaderboard-item personal-score"
                                            >
                                                <div className="player-rank">
                                                    <span className="rank-icon">
                                                        {getRankIcon(index + 1)}
                                                    </span>
                                                    <span className="rank-number">#{index + 1}</span>
                                                </div>
                                                
                                                <div className="player-info">
                                                    <div className="player-name">
                                                        @{user.username}
                                                        <span className="you-badge"> (You)</span>
                                                    </div>
                                                    <div className="player-stats">
                                                        <span className="player-score">
                                                            {score.score || 0} 🥕
                                                        </span>
                                                        <span 
                                                            className="player-difficulty"
                                                            style={{ color: getDifficultyColor(score.difficulty) }}
                                                        >
                                                            {score.difficulty || 'Easy'}
                                                        </span>
                                                    </div>
                                                    {score.createdAt && (
                                                        <div className="player-date">
                                                            {formatDate(score.createdAt)}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="player-additional-stats">
                                                    <div className="additional-stat">
                                                        <span className="stat-label">Correct:</span>
                                                        <span className="stat-value">{score.correctAnswers || 0}</span>
                                                    </div>
                                                    <div className="additional-stat">
                                                        <span className="stat-label">Total Q:</span>
                                                        <span className="stat-value">{score.totalQuestions || 0}</span>
                                                    </div>
                                                    {score.gameType && (
                                                        <div className="additional-stat">
                                                            <span className="stat-label">Type:</span>
                                                            <span className="stat-value">
                                                                {score.gameType === 'mini-carrot-counting' ? 'Mini' : 'Main'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="leaderboard-empty">
                                        <div className="empty-icon">👤</div>
                                        <h3>No Personal Scores Yet</h3>
                                        <p>Start playing to track your personal best scores!</p>
                                        <button 
                                            className="start-from-leaderboard-btn"
                                            onClick={handleStartAdventure}
                                        >
                                            Start Playing
                                        </button>
                                    </div>
                                )
                            )}
                        </div>

                        <div className="leaderboard-footer">
                            <p>🎯 Play more games to climb the leaderboard!</p>
                            {activeTab === 'personal' && getTopUserScores().length > 0 && (
                                <p className="personal-stats-summary">
                                    Your best: <strong>{userStats.highScore} carrots</strong> • Total: <strong>{userStats.totalCarrots} carrots</strong> • Games: <strong>{userStats.gamesPlayed}</strong>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;