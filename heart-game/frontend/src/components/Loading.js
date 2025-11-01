import React, { useState, useEffect } from 'react';
import './Loading.css';

const Loading = () => {
    const [currentTip, setCurrentTip] = useState(0);

    const loadingTips = [
        "Preparing your magical journey...",
        "Gathering adventure resources...",
        "Charging the heart crystals...",
        "Calibrating love frequencies...",
        "Setting up your personal realm...",
        "Connecting with fellow adventurers..."
    ];

    useEffect(() => {
        const tipInterval = setInterval(() => {
            setCurrentTip((prev) => (prev + 1) % loadingTips.length);
        }, 3000);

        return () => clearInterval(tipInterval);
    }, [loadingTips.length]);

    return (
        <div className="loading-container">
            {/* Animated Background Particles */}
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>

            <div className="loading-content">
                <div className="loading-heart">
                    <div className="heart-pulse"></div>
                    <div className="heart-pulse"></div>
                    <div className="heart-pulse"></div>
                    <div className="heart-shape"></div>
                </div>
                
                <h1 className="loading-title">Heart Game</h1>
                <p className="loading-subtitle">Loading your adventure...</p>
                
                <div className="progress-container">
                    <div className="progress-bar"></div>
                </div>
                
                <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                
                <div className="loading-tips">
                    {loadingTips[currentTip]}
                </div>
            </div>
        </div>
    );
};

export default Loading;