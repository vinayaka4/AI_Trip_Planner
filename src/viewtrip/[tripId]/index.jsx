import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useParams } from 'react-router';
import { db } from '@/service/FirebaseConfig';
import Information from '../components/Information';
import Hotels from '../components/Hotels';
import Places from '../components/Places';
import Footer from '../components/Footer';

function Viewtrip() {
    const { tripId } = useParams();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(false);

    const GetTripData = useCallback(async () => {
        setLoading(true);
        try {
            const docRef = doc(db, "AI_trip_planner", tripId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setTrip(docSnap.data());
                console.log("Document data:", docSnap.data());
            } else {
                toast.error('No such document!');
            }
        } catch (error) {
            console.error("Error fetching trip data:", error);
            toast.error('Failed to fetch trip details. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [tripId]);

    useEffect(() => {
        tripId && GetTripData();
    }, [tripId, GetTripData]);

    return (
        <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
            {loading ? <p>Loading trip details...</p> : trip ? <Information trip={trip} /> : <p>No trip data available.</p>}
            {loading ? <p>Loading Hotel details...</p> : trip ? <Hotels trip={trip} /> : <p>No trip data available.</p>}
            {loading ? <p> Loading Day Plan details...</p> : trip ? <Places trip={trip} /> : <p>No trip data available.</p>}
            <Footer />
        </div>
    );
}

export default Viewtrip;
