import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { AI_PROMPT, SelectBudgetList, SelectTravelsList } from '@/constants/options';
import { chatSession } from '@/service/AImodal';
import React, { useEffect } from 'react'
import { FcGoogle } from "react-icons/fc";
import { useState } from 'react'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import { toast, Toaster } from 'sonner';
import { doc, setDoc } from "firebase/firestore";
import { db } from '@/service/FirebaseConfig';
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router';


function CreateTrip() {
    const [place, setPlace] = useState();
    const [formdata, setFormdata] = useState();
    const [openDailog, setOpenDailog] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const handleInputChange = (name, value) => {
        if (name === 'days' && value > 10) {
            toast.error('Days should be less than 10')
            return;
        }
        setFormdata({ ...formdata, [name]: value })

    }

    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            console.log("Token Response:", tokenResponse);
            GetUserProfile(tokenResponse);
        },
        onError: (error) => console.error("OAuth Error:", error),
        flow: "implicit", // Use the implicit flow
    });


    useEffect(() => {
        console.log(formdata);
    }, [formdata])

    const onGenerateTrip = async () => {

        const user = localStorage.getItem('user');
        if (!user) {
            setOpenDailog(true);
            return;
        }
        if (!formdata?.location || !formdata?.days || !formdata?.budget || !formdata?.people) {
            toast.error('Please fill all the fields')
            return;

        }
        setLoading(true);
        const FINAL_PROMPT = AI_PROMPT.replace('{location}', formdata?.location.label).replace('{totalDays}', formdata?.days).replace('{traveler}', formdata?.people).replace('{budget}', formdata?.budget)
        console.log(FINAL_PROMPT);

        const result = await chatSession.sendMessage(FINAL_PROMPT);
        console.log(result?.response?.text());
        setLoading(false);
        SaveAiTrip_data(result?.response?.text());
    }

    const SaveAiTrip_data = async (TripData) => {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user'));
        const docId = Date.now().toString();
        await setDoc(doc(db, "AI_trip_planner", docId), {
            userSelection: formdata,
            Tripdata: JSON.parse(TripData),
            userEmail: user?.email,
            id: docId
        });
        setLoading(false);
        navigate(`/view-trip/${docId}`)


    }
    const GetUserProfile = (tokenInfo) => {
        axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
            {
                headers: {
                    Authorization: `Bearer ${tokenInfo?.access_token}`,
                    Accept: 'application/json',
                },
            }
        )
            .then((res) => {
                console.log("here")
                console.log(res.data);
                localStorage.setItem('user', JSON.stringify(res.data));
                setOpenDailog(false);
                onGenerateTrip()
            })
            .catch((err) => {
                console.error('Error fetching user profile:', err);
            });
    };

    return (
        <div className="px-5 sm:px-10 md:px-20 lg:px-32 xl:px-56 mt-10">
            <h2 className="font-bold text-2xl sm:text-3xl">
                Tell us your travel preferences🗺️🍹
            </h2>
            <p className="mt-3 text-gray-500 text-lg sm:text-xl">
                Provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
            </p>

            <div className="mt-20 flex flex-col gap-10">
                <div>
                    <h2 className="text-lg sm:text-xl mb-3 font-medium">
                        What is the destination of your choice?
                    </h2>
                    {/* <GooglePlacesAutocomplete
                        apiKey='AIzaSyADM-J88b8ssELJV8BAPG7sZc6Hrrxy1os'
                        selectProps={{
                            place,
                            onChange: (v) => { setPlace(v); console.log(v) }
                        }}
                    /> */}
                    <GooglePlacesAutocomplete
                        apiKey="AIzaSyADM-J88b8ssELJV8BAPG7sZc6Hrrxy1os"
                        selectProps={{
                            place,
                            onChange: (v) => { setPlace(v); handleInputChange('location', v) },
                            styles: {
                                control: (base) => ({
                                    ...base,
                                    height: '2.5rem',
                                    padding: '0.5rem',
                                    borderColor: '#e2e8f0',
                                    borderRadius: '0.375rem',
                                    boxShadow: 'none',
                                }),
                                input: (base) => ({
                                    ...base,
                                    color: '#1a202c',
                                }),
                            },
                        }}
                    />
                </div>

                <div>
                    <h2 className="text-lg sm:text-xl mb-3 font-medium">
                        How many days are you planning your trip?
                    </h2>
                    <Input
                        placeholder="Number of days (e.g., 3)"
                        type="number"
                        className="w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        onChange={(e) => handleInputChange('days', e.target.value)}
                    />
                </div>
            </div>
            <div>
                <h2 className='text-xl my-3 fonr-medium'>What is your Budget? </h2>
                <div className='grid grid-cols-3 gap-5 mt-5'>
                    {SelectBudgetList.map((item, index) => (
                        <div key={index}
                            onClick={() => handleInputChange('budget', item.title)}
                            className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer ${formdata?.budget === item.title && 'bg-blue-100'} `}>
                            <h2 className='text-4xl'>{item.icon}</h2>
                            <h2 className='font-bold text-lg'>{item.title}</h2>
                            <h2 className='text-sm text-gray-500'>{item.desc}</h2>

                        </div>))}
                </div>

            </div>

            <div>
                <h2 className='text-xl my-3 fonr-medium'>Who do you plan on travelling with on your next adventure? </h2>
                <div className='grid grid-cols-3 gap-5 mt-5'>
                    {SelectTravelsList.map((item, index) => (
                        <div key={index}
                            onClick={() => handleInputChange('people', item.people)}
                            className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer ${formdata?.people === item.people && 'bg-blue-100'} `}>
                            <h2 className='text-4xl'>{item.icon}</h2>
                            <h2 className='font-bold text-lg'>{item.title}</h2>
                            <h2 className='text-sm text-gray-500'>{item.desc}</h2>

                        </div>))}
                </div>
            </div>
            <div className='my-10 flex justify-end'>
                < Button disabled={loading} onClick={onGenerateTrip} >
                    {
                        loading ? <AiOutlineLoading3Quarters className='h-7 w-7 animate-spin' /> : "Generate Trip"
                    }

                </Button>
            </div>
            <Dialog open={openDailog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogDescription>
                            <img src="./logo.svg" />
                            <h2 className='font-bold text-lg mt-7'>Sign In With Google.</h2>
                            <p>Sign in to the App with Google Authentication</p>

                            <Button

                                onClick={login}
                                className="w-full mt-5 flex gap-4 items-center">

                                <FcGoogle className='h-8 w-8' />Sign in With Google



                            </Button>

                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>


        </div >
    );
}

export default CreateTrip;

