import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { useLocation } from 'react-router-dom';
import Cart from "./Cart";

function BuyTickets({ selectedItems, setSelectedItems }) {
    const { id } = useParams();
    const [eventDetails, setEventDetails] = useState(null);
    const [quantityValue, setQuantityValue] = useState('');
    const [ticketValue, setTicketValue] = useState('');
    const [priceValue, setPriceValue] = useState('');
    const [error, setError] = useState('');
    const [stripe, setStripe] = useState(null);

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const userId = params.get('userId');

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

        const initStripe = async () => {
            const stripeObj = await loadStripe('pk_test_51MLtN5DjfQfCJkDAms2C5NcgvPCTtU8ORYtzsPMGqYAbXh1a5OdsDbzWT06o3ndaVIAtXdwtMh12vYxmbMj9RNs7004DATCm0d');
            setStripe(stripeObj);
        };

        initStripe();
    }, [id]);

    const formatEventDate = (dateString) => {
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit' };
        const eventDate = new Date(dateString);
        if (isNaN(eventDate.getTime())) {
            throw new Error('Invalid date');
        }
        return eventDate.toLocaleDateString('en-US', options);
    };

    const handleQuantityValue = (event) => {
        const inputQuantity = parseInt(event.target.value, 10);
        const selectedTicketType = eventDetails.ticketTypes.find((ticketType) => ticketType.name === ticketValue);

        if (!isNaN(inputQuantity) && selectedTicketType && inputQuantity <= selectedTicketType.quantity && inputQuantity > 0) {
            setQuantityValue(inputQuantity.toString());
            setError('');
        } else {
            setQuantityValue('');
            setError('Invalid quantity or exceeds available quantity');
        }
    };

    const handleOrderClick = async () => {
        const parsedQuantity = parseInt(quantityValue, 10);
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            setError('Invalid quantity');
            return;
        }

        if (!ticketValue) {
            setError('Please select a ticket type');
            return;
        }

        // Add the selected item to the state
        const selectedItem = {
            eventId: id,
            ticketType: ticketValue,
            quantity: quantityValue,
            price: priceValue,
        };

        // Set event ID in local storage
        localStorage.setItem('eventId', id);

        // Save selected items to local storage
        const storedItems = JSON.parse(localStorage.getItem(`selectedItems_${userId}`)) || [];
        localStorage.setItem(`selectedItems_${userId}`, JSON.stringify([...storedItems, selectedItem]));

        // Update state
        setSelectedItems((prevItems) => [...prevItems, selectedItem]);
    };



    const handleTicketTypeChange = (event) => {
        const selectedTicketType = event.target.value;
        const selectedTicket = eventDetails.ticketTypes.find((ticketType) => ticketType.name === selectedTicketType);

        if (selectedTicket) {
            setTicketValue(selectedTicketType);
            setPriceValue(selectedTicket.price);
        } else {
            setTicketValue('');
            setPriceValue('');
        }
    };

    const selectedItem = {
        eventId: id,
        ticketType: ticketValue,
        quantity: quantityValue,
        price: priceValue,
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
                                <select className="mt-1" onChange={handleTicketTypeChange}>
                                    <option value="">Select a ticket type!</option>
                                    {Array.isArray(eventDetails.ticketTypes) ? (
                                        eventDetails.ticketTypes.map((ticketType) => (
                                            <option key={ticketType.name} value={ticketType.name} className="flex mb-1 flex-row shadow-md rounded-md">
                                                {ticketType.name} Qty: {ticketType.quantity}pcs. {ticketType.price}€
                                            </option>
                                        ))
                                    ) : (
                                        <option value="" disabled>No ticket types available.</option>
                                    )}
                                </select>
                                <div className="flex flex-wrap w-full relative">
                                    <input
                                        className={`w-[250px] ml-1 mt-4 placeholder-black outline-none max-sm:w-[300px] ${
                                            quantityValue ? 'border-b-2 border-[#fb8500]' : 'border-b-2 border-black'
                                        }`}
                                        type="number"
                                        placeholder=" "
                                        value={quantityValue}
                                        onChange={handleQuantityValue}
                                    />
                                    <label
                                        className={`absolute left-1 top-4 text-base -mt-1.5 transform origin-top transition-transform ${
                                            quantityValue ? '-translate-y-3 text-[#fb8500] text-xs' : 'translate-y-1 text-black text-sm'
                                        }`}
                                    >
                                        How much would you like?
                                    </label>
                                </div>
                            </div>
                            <Link
                                to={{
                                    pathname: `/cart/${id}`,
                                    search: `userId=${localStorage.getItem('userId')}`,
                                    state: {
                                        selectedItems: [...selectedItems, selectedItem],
                                    },
                                }}
                                style={{ textDecoration: 'none' }}
                            >

                            <div className="flex justify-center items-center">
                                    <button
                                        onClick={handleOrderClick}
                                        className="w-[100px] h-[35px] m-2 text-center text-white bg-green-700 rounded-xl hover:bg-green-900 duration-200"
                                    >
                                        Order!
                                    </button>
                                </div>
                                {error && <p className="text-red-500 mt-2">{error}</p>}
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BuyTickets;