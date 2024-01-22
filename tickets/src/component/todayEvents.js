import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

function TodayEvents() {
    const [todayEvents, setTodayEvents] = useState([]);
    const [displayedEvents, setDisplayedEvents] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchTodayEvents = async () => {
            try {
                const response = await fetch('http://localhost/datubazes/tickets/todayEvents.php');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setTodayEvents(data);
                setDisplayedEvents(data.slice(0, 3)); // Display the first 3 events initially
            } catch (error) {
                console.error('Error fetching events:', error.message);
            }
        };

        fetchTodayEvents();
    }, []);

    const formatEventDate = (dateString) => {
        try {
            const options = { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit' };
            const eventDate = new Date(dateString);
            if (isNaN(eventDate.getTime())) {
                throw new Error('Invalid date');
            }
            return eventDate.toLocaleDateString('en-US', options);
        } catch (error) {
            console.error('Error formatting date:', error.message);
            return 'Invalid Date';
        }
    };

    const handleNext = () => {
        const nextIndex = (currentIndex + 1) % todayEvents.length;
        setDisplayedEvents(getDisplayEvents(nextIndex));
        setCurrentIndex(nextIndex);
    };

    const handlePrev = () => {
        const prevIndex = (currentIndex - 1 + todayEvents.length) % todayEvents.length;
        setDisplayedEvents(getDisplayEvents(prevIndex));
        setCurrentIndex(prevIndex);
    };

    const getDisplayEvents = (centerIndex) => {
        const prevIndex = (centerIndex - 1 + todayEvents.length) % todayEvents.length;
        const nextIndex = (centerIndex + 1) % todayEvents.length;

        return [
            todayEvents[prevIndex],
            todayEvents[centerIndex],
            todayEvents[nextIndex],
        ];
    };

    return (
        <>
            <div className="flex w-full p-10 m-[-30px] flex-col max-sm:m-[-130px]">
                <h1 className="text-[#fb8500] text-2xl font-bold">Happening Today!</h1>
                <div className="flex flex-wrap mt-2 w-full justify-center items-center flex-row p-2 ">
                    {displayedEvents.map((event, index) => (
                        <Link to={`/event/${event.id}`} key={index} className="flex flex-500 m-2 h-full p-1 flex-col rounded-lg cursor-pointer hover:shadow-lg duration-300">
                            <div
                                key={event.id}
                                className={`${
                                    index === 1 ? 'lg:scale-110 duration-1000' : 'lg:scale-100 duration-1000'
                                }`}
                            >
                                <div className="flex flex-500 max-w-full lg:max-w-[300px] h-[150px] justify-center items-center overflow-hidden">
                                    <img src={event.image} alt={event.name} />
                                </div>
                                <h2 className="text-[#fb8500] m-0.5 text-[17px] font-bold">{event.name}</h2>
                                <h2 className="text-black m-0.5 text-[15px] font-bold">{event.location}</h2>
                                <h2 className="bg-gray-300 m-0.5 rounded-full text-[13px] text-center w-[150px]">
                                    {formatEventDate(event.date)} {event.time}
                                </h2>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="flex justify-between mt-2 max-sm:hidden">
                    <button className="text-[#fb8500]" onClick={handlePrev}>Previous</button>
                    <button className="text-[#fb8500]" onClick={handleNext}>Next</button>
                </div>
            </div>
        </>
    );
}

export default TodayEvents;
