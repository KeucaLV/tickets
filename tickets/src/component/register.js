import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../component/login'; // Import your Login component
import Signup from '../component/signup'; // Import your Signup component

const Auth = () => {
    const [showLogin, setShowLogin] = useState(true);
    const navigate = useNavigate();
    const handleLogin = () => {
        // Trigger any signup-specific functionality here
        console.log('User logged in');
    };

    const handleSignup = () => {
        // Trigger any signup-specific functionality here
        console.log('User signed up');
    };

    const toggleAuthComponent = () => {
        setShowLogin((prevShowLogin) => !prevShowLogin);
    };

    return (
        <div className="flex flex-col items-center justify-center">
            {showLogin ? (
                <Login onLogin={handleLogin} />
            ) : (
                <Signup onSignup={handleSignup} />
            )}
            <p className="mt-3">
                {showLogin ? "Don't have an account? " : 'Already have an account? '}
                <span className="cursor-pointer text-blue-500" onClick={toggleAuthComponent}>
                    {showLogin ? 'Sign Up' : 'Login'}
                </span>
            </p>
        </div>
    );
};

export default Auth;
