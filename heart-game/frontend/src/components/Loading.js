import React from 'react';
import './Loading.css';

const Loading = () => {
    return (
        <div className="loading-container">
            <div className="loading-heart">
                <div className="heart-shape"></div>
            </div>
            <h1 className="loading-title">Heart Game</h1>
            <p className="loading-subtitle">Loading your adventure...</p>
            <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    );
};

export default Loading;