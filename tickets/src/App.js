// App.js

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from "./component/header";
import MainPage from "./component/mainPage";
import AllEvents from "./component/allEvents";
import InsertEvents from "./component/insertEvents";
import Register from "./component/register";
import EventDetails from "./component/EventDetails";
import BuyTickets from "./component/buyTickets";
import Success from "./component/success";
import History from "./component/purchaseHistory";
import Cart from "./component/Cart";
// import { loadStripe } from '@stripe/stripe-js';

function App() {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);

    const handleLogin = (user) => {
        setLoggedIn(true);
        setUsername(user);
    };

    const handleLogout = () => {
        setLoggedIn(false);
        setUsername('');
    };

    const [message, setMessage] = useState("");

    useEffect(() => {
        try {
            // Check to see if this is a redirect back from Checkout
            const query = new URLSearchParams(window.location.search);

            if (query.get("success")) {
                setMessage("Order placed! You will receive an email confirmation.");
            }

            if (query.get("canceled")) {
                setMessage(
                    "Order canceled -- continue to shop around and checkout when you're ready."
                );
            }
        } catch (error) {
            console.error("Error:", error.message);
            setMessage("An error occurred. Please try again later.");
        }
    }, []);

    return (
        <Router>
            <div className="flex p-0 m-0 justify-center items-center flex-col">
                <Header isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />
                <Routes>
                    <Route path="/Home/:id" element={<MainPage />} />
                    <Route path="/allEvents/:id" element={<AllEvents />} />
                    <Route path="/insertEvents" element={<InsertEvents />} />
                    <Route path="/Register" element={<Register isLoggedIn={isLoggedIn} onLogin={handleLogin} />} />
                    <Route
                        path="/event/:id"
                        element={<EventDetails />}
                    />
                    <Route
                        path="/tickets/:id"
                        element={<BuyTickets selectedItems={selectedItems} setSelectedItems={setSelectedItems} />}
                    />
                    <Route path="/success/:id" element={<Success message={message} />} />
                    <Route path="/history/:id" element={<History />} />
                    <Route
                        path="/cart/:id"
                        element={<Cart selectedItems={selectedItems} setSelectedItems={setSelectedItems} />}
                    />

                </Routes>
            </div>
        </Router>
    );
}

export default App;
