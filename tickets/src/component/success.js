import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PurchaseSuccess = () => {
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);
    const [eventID, setEventID] = useState(() => localStorage.getItem('eventId'));
    const [userID, setUserID] = useState(() => localStorage.getItem('userId'));
    const [error, setError] = useState('');

    const handleReviewChange = (e) => {
        setReview(e.target.value);
    };

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    const submitReview = () => {
        // Check if both rating and review are provided
        if (rating === 0 || review.trim() === '') {
            setError('Rating and review are required');
            return;
        }

        const phpEndpoint = 'http://localhost/datubazes/tickets/review.php';

        fetch(phpEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ review: review, rating: rating, eventID: eventID, userID: userID }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Review submitted successfully:', data);
                setIsReviewSubmitted(true);
                setError("");
                // Optionally, you can perform any actions after successful submission
            })
            .catch(error => {
                console.error('Error submitting review:', error);
            });
    };

    return (
        <div className="flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-green-500">Purchase Successful!</h2>
                <p className="text-gray-700 mb-4">Thank you for your purchase. Your order has been successfully processed.</p>
                <p className="text-gray-700 mb-4">Head to your purchase history to see the ticket!</p>

                <div className="mb-4">
                    <label htmlFor="review" className="block text-gray-700">Your Review:</label>
                    <textarea
                        id="review"
                        name="review"
                        value={review}
                        onChange={handleReviewChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-green-300"
                        rows="4"
                        placeholder="Write your review here..."
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="rating" className="block text-gray-700">Rating:</label>
                    <div>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                onClick={() => handleRatingChange(star)}
                                className={`cursor-pointer text-2xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                            >
                                &#9733;
                            </span>
                        ))}
                    </div>
                </div>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                {isReviewSubmitted ? (
                    <p className="text-green-500 mb-4">Review submitted successfully!</p>
                ) : (
                    <button
                        onClick={submitReview}
                        className="bg-green-500 text-white mr-2 px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring focus:border-green-300"
                    >
                        Submit Review
                    </button>
                )}

                <Link to={`/allEvents/${userID}`}>
                    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring focus:border-green-300">
                        Continue Shopping
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default PurchaseSuccess;
