import React, { useState, useEffect } from 'react';
import Loading from './components/Loading';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import GamePage from './components/GamePage.js';
import './App.css';

function App() {
    const [currentView, setCurrentView] = useState('loading');
    const [currentUser, setCurrentUser] = useState(null);
    const [gameSettings, setGameSettings] = useState(null);

    useEffect(() => {
        // Simulate loading time
        const timer = setTimeout(() => {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                setCurrentUser(JSON.parse(savedUser));
                setCurrentView('dashboard');
            } else {
                setCurrentView('login');
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const handleLoginSuccess = (user) => {
        setCurrentUser(user);
        setCurrentView('dashboard');
    };

    const handleRegisterSuccess = (user) => {
        setCurrentUser(user);
        setCurrentView('dashboard');
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setCurrentUser(null);
        setCurrentView('login');
    };

    const handleStartGame = (settings) => {
        setGameSettings(settings);
        setCurrentView('game');
    };

    const handleBackToDashboard = () => {
        setCurrentView('dashboard');
        setGameSettings(null);
    };

    const renderCurrentView = () => {
        switch (currentView) {
            case 'loading':
                return <Loading />;
            case 'login':
                return (
                    <Login 
                        onSwitchToRegister={() => setCurrentView('register')}
                        onLoginSuccess={handleLoginSuccess}
                    />
                );
            case 'register':
                return (
                    <Register 
                        onSwitchToLogin={() => setCurrentView('login')}
                        onRegisterSuccess={handleRegisterSuccess}
                    />
                );
            case 'dashboard':
                return (
                    <Dashboard 
                        user={currentUser}
                        onLogout={handleLogout}
                        onStartGame={handleStartGame}
                    />
                );
            case 'game':
                return (
                    <GamePage 
                        user={currentUser}
                        gameSettings={gameSettings}
                        onBack={handleBackToDashboard}
                    />
                );
            default:
                return <Loading />;
        }
    };

    return (
        <div className="App">
            {renderCurrentView()}
        </div>
    );
}

export default App;