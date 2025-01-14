import React from 'react';
import { useEffect, useState } from 'react';
import { PHOTO_REF_URL } from '@/service/GlobalApi';
import { GetPlaceDetails } from '@/service/GlobalApi';
import { Link } from 'react-router-dom';

function UserTripCardItem({ trip }) {
    useEffect(() => {
        trip && GetPlacePhoto();
    }, [trip])

    const [PhotoUrl, setPhotoUrl] = useState();


    const GetPlacePhoto = async () => {
        if (!trip?.userSelection?.location?.label) {
            console.warn('No location label provided');
            return;
        }

        try {
            const data = {
                textQuery: trip.userSelection.location.label
            };
            const response = await GetPlaceDetails(data);
            const photos = response.data.places?.[0]?.photos[9].name
            console.log(photos);
            const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', photos)
            setPhotoUrl(PhotoUrl);


        } catch (error) {
            console.error('Error fetching place details:', error.response?.data || error.message);

        }
    };
    return (
        <Link to={`/view-trip/${trip.id}`}>
            <div className="mt-10 bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out">
                {/* Image Section */}
                <img
                    src={PhotoUrl}
                    alt="Trip Location"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = './logo.svg'; // Fallback image
                    }}
                />

                {/* Trip Information */}
                <div className="p-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                        {trip.userSelection.location.label || 'Unknown Location'}
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        {trip.userSelection.days || 'Unknown'}-Day Trip with{' '}
                        {trip.userSelection.people || 'Unknown'} People, following a{' '}
                        <span className="font-medium text-blue-600">
                            {trip.userSelection.budget || 'Unknown'}
                        </span>{' '}
                        cost preference.
                    </p>
                </div>
            </div>
        </Link>
    );
}

export default UserTripCardItem;