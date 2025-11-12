import React, { useState, useEffect } from 'react';
import LevelSelection from './LevelSelection';
import './Dashboard.css';

const Dashboard = ({ user, onLogout, onStartGame }) => {
    const [currentView, setCurrentView] = useState('dashboard');
    const [isVisible, setIsVisible] = useState(false);
    const [rabbitAnimation, setRabbitAnimation] = useState('idle');

    useEffect(() => {
        setIsVisible(true);
    }, []);

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
                                <div className="stat-value">0</div>
                                <div className="stat-label">High Score</div>
                            </div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-icon">🥕</div>
                            <div className="stat-info">
                                <div className="stat-value">0</div>
                                <div className="stat-label">Carrots</div>
                            </div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-icon">⭐</div>
                            <div className="stat-info">
                                <div className="stat-value">1</div>
                                <div className="stat-label">Level</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions">
                    <button className="action-btn">
                        <span className="action-icon">👥</span>
                        Friends
                    </button>
                    <button className="action-btn">
                        <span className="action-icon">⚙️</span>
                        Settings
                    </button>
                    <button className="action-btn">
                        <span className="action-icon">📊</span>
                        Leaderboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;