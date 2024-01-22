import React, { useState } from 'react';
import axios from 'axios';
import PlaceImg from '../images/placeholder.png';

function InsertEvents() {
    const [nameValue, setNameValue] = useState('');
    const [locationValue, setLocationValue] = useState('');
    const [priceValue, setPriceValue] = useState('');
    const [dateValue, setDateValue] = useState('');
    const [timeValue, setTimeValue] = useState('');
    const [QtyValue, setQtyValue] = useState('');
    const [quantityError, setQuantityError] = useState('');
    const [image, setImage] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [ticketTypes, setTicketTypes] = useState([
        { name: '', price: '', quantity: '' }
    ]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const handleTicketTypeChange = (index, field, value) => {
        const updatedTicketTypes = [...ticketTypes];

        // Validate quantity to be a positive number
        if (field === 'quantity' && (isNaN(value) || parseInt(value, 10) <= 0)) {
            // You can display an error message or handle it in any way you prefer
            setQuantityError('Invalid quantity');
            return;
        }

        updatedTicketTypes[index][field] = value;
        setTicketTypes(updatedTicketTypes);
    };

    const addTicketType = () => {
        setTicketTypes([...ticketTypes, { name: '', price: '', quantity: '' }]);
    };

    const removeTicketType = (index) => {
        const updatedTicketTypes = [...ticketTypes];
        updatedTicketTypes.splice(index, 1);
        setTicketTypes(updatedTicketTypes);
    };

    const handleNameChange = (event) => setNameValue(event.target.value);
    const handleLocationChange = (event) => setLocationValue(event.target.value);
    const handlePriceChange = (event) => setPriceValue(event.target.value);

    const submitData = async () => {
        try {
            // Validate empty input fields
            if (!nameValue || !locationValue || !dateValue || !timeValue || !image) {
                throw new Error('Please fill in all fields and upload an image.');
            }

            // Additional validations
            if (nameValue.length < 3) {
                throw new Error('Name should be at least 3 characters long.');
            }

            if (locationValue.length < 3) {
                throw new Error('Location should be at least 3 characters long.');
            }

            const selectedDate = new Date(dateValue);
            const currentDate = new Date();

            if (selectedDate < currentDate) {
                throw new Error('Selected date cannot be in the past.');
            }

            // If all validations pass, proceed with the POST request
            const formData = new FormData();

            formData.append('name', nameValue);
            formData.append('location', locationValue);
            formData.append('date', dateValue);
            formData.append('time', timeValue);
            formData.append('image', image);
            formData.append('category', selectedCategory);

            ticketTypes.forEach((ticketType, index) => {
                formData.append(`ticketTypes[${index}][name]`, ticketType.name);
                formData.append(`ticketTypes[${index}][price]`, ticketType.price);
                formData.append(`ticketTypes[${index}][quantity]`, ticketType.quantity);
            });

            const response = await axios.post('http://localhost/datubazes/tickets/insertEvents.php', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log(response.data);

            if (response.data.success) {
                if (response.data.isDuplicate) {
                    // Handle duplicate event
                    setErrorMessage(response.data.message);
                } else {
                    // Handle successful response
                    console.log(response.data.message);
                    setSuccessMessage('Event successfully added!');
                    setErrorMessage(null);
                    setDateValue('');
                    setImage(null);
                    setTicketTypes([]);
                    setLocationValue('');
                    setNameValue('');
                    setPriceValue('');
                    setQtyValue('');
                    setSelectedCategory('');
                    setTimeValue('');
                }
            } else {
                // Handle other errors
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            // Handle validation errors
            console.error('Error submitting data:', error);

            if (error.message) {
                setErrorMessage(error.message);
            }

            setSuccessMessage(null);
        }
    };


    const handleChange = (file) => {
        setImage(file[0]);
    };

    return (
        <>
            <div className="flex m-5 p-2 max-sm:max-w-[320px]  flex-col rounded-b flex-wrap overflow-hidden content-center items-center shadow-lg duration-300">
                <h1 className="m-5 font-bold text-[#fb8500] text-4xl">Add an event!</h1>
                <div className="flex flex-wrap flex-500 w-full flex-row justify-center">
                    <div className="flex flex-wrap flex-col m-1 flex-500 items-center p-1">
                        {image ? (
                            <>
                                <img className="mb-5 mt-2 w-full max-w-[350px] h-[200px] max-sm:max-h-[170px] overflow-hidden" src={URL.createObjectURL(image)} />
                                <input type="file" onChange={(e) => handleChange(e.target.files)} />
                            </>
                        ) : (
                            <>
                                <img className="mb-5 mt-2 w-full max-w-[350px] h-[180px] max-sm:max-h-[190px] overflow-hidden max-sm:w-[300px] max-sm:h-[220px]" src={PlaceImg} />
                                <input type="file" onChange={(e) => handleChange(e.target.files)} />
                            </>
                        )}
                    </div>
                    <div className="flex flex-wrap flex-col m-3 flex-500 items-center p-1">
                        {/* Location Input */}
                        <div className=" flex w-full  relative justify-center items-center">
                            <input
                                className={`w-[94%] -ml-3 -mb-1 placeholder-black outline-none h-[30px] max-sm:ml-0 max-sm:w-[300px] ${locationValue ? 'border-b-2 border-[#fb8500]' : 'border-b-2 border-black'}`}
                                type="text"
                                placeholder=" "
                                value={locationValue}
                                onChange={handleLocationChange}
                            />
                            <label className={`absolute left-1.5 -top-1 text-base origin-top max-sm:ml-4 transition-transform ${locationValue ? '-translate-y-3 text-[#fb8500] text-xs' : 'translate-y-1 text-black text-sm'}`}>Location</label>
                        </div>
                        <div className="flex flex-row flex-wrap flex-500 items-center p-1">
                            <div className="flex flex-col mt-4 flex-500 items-center justify-center p-1">
                                <div className=" mb-4 relative">
                                    <input
                                        className={`w-[200px] placeholder-black outline-none max-sm:w-[300px] max-sm:ml-3 ${nameValue ? 'border-b-2 border-[#fb8500]' : 'border-b-2 border-black'}`}
                                        type="text"
                                        placeholder=" "
                                        value={nameValue}
                                        onChange={handleNameChange}
                                    />
                                    <label className={`absolute left-0 text-base -mt-1.5 max-sm:ml-3 transform origin-top transition-transform ${nameValue ? '-translate-y-3 text-[#fb8500] text-xs' : 'translate-y-1 text-black text-sm'}`}>Name</label>
                                </div>
                                <select className={`w-[200px] max-sm:w-[300px] mb-6 max-sm:ml-3 ${selectedCategory ? 'border-b-2 border-[#fb8500]' : 'border-b-2 border-black'} `} onChange={handleCategoryChange} value={selectedCategory}>
                                    <option value="">All Categories</option>
                                    <option value="Sport">Sport</option>
                                    <option value="Music">Music</option>
                                    <option value="Theater">Theater</option>
                                    <option value="City Celebration">City Celebration</option>
                                    <option value="Other">Other</option>
                                </select>
                                {/* Price Input */}
                            </div>
                            <div className="flex flex-col m-3 flex-500 items-center justify-center p-1 max-sm:-mt-5">
                                {/* Date Input */}
                                <div className="mb-4">
                                    <input
                                        className={`w-[200px] -mb-1 max-sm:w-[300px] placeholder-black outline-none h-[30px] ${dateValue ? 'border-b-2 border-[#fb8500]' : 'border-b-2 border-black'}`}
                                        type="date"
                                        value={dateValue}
                                        onChange={(e) => setDateValue(e.target.value)}
                                    />
                                </div>
                                {/* Time Input */}
                                <div className="mb-4">
                                    <input
                                        className={`w-[200px] -mb-1 max-sm:w-[300px] placeholder-black outline-none h-[30px] ${timeValue ? 'border-b-2 border-[#fb8500]' : 'border-b-2 border-black'}`}
                                        type="time"
                                        value={timeValue}
                                        onChange={(e) => setTimeValue(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        {ticketTypes.map((type, index) => (
                            <div key={index} className="flex flex-wrap space-y-5 flex-col">
                                <div className="flex flex-wrap w-full relative">
                                    <input
                                        className={` w-[420px] -ml-3 -mb-1 placeholder-black outline-none max-sm:w-[300px] max-sm:ml-5 ${type.name ? 'border-b-2 border-[#fb8500]' : 'border-b-2 border-black'}`}
                                        type="text"
                                        placeholder=" "
                                        value={type.name}
                                        onChange={(e) => handleTicketTypeChange(index, 'name', e.target.value)}
                                    />
                                    <label className={`absolute -left-3 text-base -mt-1.5 transform origin-top max-sm:ml-8 transition-transform ${type.name ? '-translate-y-3 text-[#fb8500] text-xs' : 'translate-y-1 text-black text-sm'}`}>Ticket Name</label>
                                </div>
                                <div className="flex flex-row flex-wrap space-x-5 -mt-5justify-center items-center">
                                    <div className="mb-4 relative">
                                        <input
                                            className={`w-[200px] -ml-3 placeholder-black outline-none max-sm:w-[300px] max-sm:ml-5 ${type.price ? 'border-b-2 border-[#fb8500]' : 'border-b-2 border-black'}`}
                                            type="text"
                                            placeholder=" "
                                            value={type.price}
                                            onChange={(e) => handleTicketTypeChange(index, 'price', e.target.value)}
                                        />
                                        <label className={`absolute -left-3 text-base -mt-1.5 transform origin-top max-sm:ml-8 transition-transform ${type.price ? '-translate-y-3 text-[#fb8500] text-xs' : 'translate-y-1 text-black text-sm'}`}>Ticket Price</label>
                                    </div>
                                    <div className="mb-4 relative">
                                        <input
                                            className={`w-[200px] placeholder-black outline-none max-sm:w-[300px] ${type.quantity ? 'border-b-2 border-[#fb8500]' : 'border-b-2 border-black'}`}
                                            type="text"
                                            placeholder=" "
                                            value={type.quantity}
                                            onChange={(e) => handleTicketTypeChange(index, 'quantity', e.target.value)}
                                        />
                                        <label className={`absolute -left-0 text-base -mt-1.5 transform origin-top transition-transform ${type.quantity ? '-translate-y-3 text-[#fb8500] text-xs' : 'translate-y-1 text-black text-sm'}`}>Ticket Quantity</label>
                                    </div>
                                </div>
                                <button type="button" onClick={() => removeTicketType(index)} className="p-2 w-[130px] self-center bg-red-500 text-white rounded-md">Remove</button>
                            </div>
                        ))}
                        <button type="button" onClick={addTicketType} className="p-2 m-2 self-center bg-green-500 text-white rounded-md">Add Ticket Type</button>
                        <div className="flex content-center m-2 items-center text-red-500">
                            {errorMessage && <span>{errorMessage}</span>}
                        </div>
                        <div className="flex content-center m-2 items-center text-red-500">
                            {quantityError && <span>{quantityError}</span>}
                        </div>
                        <button
                            className="bg-blue-900 rounded-md justify-center text-white w-1/2 h-8 hover:bg-blue-700 hover:duration-300"
                            onClick={submitData}
                        >
                            Submit
                        </button>
                        <div className="flex content-center items-center w-[200px] text-green-500">
                            {successMessage && <span>{successMessage}</span>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default InsertEvents;