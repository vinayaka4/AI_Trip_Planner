import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PHOTO_REF_URL, GetPlaceDetails } from '@/service/GlobalApi';

function Places({ trip }) {
    const [placePhotos, setPlacePhotos] = useState({});

    useEffect(() => {
        if (trip?.Tripdata?.itinerary) {
            fetchAllPlacePhotos();
        }
    }, [trip]);

    const fetchAllPlacePhotos = async () => {
        if (!trip?.userSelection?.location?.label) {
            console.warn('No location label provided');
            return;
        }

        const newPlacePhotos = { ...placePhotos };
        const allPlaces = [];

        // Collect all places from all days
        Object.values(trip.Tripdata.itinerary).forEach(dayData => {
            if (dayData.places && Array.isArray(dayData.places)) {
                allPlaces.push(...dayData.places);
            }
        });

        // Fetch photos for all places concurrently
        await Promise.all(
            allPlaces.map(async (place) => {
                if (!place.placeName || newPlacePhotos[place.placeName]) {
                    return; // Skip if no place name or photo already fetched
                }

                try {
                    const data = { textQuery: place.placeName };
                    const response = await GetPlaceDetails(data);
                    const photoName = response.data.places?.[0]?.photos[0]?.name;

                    if (photoName) {
                        const photoUrl = PHOTO_REF_URL.replace('{NAME}', photoName);
                        newPlacePhotos[place.placeName] = photoUrl;
                    }
                } catch (error) {
                    console.error(`Error fetching photo for ${place.placeName}:`,
                        error.response?.data || error.message);
                    newPlacePhotos[place.placeName] = '/placeholder-image.jpg';
                }
            })
        );

        setPlacePhotos(newPlacePhotos);
    };

    const PlaceCard = ({ place }) => (
        <Link
            to={'https://www.google.com/maps/search/?api=1&query=' +
                encodeURIComponent(place.placeName)}
            target="_blank"
            rel="noreferrer"
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105 p-4"
        >
            <img
                src={placePhotos[place.placeName] || '/placeholder-image.jpg'}
                alt={place.placeName || 'Place'}
                className="rounded-t-lg w-full h-40 object-cover mb-4"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-image.jpg';
                }}
            />
            <div>
                <h4 className="font-bold text-lg text-gray-800 mb-2">
                    {place.placeName || 'Unnamed Place'}
                </h4>
                <p className="text-gray-600 text-sm mb-2">
                    {place.placeDetails || 'Details not available.'}
                </p>
                <p className="text-gray-700 text-sm mb-1">
                    ⭐ <span className="text-yellow-500 font-semibold">
                        {place.rating || 'No rating available'}
                    </span>
                </p>
                <p className="text-gray-700 text-sm mb-1">
                    💲 <span className="text-blue-600 font-medium">
                        {place.ticketPricing || 'No pricing available'}
                    </span>
                </p>
                <p className="text-gray-600 text-sm">
                    🚗 Travel Time: {place.travelTime || 'Not specified'}
                </p>
            </div>
        </Link>
    );

    const DaySection = ({ dayData, dayNumber }) => (
        <div className="mb-8">
            <h3 className="font-bold text-xl text-blue-700 mb-3">
                {`Day ${dayNumber}: ${dayData.theme || 'No Theme Provided'}`}
            </h3>
            <p className="text-gray-600 mb-4">
                Best Time to Visit: {dayData.bestTimeToVisit || 'Not specified'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dayData.places?.map((place, index) => (
                    <PlaceCard key={index} place={place} />
                ))}
            </div>
        </div>
    );

    if (!trip?.Tripdata?.itinerary) {
        return (
            <div className="p-6">
                <h2 className="font-bold text-2xl mb-5 text-gray-800">
                    Itinerary Details
                </h2>
                <p className="text-gray-600">No itinerary available.</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="font-bold text-2xl mb-5 text-gray-800">
                Itinerary Details
            </h2>
            <div>
                {Object.entries(trip.Tripdata.itinerary).map(([dayKey, dayData], index) => (
                    <DaySection
                        key={dayKey}
                        dayData={dayData}
                        dayNumber={index + 1}
                    />
                ))}
            </div>
        </div>
    );
}

export default Places;