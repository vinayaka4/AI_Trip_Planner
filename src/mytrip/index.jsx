import { db } from '@/service/FirebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import UserTripCardItem from './components/UserTripCardItem';

function Mytrip() {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        GetUserTrips();
    }, []);

    const GetUserTrips = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));

            if (!user) {
                toast.error('Please login to view your trips');
                navigate('/');
                return;
            }

            const q = query(
                collection(db, 'AI_trip_planner'),
                where('userEmail', '==', user?.email)
            );
            const querySnapshot = await getDocs(q);

            const userTrips = [];
            querySnapshot.forEach((doc) => {
                userTrips.push({ id: doc.id, ...doc.data() });
            });

            setTrips(userTrips);
        } catch (error) {
            console.error('Error fetching user trips:', error);
            toast.error('Failed to fetch your trips. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="px-5 sm:px-10 md:px-20 lg:px-32 xl:px-56 mt-10">
            <h2 className="font-bold text-3xl mb-6">My Trips</h2>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                        <div
                            key={item}
                            className="bg-gray-200 animate-pulse shadow rounded-lg h-48"
                        ></div>
                    ))}
                </div>
            ) : trips?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {trips.map((trip) => (
                        <UserTripCardItem key={trip.id} trip={trip} />
                    ))}
                </div>
            ) : (
                <p className="text-gray-600 text-lg">You have no trips saved.</p>
            )}
        </div>
    );
}

export default Mytrip;
