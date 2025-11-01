import React, { useState, useEffect } from 'react';
import './LevelSelection.css';

const LevelSelection = ({ user, onBack, onLevelSelect }) => {
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertData, setAlertData] = useState(null);

    const levels = [
        {
            id: 'easy',
            name: 'Easy',
            time: 60,
            description: 'Perfect for beginners',
            color: '#10b981',
            icon: '😊',
            difficulty: 1
        },
        {
            id: 'medium',
            name: 'Medium',
            time: 40,
            description: 'A bit more challenging',
            color: '#f59e0b',
            icon: '😐',
            difficulty: 2
        },
        {
            id: 'hard',
            name: 'Hard',
            time: 30,
            description: 'For experienced players',
            color: '#ef4444',
            icon: '😰',
            difficulty: 3
        },
        {
            id: 'expert',
            name: 'Expert',
            time: 15,
            description: 'Ultimate challenge!',
            color: '#8b5cf6',
            icon: '😈',
            difficulty: 4
        }
    ];

    const handleLevelSelect = (level) => {
        setSelectedLevel(level);
        
        // Show brief loading then start game
        setTimeout(() => {
            onLevelSelect(level);
        }, 800);
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
        setSelectedLevel(null);
    };

    const handleTryAgain = () => {
        setShowAlert(false);
        setSelectedLevel(null);
    };

    const handleNextLevel = () => {
        setShowAlert(false);
        setSelectedLevel(null);
        // Logic for next level would go here
    };

    return (
        <div className="level-selection-container">
            {/* Animated Background */}
            <div className="level-background">
                <div className="floating-banana banana-1">🍌</div>
                <div className="floating-banana banana-2">🍌</div>
                <div className="floating-leaf leaf-1">🍃</div>
                <div className="floating-cloud cloud-1">☁️</div>
            </div>

            {/* Header */}
            <div className="level-header">
                <button className="back-button" onClick={onBack}>
                    <span className="back-icon">←</span>
                    Back to Dashboard
                </button>
                <h1 className="level-title">Choose Your Challenge</h1>
                <p className="level-subtitle">Select a difficulty level to begin your banana adventure!</p>
            </div>

            {/* Level Cards Grid */}
            <div className="levels-grid">
                {levels.map((level, index) => (
                    <div
                        key={level.id}
                        className={`level-card ${selectedLevel?.id === level.id ? 'selected' : ''}`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                        onClick={() => handleLevelSelect(level)}
                    >
                        <div className="level-card-header">
                            <div className="level-icon" style={{ backgroundColor: level.color }}>
                                {level.icon}
                            </div>
                            <div className="level-info">
                                <h3 className="level-name">{level.name}</h3>
                                <p className="level-description">{level.description}</p>
                            </div>
                        </div>
                        
                        <div className="level-timer">
                            <div className="timer-icon">⏱️</div>
                            <span className="timer-text">Timer: {level.time}s</span>
                        </div>

                        <button className="level-start-button">
                            {selectedLevel?.id === level.id ? (
                                <div className="loading-dots">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            ) : (
                                'START'
                            )}
                        </button>

                        <div className="difficulty-indicator">
                            {[...Array(4)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`difficulty-dot ${i < level.difficulty ? 'active' : ''}`}
                                    style={{ backgroundColor: i < level.difficulty ? level.color : '#e5e7eb' }}
                                ></div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LevelSelection;