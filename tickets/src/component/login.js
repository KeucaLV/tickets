import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleUsernameChange = (event) => setUsername(event.target.value);
    const handlePasswordChange = (event) => setPassword(event.target.value);

    const handleLogin = async () => {
        try {
            // Validate empty input fields
            if (!username || !password) {
                setError('Please enter both username and password.');
                return;
            }

            const response = await fetch('http://localhost/datubazes/tickets/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data) {
                const token = data.token;
                const newUsername = data.username;
                const isAdmin = data.isAdmin;
                const userId = data.userId;

                if (token && newUsername) {
                    // Save the token, username, and isAdmin in localStorage
                    localStorage.setItem('token', token);
                    localStorage.setItem('username', newUsername);
                    localStorage.setItem('isAdmin', isAdmin);
                    localStorage.setItem('userId', userId);

                    // Trigger parent component's login handler
                    onLogin(newUsername, isAdmin, userId);

                    // Navigate to MainPage
                    navigate(`/Home/${userId}`);
                } else {
                    setError('Invalid username or password');
                }
            } else {
                setError('Invalid username or password');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setError('Error during login. Please try again.');
        }
    };

    return (
        <div className="flex m-5 p-4 align-center w-[300px] flex-col rounded-b bg-gray-50 flex-wrap overflow-hidden content-center items-center shadow-lg duration-300">
            <h1 className="text-4xl m-2">Login</h1>
            <div className="mt-6 mb-5 relative ">
                <input
                    className={`w-[200px] bg-gray-50 placeholder-black outline-none ${username ? 'border-b-2 border-[#fb8500]' : 'border-b-2 border-black'}`}
                    type="text"
                    placeholder=" "
                    value={username}
                    onChange={handleUsernameChange}
                />
                <label className={`absolute left-0 transform origin-top transition-transform ${username ? '-translate-y-3 text-[#fb8500] text-xs' : 'translate-y-1 text-black text-sm'}`}>Username</label>
            </div>
            <div className="mb-5 relative">
                <input
                    className={`w-[200px] bg-gray-50 placeholder-black outline-none ${password ? 'border-b-2 border-[#fb8500]' : 'border-b-2 border-black'}`}
                    type="password"
                    placeholder=" "
                    value={password}
                    onChange={handlePasswordChange}
                />
                <label className={`absolute left-0 transform origin-top transition-transform ${password ? '-translate-y-3 text-[#fb8500] text-xs' : 'translate-y-1 text-black text-sm'}`}>Password</label>
            </div>
            <button className="bg-blue-900 rounded-md justify-center text-white w-1/2 h-8 hover:bg-blue-700 hover:duration-300" onClick={handleLogin}>Login</button>
            <div className="text-center">
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
        </div>
    );
};

export default Login;
