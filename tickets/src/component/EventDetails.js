import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

function StarRating({ rating }) {
    const filledStars = Math.round(rating);
    const emptyStars = 5 - filledStars;

    return (
        <div className="flex space-x-1">
            {[...Array(filledStars)].map((_, index) => (
                <span key={index} className="text-yellow-500">&#9733;</span>
            ))}
            {[...Array(emptyStars)].map((_, index) => (
                <span key={index} className="text-gray-300">&#9733;</span>
            ))}
        </div>
    );
}

function EventDetails() {
    const { id } = useParams();
    const [eventDetails, setEventDetails] = useState(null);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await fetch(`http://localhost/datubazes/tickets/getEventDetails.php?id=${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                console.log('Event details:', data);
                setEventDetails(data);

            } catch (error) {
                console.error('Error fetching event details:', error.message);
            }
        };

        if (id) {
            fetchEventDetails();
        }
    }, [id]);

    const formatEventDate = (dateString) => {
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit' };
        const eventDate = new Date(dateString);
        if (isNaN(eventDate.getTime())) {
            throw new Error('Invalid date');
        }
        return eventDate.toLocaleDateString('en-US', options);
    };

    return (
        <div>
            {eventDetails && (
                <div>
                    <div className="flex m-2 p-3 max-w-[700px] flex-wrap h-full justify-center items-center flex-row rounded-lg shadow-lg duration-300">
                        <div className="flex flex-500 w-[50%] rounded-md h-[30%] justify-center items-center overflow-hidden max-sm:w-[300px]">
                            <img src={eventDetails.event.image} alt={eventDetails.event.name} />
                        </div>
                        <div className="flex-col mt-2 -mr-3 ml-4 max-sm:-ml-4">
                            <h2 className="text-[#fb8500] m-1 text-[19px] font-bold">{eventDetails.event.name}</h2>
                            <h2 className="text-black m-1 text-[17px] font-bold">{eventDetails.event.location}</h2>
                            <h2 className="bg-gray-300 m-1 rounded-full text-[15px] text-center w-[160px]">
                                {formatEventDate(eventDetails.event.date)} {eventDetails.event.time}
                            </h2>
                            <div className="flex flex-col flex-wrap w-full">
                                <h2 className="text-[#fb8500] ml-1 text-[19px] font-bold">Ticket Types</h2>
                                {Array.isArray(eventDetails.ticketTypes) && eventDetails.ticketTypes.length > 0 ? (
                                    <div className="flex flex-col flex-wrap w-full">
                                        {eventDetails.ticketTypes.map((ticketType) => (
                                            <div key={ticketType.name} className="flex mb-1 flex-row shadow-md rounded-md">
                                                <h3 className="text-black m-1 text-[17px]">{ticketType.name}</h3>
                                                <p className="text-black m-1 text-[17px]">{ticketType.quantity} pcs.</p>
                                                <p className="text-black m-1 text-[17px]">Price: {ticketType.price}€</p>
                                            </div>
                                        ))}
                                        <Link to={`/tickets/${id}?userId=${localStorage.getItem('userId')}`}>
                                            <div className="flex justify-center items-center">
                                                <button className="w-[100px] h-[35px] m-2 text-center text-white bg-green-700 rounded-xl hover:bg-green-900 duration-200">Buy Ticket!</button>
                                            </div>
                                        </Link>
                                    </div>
                                ) : (
                                    <p>No ticket types available.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col flex-wrap w-full">
                        <h2 className="text-[#fb8500] ml-2 text-[25px] max-sm:ml-5 font-bold">Reviews</h2>
                        {Array.isArray(eventDetails.reviews) && eventDetails.reviews.length > 0 ? (
                            <div className="flex flex-col flex-wrap w-full">
                                {eventDetails.reviews.map((review) => (
                                    <div key={review.id} className="flex mb-1 ml-2 p-2 w-[700px] flex-col max-sm:w-[300px] max-sm:ml-3 shadow-md rounded-md">
                                        <div className="flex space-x-3 flex-row">
                                            <h1 className="ml-2 text-[#fb8500] text-[17px]">{review.username}</h1>
                                            <StarRating rating={review.rating} />
                                        </div>
                                        <p className="text-black ml-2 text-[15px]">{review.review}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="ml-2">No reviews available.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default EventDetails;
