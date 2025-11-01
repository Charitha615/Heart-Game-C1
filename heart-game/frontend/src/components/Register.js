import React, { useState } from 'react';
import { authAPI } from '../services/api';
import './Auth.css';

const Register = ({ onSwitchToLogin, onRegisterSuccess }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const getPasswordStrength = (password) => {
        if (!password) return '';
        if (password.length < 6) return 'weak';
        if (password.length < 8) return 'medium';
        if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
            return 'strong';
        }
        return 'medium';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setMessage('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const { confirmPassword, ...registerData } = formData;
            const response = await authAPI.register(registerData);
            
            if (response.data.success) {
                setMessage('🎉 Registration successful! Welcome to Heart Game!');
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setTimeout(() => onRegisterSuccess(response.data.user), 1500);
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const passwordStrength = getPasswordStrength(formData.password);

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Join Heart Game</h2>
                    <p>Create your account and embark on an unforgettable adventure</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <div className="input-container">
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                placeholder="Choose your unique username"
                            />
                            <div className="input-icon">👤</div>
                        </div>
                    </div>

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
                                placeholder="Create a strong password"
                                minLength="6"
                            />
                            <div className="input-icon">🔒</div>
                        </div>
                        {formData.password && (
                            <div className="password-strength">
                                <div className={`strength-bar strength-${passwordStrength}`}></div>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="input-container">
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder="Re-enter your password"
                            />
                            <div className="input-icon">✅</div>
                        </div>
                        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                            <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '8px' }}>
                                Passwords don't match
                            </div>
                        )}
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
                            'Create Account'
                        )}
                    </button>
                </form>

                {message && (
                    <div className={`message ${message.includes('🎉') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}

                <div className="auth-switch">
                    <p>Already part of the adventure? 
                        <span onClick={onSwitchToLogin} className="switch-link">
                            Sign in here
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;