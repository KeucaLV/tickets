import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';


const PurchaseHistory = () => {
    const [userId, setUserId] = useState(() => localStorage.getItem('userId'));
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [error, setError] = useState(null);
    const [PdfError, setPdfError] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');


    const handleDownloadPdf = async () => {
        try {

            const response = await fetch("http://localhost/datubazes/tickets/fpdf/convert-pdf.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: userId }),
            });

            if (response.ok) {
                const blob = await response.blob();

                if (blob.size === 0) {
                    setPdfError("Nothing found for the selected month and year.");
                    return;
                }

                const pdfName = `${userId}_Purchases.pdf`;

                const url = window.URL.createObjectURL(new Blob([blob]));

                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", pdfName);

                document.body.appendChild(link);
                link.click();

                document.body.removeChild(link);
            } else {
                console.error("Failed to fetch PDF data:", response.statusText);
                setPdfError("Error fetching PDF data");
            }
        } catch (error) {
            console.error("Error downloading PDF:", error);
            setPdfError("Error downloading PDF");
        }
    };

    useEffect(() => {
        const fetchPurchaseHistory = async () => {
            try {
                const response = await fetch('http://localhost/datubazes/tickets/getPurchasedTickets.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `userId=${userId}`,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Response from server:', data);

                if ('error' in data) {
                    setError(data.error);
                } else {
                    setPurchaseHistory(data.purchases || []);
                }
            } catch (error) {
                setError(`Error: ${error.message}`);
            }
        };

        fetchPurchaseHistory();
    }, [userId]);

    const handleSortOrderChange = (e) => {
        setSortOrder(e.target.value);
        const sortedHistory = [...purchaseHistory];
        sortedHistory.sort((a, b) => {
            // Implement your sorting logic here
            // For example, sorting by purchase ID in ascending order
            return sortOrder === 'asc' ? a.purchaseID - b.purchaseID : b.purchaseID - a.purchaseID;
        });
        setPurchaseHistory(sortedHistory);
    };

    return (
        <>
            <h1 className="m-5 font-bold text-[#fb8500] text-4xl">Your purchase history!</h1>
            {PdfError && <p className="text-red-500">{PdfError}</p>}
            <button onClick={handleDownloadPdf} className="bg-blue-500 text-white p-2 rounded">
                Generate PDF
            </button>
            <select
                id="sortOrder"
                value={sortOrder}
                onChange={handleSortOrderChange}
                className="p-2 w-[115px] mt-1 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
            >
                <option value="asc">Newest</option>
                <option value="desc">Oldest</option>
            </select>
        <div className="flex flex-row w-full items-center justify-center space-x-5 flex-wrap p-5">
            {error && <p className="text-red-500">{error}</p>}
            {purchaseHistory.length > 0 ? (
                <div className="flex flex-col ">
                    {purchaseHistory.map((purchase, index) => (
                        <div key={index} className="flex flex-row m-2 flex-wrap border rounded p-4">
                            {purchase.events ? (
                                <>
                                    {purchase.events.map((event, eventIndex) => (
                                        <div key={eventIndex} className="mb-4 flex flex-col">
                                            <img
                                                src={event.image}
                                                alt={`Product Image for Purchase ID: ${event.id}`}
                                                className="max-w-[300px] my-4"
                                            />
                                            <p><strong className="text-blue-500">Event Name:</strong> {event.name} </p>
                                            <p><strong className="text-blue-500">Event Date:</strong> {event.date} </p>
                                            <p><strong className="text-blue-500">Event Time:</strong> {event.time} </p>
                                            {/* Add other event details as needed */}
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <p>No event details available for this purchase</p>
                            )}
                            <div className="flex flex-col m-5">
                                <strong className="text-blue-500">Purchase ID:</strong> {purchase.purchaseID} <br />
                                <strong className="text-blue-500">Product Name:</strong> {purchase.ticket_name} <br />
                                <strong className="text-blue-500">Price:</strong> {purchase.price}€ <br />
                                <strong className="text-blue-500">Quantity:</strong> {purchase.quantity}pcs. <br />
                            </div>
                            <div className="flex flex-col m-5">
                                <strong className="text-blue-500">Show this QR code at the register!</strong>
                                <QRCode className=" w-[150px] -mt-8 self-center" value={`Purchase ID: ${purchase.purchaseID}`} />
                            </div>
                            <hr className="my-2 border-t" />
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No purchase history found for the user</p>
            )}
        </div>
        </>
    );
}

export default PurchaseHistory;
