import React, { useState, useEffect } from 'react';
import LevelSelection from './LevelSelection';
import './Dashboard.css';

const Dashboard = ({ user, onLogout, onStartGame }) => {
    const [currentView, setCurrentView] = useState('dashboard');
    const [isVisible, setIsVisible] = useState(false);
    const [monkeyAnimation, setMonkeyAnimation] = useState('idle');

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleStartAdventure = () => {
        setMonkeyAnimation('excited');
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
            {/* Animated Background */}
            <div className="background-elements">
                <div className="floating-banana banana-1">🍌</div>
                <div className="floating-banana banana-2">🍌</div>
                <div className="floating-banana banana-3">🍌</div>
                <div className="floating-leaf leaf-1">🍃</div>
                <div className="floating-leaf leaf-2">🍃</div>
                <div className="floating-cloud cloud-1">☁️</div>
                <div className="floating-cloud cloud-2">☁️</div>
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
                        <span>🚪</span>
                        Logout
                    </button>
                </div>

                {/* Main Game Card */}
                <div className="game-intro-card">
                    <div className="monkey-character">
                        <div className={`monkey ${monkeyAnimation}`}>
                            <div className="monkey-face">🐵</div>
                            <div className="monkey-body"></div>
                        </div>
                    </div>
                    
                    <h1 className="game-title">
                        <span className="title-text">Hello There!</span>
                        <div className="title-underline"></div>
                    </h1>
                    
                    <p className="game-description">
                        Help our monkey collect as many bananas as possible while dodging obstacles. 
                        Ready to go bananas? Tap Start to begin!
                    </p>

                    <button 
                        className="start-button"
                        onClick={handleStartAdventure}
                        onMouseEnter={() => setMonkeyAnimation('looking')}
                        onMouseLeave={() => setMonkeyAnimation('idle')}
                    >
                        <span className="button-text">Start Adventure</span>
                        <span className="button-icon">🎮</span>
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
                            <div className="stat-icon">🍌</div>
                            <div className="stat-info">
                                <div className="stat-value">0</div>
                                <div className="stat-label">Bananas</div>
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