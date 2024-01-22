import React, { useState } from 'react';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('')
    const handleUsernameChange = (event) => setUsername(event.target.value);
    const handlePasswordChange = (event) => setPassword(event.target.value);
    const handleEmailChange = (event) => setEmail(event.target.value);
    const handleSignup = async () => {
        try {
            // Validate empty input fields
            if (!username || !password || !email) {
                setError('Please enter all fields.');
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setError('Please enter a valid email address.');
                return;
            }

            const response = await fetch('http://localhost/datubazes/tickets/signup.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, email }),
            });

            const responseData = await response.json(); // Parse the JSON response

            if (response.ok) {
                setSuccess('Signup successful');
                setError('');
                setPassword("");
                setEmail("");
                setUsername("");
            } else {
                console.log('Signup failed');
                setError(responseData.message); // Display the specific error message
            }
        } catch (error) {
            console.error('Error during signup:', error);
            setError('Error during signup. Please try again.');
        }
    };

    return (
        <div className="flex m-5 p-4 w-[300px] bg-gray-50 flex-col rounded-b flex-wrap overflow-hidden content-center items-center  shadow-lg duration-300">
            <h1 className="text-4xl m-2">Signup</h1>
            <div className="mt-5 mb-5 relative ">
                <input
                    className={`w-[200px] bg-gray-50 placeholder-black outline-none ${username ? 'border-b-2 border-[#fb8500]' : 'border-b-2 border-black'}`}
                    type="text"
                    placeholder=" "
                    value={username}
                    onChange={handleUsernameChange}
                />
                <label className={`absolute left-0 transform origin-top transition-transform ${username ? '-translate-y-3 text-[#fb8500] text-xs' : 'translate-y-1 text-black text-sm'}`}>Username</label>
            </div>
            <div className=" mb-5 relative ">
                <input
                    className={`w-[200px] bg-gray-50 placeholder-black outline-none ${password ? 'border-b-2 border-[#fb8500]' : 'border-b-2 border-black'}`}
                    type="password"
                    placeholder=" "
                    value={password}
                    onChange={handlePasswordChange}
                />
                <label className={`absolute left-0 transform origin-top transition-transform ${password ? '-translate-y-3 text-[#fb8500] text-xs' : 'translate-y-1 text-black text-sm'}`}>Password</label>
            </div>
            <div className=" mb-5 relative ">
                <input
                    className={`w-[200px] bg-gray-50 placeholder-black outline-none ${email ? 'border-b-2 border-[#fb8500]' : 'border-b-2 border-black'}`}
                    type="text"
                    placeholder=" "
                    value={email}
                    onChange={handleEmailChange}
                />
                <label className={`absolute left-0 transform origin-top transition-transform ${email ? '-translate-y-3 text-[#fb8500] text-xs' : 'translate-y-1 text-black text-sm'}`}>Email</label>
            </div>
            <button className="bg-blue-900 rounded-md justify-center text-white w-1/2 h-8 hover:bg-blue-700 hover:duration-300" onClick={handleSignup}>Signup</button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {success && <p className="text-green-500 mt-2">{success}</p>}
        </div>
    );
};

export default Signup;
