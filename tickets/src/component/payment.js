import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [paymentError, setPaymentError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet.
            return;
        }

        const cardElement = elements.getElement(CardElement);

        try {
            // Create a PaymentMethod object
            const { paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });

            // Handle the payment on your server
            const response = await fetch('http://localhost/datubazes/tickets/payment.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ payment_method_id: paymentMethod.id }),
            });

            const result = await response.json();

            if (result.error) {
                setPaymentError(result.error.message);
            } else {
                // Payment successful
                console.log('Payment successful:', result.paymentIntent);
            }
        } catch (error) {
            setPaymentError(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit" disabled={!stripe}>
                Pay
            </button>
            {paymentError && <div>{paymentError}</div>}
        </form>
    );
};

export default CheckoutForm;
