import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import eventLogo from "../images/eventLogo.png";
import logout from "../images/logout.png";

function Header({ onLogout }) {
    const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);
    const [username, setUsername] = useState(localStorage.getItem('username'));
    const [userID, setUserID] = useState(localStorage.getItem('userId'));
    const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');

    const toggleBurgerMenu = () => {
        setIsBurgerMenuOpen(!isBurgerMenuOpen);
    };

    const isLoggedIn = localStorage.getItem('token') !== null;



    const handleLogout = () => {
        // Remove the token, username, and isAdmin from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('isAdmin');

        // Reset the username and isAdmin states
        setUsername('');
        setIsAdmin(false);
        setUserID('');

        // Call the provided onLogout function
        onLogout();
    };

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';
        const storedUserId = localStorage.getItem('userId');

        if (storedUsername) {
            setUsername(storedUsername);
        }else{
            setUserID(0);
        }

        // Set isAdmin state in Header component
        setIsAdmin(storedIsAdmin);
        setUserID(storedUserId);

    }, []);

    return (
        <>
            <div className="flex w-full absolute h-[80px] text-xl font-ariel items-center justify-end text-white bg-blue-950 p-10 text-center relative">
                <div
                    className={`${
                        isBurgerMenuOpen ? "flex" : "hidden"
                    }  items-center flex-col md:hidden fixed top-0 left-0 w-full h-full bg-blue-950 z-10 p-4`}
                >
                    <Link to="#" className="block mb-4" onClick={toggleBurgerMenu}>
                        Close Menu
                    </Link>
                    <Link to={`/Home/${userID}`} className="hidden md:block">
                        Home
                    </Link>
                    <Link to={`/allEvents/${userID}`} className="block mb-4">
                        All Events
                    </Link>
                    <Link to={`/history/${userID}`} className="block mb-4">
                        Purchases
                    </Link>
                    <Link to={`/cart/${userID}`} className="block mb-4">
                        Cart
                    </Link>
                    {isAdmin && (
                        <Link to="/InsertEvents" className="block mb-4">
                            Insert Events
                        </Link>
                    )}
                    {isLoggedIn ? (
                        <button className=" md:flex flex content-center items-center" onClick={handleLogout}>
                            <span className="text-balance mr-1">{username}</span>
                            <img className="w-5 mt-1" src={logout} alt="Logout" />
                        </button>
                    ) : (
                        <Link to="/Register" className="bg-[#fb8500] w-[90px] h-[30px] text-center rounded-full block">
                            Login
                        </Link>
                    )}
                </div>
                <Link to="#" className="md:hidden absolute top-0 left-0 p-4" onClick={toggleBurgerMenu}>
                    <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </Link>
                <div className={`${isBurgerMenuOpen ? "hidden" : "flex"} mt-4 md:flex space-x-5`}>
                    <Link to={`/Home/${userID}`} className="hidden -mt-4 mr-0 md:block max-sm:hidden">
                        Home
                    </Link>
                    {isAdmin && (
                        <Link to="/InsertEvents" className="hidden -mt-4 mr-2 md:block">
                            Insert Event
                        </Link>
                    )}
                </div>
                {isLoggedIn ? (
                    <>
                    <Link to={`/allEvents/${userID}`} className="hidden mt-0 mr-2 ml-4 md:block">
                        All Events
                    </Link>
                    <Link to={`/history/${userID}`} className="block mt-0 mr-2 ml-2 max-sm:hidden">
                        Purchases
                    </Link>
                    <Link to={`/cart/${userID}`} className="block mt-0 mr-2 ml-2 max-sm:hidden">
                        Cart
                    </Link>
                    <button className="flex m-5 content-center mt-5 mr-2 ml-2 items-center max-sm:hidden" onClick={handleLogout}>
                        <span className="text-balance mr-1">{username}</span>
                        <img className="w-5 mt-1" src={logout} alt="Logout" />
                    </button>
                    </>
                ) : (
                    <Link to="/Register" className="bg-[#fb8500] m-5 w-[90px] h-[30px] text-center rounded-full block">
                        Login
                    </Link>
                )}
                <img className="w-[90px] h-[70px] bg-transparent" src={eventLogo} alt="Event Logo" />
            </div>
        </>
    );
}

export default Header;
