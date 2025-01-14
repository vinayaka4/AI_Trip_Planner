import { Button } from "@/components/ui/button";
import { GetPlaceDetails } from "@/service/GlobalApi";
import React, { useEffect, useState } from "react";
import { IoIosSend } from "react-icons/io";
import { PHOTO_REF_URL } from "@/service/GlobalApi";

function Information({ trip }) {
    console.log(trip);

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
            //setPhotoUrl(PhotoUrl);


        } catch (error) {
            console.error('Error fetching place details:', error.response?.data || error.message);
            // Handle the error appropriately (e.g., show user feedback)
        }
    };

    return (
        <div className="p-4 md:p-8 bg-white shadow rounded-lg">
            {/* Image Section */}
            <img
                src={PhotoUrl || './logo.svg'}
                alt="Trip Location"
                className="h-[200px] w-full object-cover rounded-lg md:h-[300px]"
            />

            {/* Information Section */}
            <div className="mt-4 flex flex-col md:flex-row md:justify-between md:items-center">
                {/* Text Details */}
                <div className="my-5 flex flex-col gap-3">
                    <h2 className="font-bold text-lg md:text-2xl text-gray-800">
                        {trip?.userSelection?.location?.label || "Unknown Location"}
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        <span className="p-2 bg-gray-100 rounded-full text-gray-600 text-xs md:text-sm">
                            📅 {trip?.userSelection?.days || 0} Day(s)
                        </span>
                        <span className="p-2 bg-gray-100 rounded-full text-gray-600 text-xs md:text-sm">
                            💰 Travel Preference: {trip?.userSelection?.budget || "N/A"}
                        </span>
                        <span className="p-2 bg-gray-100 rounded-full text-gray-600 text-xs md:text-sm">
                            👨‍👨‍👧‍👧 No. Of Travellers: {trip?.userSelection?.people || "N/A"}
                        </span>
                    </div>
                </div>

                {/* Share Button */}
                <Button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    <IoIosSend className="text-lg" />
                    <span className="hidden md:block">Share</span>
                </Button>
            </div>


        </div>
    );
}

export default Information;
