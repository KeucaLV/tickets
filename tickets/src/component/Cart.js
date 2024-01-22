import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

function Cart({ location = {}, selectedItems, setSelectedItems, stripe, isOpen, toggleCart }) {
    const { state: cartState } = location;
    const { selectedItems: cartItemsFromLocation } = cartState || {};
    const [userId, setUserId] = useState(localStorage.getItem('userId'));
    const [otherCartItems, setOtherCartItems] = useState(cartItemsFromLocation || []);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const storedItems = JSON.parse(localStorage.getItem(`selectedItems_${userId}`)) || [];
        setOtherCartItems(storedItems);
        setSelectedItems(storedItems);
    }, [userId]);

    const saveCartToLocalStorage = (cartItems) => {
        localStorage.setItem(`selectedItems_${userId}`, JSON.stringify(cartItems));
    };

    const handleRemoveFromCart = (index) => {
        const newCart = [...selectedItems];
        newCart.splice(index, 1);
        setSelectedItems(newCart);
        saveCartToLocalStorage(newCart);
    };

    const calculateTotal = () => {
        let total = 0;

        selectedItems.forEach((item) => {
            total += parseInt(item.quantity, 10) * parseFloat(item.price);
        });

        return total.toFixed(2);
    };

    const handleCheckout = async () => {
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost/datubazes/tickets/checkout.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: selectedItems,
                    userId: userId,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            console.log('Checkout Session Data:', data);

            const stripePromise = loadStripe('pk_test_51MLtN5DjfQfCJkDAms2C5NcgvPCTtU8ORYtzsPMGqYAbXh1a5OdsDbzWT06o3ndaVIAtXdwtMh12vYxmbMj9RNs7004DATCm0d');
            const stripeInstance = await stripePromise;
            const { error } = await stripeInstance.redirectToCheckout({
                sessionId: data.sessionId,
            });

            setSelectedItems([]);
            saveCartToLocalStorage([]);

            if (error) {
                console.error('Error redirecting to Checkout:', error);
            } else {
                // Clear the cart after successful purchase
                setSelectedItems([]);
                saveCartToLocalStorage([]);
            }
        } catch (error) {
            console.error('Error creating checkout session:', error.message);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Your Cart</h2>

            {otherCartItems.length === 0 && selectedItems.length === 0 && (
                <p>No tickets in the shopping cart.</p>
            )}

            {otherCartItems.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-md font-semibold mb-2">Selected Items:</h3>
                    <ul>
                        {otherCartItems.map((item, index) => (
                            <li key={index}>
                                {item.ticketType} - Qty: {item.quantity} - Price: {item.price}€
                                <button className="text-red-600 ml-2 rounded-md hover:text-red-800" onClick={() => handleRemoveFromCart(index)}>X</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {selectedItems.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Total: {calculateTotal()}€</h3>
                    <button
                        onClick={handleCheckout}
                        className={`bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : 'Proceed to Checkout'}
                    </button>
                </div>
            )}

            <div className="mt-4">
                <Link to="/allEvents/:id" className="text-blue-500 hover:underline mr-4">
                    Back to Events
                </Link>
            </div>
        </div>
    );
}

export default Cart;
