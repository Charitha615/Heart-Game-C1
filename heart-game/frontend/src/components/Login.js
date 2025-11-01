import React, { useState } from 'react';
import { authAPI } from '../services/api';
import './Auth.css';

const Login = ({ onSwitchToRegister, onLoginSuccess }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await authAPI.login(formData);
            
            if (response.data.success) {
                setMessage('✨ Welcome back to Heart Game!');
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setTimeout(() => onLoginSuccess(response.data.user), 1500);
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Welcome Back</h2>
                    <p>Continue your Heart Game journey where you left off</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-container">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="your.email@example.com"
                            />
                            <div className="input-icon">✉️</div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-container">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Enter your password"
                            />
                            <div className="input-icon">🔑</div>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="loading-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </span>
                        ) : (
                            'Sign In to Adventure'
                        )}
                    </button>
                </form>

                {message && (
                    <div className={`message ${message.includes('✨') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}

                <div className="auth-switch">
                    <p>New to Heart Game? 
                        <span onClick={onSwitchToRegister} className="switch-link">
                            Join the adventure
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;