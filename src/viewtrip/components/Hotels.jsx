import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PHOTO_REF_URL } from '@/service/GlobalApi';
import { GetPlaceDetails } from '@/service/GlobalApi';

function Hotels({ trip }) {
    const [hotelPhotos, setHotelPhotos] = useState({});

    useEffect(() => {
        if (trip?.Tripdata?.hotels?.length > 0) {
            fetchHotelPhotos();
        }
    }, [trip]);

    const fetchHotelPhotos = async () => {
        if (!trip?.userSelection?.location?.label) {
            console.warn('No location label provided');
            return;
        }

        // Create a new object to store all photo URLs
        const newHotelPhotos = { ...hotelPhotos };

        // Fetch photos for each hotel
        await Promise.all(
            trip.Tripdata.hotels.map(async (hotel) => {
                try {
                    const data = { textQuery: hotel.hotelName };
                    const response = await GetPlaceDetails(data);
                    const photoName = response.data.places?.[0]?.photos[0]?.name;

                    if (photoName) {
                        const photoUrl = PHOTO_REF_URL.replace('{NAME}', photoName);
                        newHotelPhotos[hotel.hotelName] = photoUrl;
                    }
                } catch (error) {
                    console.error(`Error fetching photo for ${hotel.hotelName}:`,
                        error.response?.data || error.message);
                    // Set a fallback image URL
                    newHotelPhotos[hotel.hotelName] = '/path/to/fallback-image.jpg';
                }
            })
        );

        setHotelPhotos(newHotelPhotos);
    };

    const HotelCard = ({ hotel }) => (
        <Link
            to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.hotelName + ' ' + hotel.hotelAddress)}`}
            target="_blank"
            rel="noreferrer"
            className="block"
        >
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105 p-4 cursor-pointer">
                <img
                    src={hotelPhotos[hotel.hotelName] || '/path/to/fallback-image.jpg'}
                    alt={hotel.hotelName || 'Hotel'}
                    className="rounded-t-lg w-full h-40 object-cover"
                />
                <div className="mt-4">
                    <h2 className="font-bold text-lg text-gray-800 mb-2">
                        {hotel.hotelName || 'Unnamed Hotel'}
                    </h2>
                    <p className="text-gray-600 text-sm mb-3">
                        📍 {hotel.hotelAddress || 'Address not available'}
                    </p>
                    <p className="text-gray-700 text-sm mb-3">
                        ⭐ <span className="text-yellow-500 font-semibold">
                            {hotel.rating || 'No rating available'}
                        </span>
                    </p>
                    <p className="text-gray-700 text-sm">
                        💲 <span className="text-blue-600 font-medium">
                            {hotel.price || 'Price not specified'}
                        </span>
                        <span className="text-gray-500"> per night</span>
                    </p>
                </div>
            </div>
        </Link>
    );

    if (!trip?.Tripdata?.hotels?.length) {
        return (
            <div className="p-6">
                <h2 className="font-bold text-2xl mt-5 text-gray-800">
                    Hotel Recommendations
                </h2>
                <p className="text-gray-600 mt-4">No hotels available.</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="font-bold text-2xl mt-5 text-gray-800">
                Hotel Recommendations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {trip.Tripdata.hotels.map((hotel, index) => (
                    <HotelCard key={index} hotel={hotel} />
                ))}
            </div>
        </div>
    );
}

export default Hotels;