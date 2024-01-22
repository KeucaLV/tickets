import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventDetails from './EventDetails';
import sport from "../images/sport.jpg";
import other from "../images/other.jpg";
import music from "../images/music.jpg";
import theater from "../images/theather.jpg";
import cityCelebration from "../images/cityCelebration.jpg";

function AllEvents() {
    const [events, setEvents] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchEvents(selectedCategory);
    }, [selectedCategory]);

    const fetchEvents = async (category) => {
        try {
            let url = 'http://localhost/datubazes/tickets/getEvents.php';
            if (category) {
                url += `?category=${category}`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error.message);
        }
    };

    const formatEventDate = (dateString) => {
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit' };
        const eventDate = new Date(dateString);
        if (isNaN(eventDate.getTime())) {
            throw new Error('Invalid date');
        }
        return eventDate.toLocaleDateString('en-US', options);
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const filteredEvents = events
        .filter((event) => event.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter((event) => !selectedDate || new Date(event.date) >= new Date(selectedDate));

    return (
        <>
            <div className="flex w-full p-10 flex-col max-sm:m-[-10px]">
                <div className="hidden self-center m-2+ max-md:flex">
                    <select onChange={(e) => handleCategoryClick(e.target.value)} value={selectedCategory}>
                        <option value="">All Categories</option>
                        <option value="Sport">Sport</option>
                        <option value="Music">Music</option>
                        <option value="Theater">Theater</option>
                        <option value="City Celebration">City Celebration</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="flex p-5 -mt-4 content-center items-center space-x-6 flex-row max-sm:hidden">
                    {/* Buttons for each category */}
                    <div>
                        <button onClick={() => handleCategoryClick('Sport')} className="flex w-[250px] rounded-md h-[140px] overflow-hidden justify-center content-center hover:shadow-2xl duration-300">
                            <img className="rounded-xl hover:shadow-4xl-black duration-300" src={sport} alt="Sport" />
                            <div className="flex absolute w-[250px] h-[140px] p-2 rounded-md bg-black bg-opacity-50 content-center items-center">
                                <h1 className="text-4xl text-white ml-16 font-extrabold max-sm:text-2xl">Sport</h1>
                            </div>
                        </button>
                    </div>
                    <div>
                        <button onClick={() => handleCategoryClick('Music')} className="flex w-[250px] rounded-md h-[140px] overflow-hidden justify-center content-center hover:shadow-2xl duration-300">
                            <img className="rounded-xl hover:shadow-xl duration-300" src={music} alt="Music" />
                            <div className="flex absolute w-[250px] h-[140px] p-2 rounded-md bg-black bg-opacity-50 content-center items-center">
                                <h1 className="text-4xl text-white ml-16 font-extrabold max-sm:text-2xl">Music</h1>
                            </div>
                        </button>
                    </div>
                    <div>
                        <button onClick={() => handleCategoryClick('Theater')} className="flex w-[250px] rounded-md h-[140px] overflow-hidden justify-center content-center hover:shadow-2xl duration-300">
                            <img className="rounded-xl hover:shadow-xl duration-300" src={theater} alt="Theater" />
                            <div className="flex absolute w-[250px] h-[140px] p-2 rounded-md bg-black bg-opacity-50 content-center items-center">
                                <h1 className="text-4xl text-white ml-12 font-extrabold max-sm:text-2xl">Theater</h1>
                            </div>
                        </button>
                    </div>
                    <div>
                        <button onClick={() => handleCategoryClick('City Celebration')} className="flex w-[250px] rounded-md h-[140px] overflow-hidden justify-center content-center hover:shadow-2xl duration-300">
                            <img className="rounded-xl hover:shadow-xl duration-300" src={cityCelebration} alt="City Celebration" />
                            <div className="flex absolute w-[250px] h-[140px] p-2 rounded-md bg-black bg-opacity-50 content-center items-center">
                                <h1 className="text-4xl text-white ml-2 font-extrabold max-sm:text-2xl">City Celebration</h1>
                            </div>
                        </button>
                    </div>
                    <div>
                        <button onClick={() => handleCategoryClick('Other')} className="flex w-[250px] rounded-md h-[140px] overflow-hidden justify-center content-center hover:shadow-2xl duration-300">
                            <img className="rounded-xl hover:shadow-xl duration-300" src={other} alt="Other" />
                            <div className="flex absolute w-[250px] h-[140px] p-2 rounded-md bg-black bg-opacity-50 content-center items-center">
                                <h1 className="text-4xl text-white ml-14 font-extrabold max-sm:text-2xl">Other..</h1>
                            </div>
                        </button>
                    </div>
                </div>
                <div className="flex ml-2.5 flex-row flex-wrap justify-center items-center w-full">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="m-2 w-[45%] self-center p-2 max-sm:w-[90%] rounded border border-gray-300 focus:outline-none focus:border-[#fb8500] transition-all duration-300"
                    />
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="m-2 p-2 w-[45%] rounded border max-sm:w-[90%] border-gray-300 focus:outline-none focus:border-[#fb8500] transition-all duration-300"
                    />
                </div>
                <h1 className="text-[#fb8500] text-2xl font-bold">All events available events!</h1>
                {/* Error message for no events */}
                {filteredEvents.length === 0 && (
                    <p className="text-red-500 mt-2">No events found based on the selected criteria.</p>
                )}
                <div className="flex flex-wrap mt-2 h-[300px] w-full justify-center items-center flex-row p-2 ">
                    {filteredEvents.map((event) => (
                        <Link to={`/event/${event.id}`} key={event.id} className="flex flex-500 m-2 h-full p-1 flex-col rounded-lg cursor-pointer hover:shadow-lg duration-300">
                            <div className="flex flex-500 max-w-[300px] rounded-md h-[150px] justify-center items-center overflow-hidden">
                                <img src={event.image} alt={event.name} />
                            </div>
                            <h2 className="text-[#fb8500] m-0.5 text-[17px] font-bold">{event.name}</h2>
                            <h2 className="text-black m-0.5 text-[15px] font-bold">{event.location}</h2>
                            <h2 className="bg-gray-300 m-0.5 rounded-full text-[13px] text-center w-[160px]">{formatEventDate(event.date)} {event.time}</h2>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}

export default AllEvents;
