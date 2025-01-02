import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertDialog from '../ui/constant/alertDialog'; // Import custom alert dialog component
import '../css/LoginPage.css'; // Import CSS

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const navigate = useNavigate();

    const handleCloseAlert = () => {
        setAlertMessage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation
        if (!email) {
            setAlertMessage('Email is required.');
            return;
        }

        if (!password) {
            setAlertMessage('Password is required.');
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setAlertMessage('Invalid email format.');
            return;
        }

        if (password.length < 6) {
            setAlertMessage('Password must be at least 6 characters long.');
            return;
        }

        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userrole', data.role);
                localStorage.setItem('token', data.token);

                navigate('/dashboard');
            } else {
                setAlertMessage(data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login failed:', error);
            setAlertMessage('Login failed. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="input-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={isSubmitting} className="login-btn">
                    {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <button onClick={() => navigate('/signup')} className="signup-btn">Sign Up</button>
            {alertMessage && (
                <AlertDialog message={alertMessage} onClose={handleCloseAlert} />
            )}
        </div>
    );
};

export default LoginPage;
