import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { googleLogout } from '@react-oauth/google'
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

function Header() {
    const user = JSON.parse(localStorage.getItem('user'))
    const [openDailog, setOpenDailog] = useState(false);

    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            console.log("Token Response:", tokenResponse);
            GetUserProfile(tokenResponse);
        },
        onError: (error) => console.error("OAuth Error:", error),
        flow: "implicit", // Use the implicit flow
    });
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
                window.location.reload();
            })
            .catch((err) => {
                console.error('Error fetching user profile:', err);
            });
    };

    useEffect(() => {


    }
        , [])
    return (
        <div className='p-3 shadow-sm flex justify-between  items-center px-5'>
            <a href="/" >
                <img src="./logo.svg" />
            </a>
            <div>
                {user ?
                    <div className='flex items-center gap-3'>
                        <a href="/create-trip" >
                            <Button variant='outline' className="rounded-full">+ Create Trip</Button> </a>
                        <a href="/mytrip" >
                            <Button variant='outline' className="rounded-full">My trip</Button> </a>
                        <Popover>
                            <PopoverTrigger>  <img src={user?.picture} className='h-[35px] w-[35px] rounded-full' /></PopoverTrigger>
                            <PopoverContent><h2 className='cursor-pointer' onClick={() => {
                                googleLogout();
                                localStorage.clear();
                                window.location.reload();
                            }}>Logout</h2></PopoverContent>
                        </Popover>
                    </div> :

                    <Button onClick={() => setOpenDailog(true)}>Sign In</Button>
                }
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
        </div>
    )
}

export default Header
