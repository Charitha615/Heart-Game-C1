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
            difficulty: 1,
            rabbitMood: 'happy'
        },
        {
            id: 'medium',
            name: 'Medium',
            time: 40,
            description: 'A bit more challenging',
            color: '#f59e0b',
            icon: '😐',
            difficulty: 2,
            rabbitMood: 'alert'
        },
        {
            id: 'hard',
            name: 'Hard',
            time: 30,
            description: 'For experienced players',
            color: '#ef4444',
            icon: '😰',
            difficulty: 3,
            rabbitMood: 'nervous'
        },
        {
            id: 'expert',
            name: 'Expert',
            time: 15,
            description: 'Ultimate challenge!',
            color: '#8b5cf6',
            icon: '😈',
            difficulty: 4,
            rabbitMood: 'excited'
        }
    ];

    // Handle level selection when user clicks on a level card
    const handleLevelSelect = (level) => {
        // Step 1: Set the selected level in state to show visual feedback
        setSelectedLevel(level);
        
        // Step 2: Set alert data for the popup dialog
        setAlertData({
            title: `You chose ${level.name} Level!`,
            message: `You have ${level.time} seconds to complete this challenge.`,
            level: level
        });
        
        // Step 3: Show the popup dialog
        setShowAlert(true);
    };

    // Handle starting the game after user confirms in popup
    const handleStartGame = () => {
        // Step 1: Close the popup dialog
        setShowAlert(false);
        
        // Step 2: Show brief loading animation
        setTimeout(() => {
            // Step 3: Call the parent component's function to start the game
            onLevelSelect(selectedLevel);
        }, 800);
    };

    const handleCloseAlert = () => {
        // Close popup and reset selection
        setShowAlert(false);
        setSelectedLevel(null);
        setAlertData(null);
    };

    const getRabbitEmoji = (mood) => {
        switch (mood) {
            case 'happy': return '🐰';
            case 'alert': return '🐇';
            case 'nervous': return '😰';
            case 'excited': return '⚡';
            default: return '🐰';
        }
    };

    return (
        <div className="level-selection-container">
            {/* Jungle Background */}
            <div className="jungle-background">
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

            {/* Header */}
            <div className="level-header">
                <button className="back-button" onClick={onBack}>
                    <span className="back-icon">←</span>
                    Back to Dashboard
                </button>
                <h1 className="level-title">Choose Your Challenge</h1>
                <p className="level-subtitle">Select a difficulty level to begin your jungle adventure with Thumper!</p>
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
                                {getRabbitEmoji(level.rabbitMood)}
                            </div>
                            <div className="level-info">
                                <h3 className="level-name">{level.name}</h3>
                                <p className="level-description">{level.description}</p>
                            </div>
                        </div>
                        
                        <div className="level-timer">
                            <div className="timer-icon">⏱️</div>
                            <span className="timer-text">{level.time} seconds</span>
                        </div>

                        <div className="carrot-reward">
                            <div className="carrot-icon">🥕</div>
                            <span className="carrot-text">Carrots: {level.difficulty * 5}</span>
                        </div>

                        <button className="level-start-button">
                            {selectedLevel?.id === level.id ? (
                                <div className="loading-dots">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            ) : (
                                'START HOPPING'
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

            {/* Popup Dialog - Shows when user selects a level */}
            {showAlert && alertData && (
                <div className="popup-overlay">
                    <div className="popup-dialog">
                        <div className="popup-header">
                            <div 
                                className="popup-icon"
                                style={{ backgroundColor: alertData.level.color }}
                            >
                                {getRabbitEmoji(alertData.level.rabbitMood)}
                            </div>
                            <h2 className="popup-title">{alertData.title}</h2>
                        </div>
                        
                        <div className="popup-content">
                            <p className="popup-message">{alertData.message}</p>
                            <div className="level-details">
                                <div className="detail-item">
                                    <span className="detail-label">Difficulty:</span>
                                    <span className="detail-value">{alertData.level.name}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Time Limit:</span>
                                    <span className="detail-value">{alertData.level.time} seconds</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Carrot Reward:</span>
                                    <span className="detail-value">{alertData.level.difficulty * 5} 🥕</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Description:</span>
                                    <span className="detail-value">{alertData.level.description}</span>
                                </div>
                            </div>
                        </div>

                        <div className="popup-actions">
                            <button 
                                className="popup-button popup-button-cancel"
                                onClick={handleCloseAlert}
                            >
                                Cancel
                            </button>
                            <button 
                                className="popup-button popup-button-confirm"
                                onClick={handleStartGame}
                                style={{ backgroundColor: alertData.level.color }}
                            >
                                Start Hopping!
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LevelSelection;