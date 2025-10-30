import React, { useState, useEffect } from 'react';
import Loading from './components/Loading';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function App() {
    const [currentView, setCurrentView] = useState('loading');
    const [currentUser, setCurrentUser] = useState(null);

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
                    <div className="dashboard">
                        <div className="dashboard-card">
                            <div className="welcome-section">
                                <h1>Welcome to Heart Game! ❤️</h1>
                                <p>Hello, {currentUser?.username}!</p>
                                <div className="user-info">
                                    <p><strong>Email:</strong> {currentUser?.email}</p>
                                    <p><strong>User ID:</strong> {currentUser?.id}</p>
                                </div>
                            </div>
                            <button onClick={handleLogout} className="logout-button">
                                Logout
                            </button>
                        </div>
                    </div>
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