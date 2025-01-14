import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom'; // Ensure correct import for routing

function Hero() {
    return (
        <div className="flex flex-col items-center px-5 sm:px-10 md:px-20 lg:px-32 xl:px-56 gap-9 text-center mt-16">
            {/* Heading Section */}
            <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl text-gray-800 leading-tight">
                Discover Your Next Adventure With{' '}
                <span className="text-[#f56551]">AI</span>
            </h1>

            {/* Subheading Section */}
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mt-4 max-w-3xl">
                Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
            </p>

            {/* Call to Action Button */}
            <Link to="/create-trip">
                <Button className="mt-6 px-6 py-3 bg-[#f56551] text-white rounded-lg hover:bg-[#d55444] transition duration-300">
                    Get Started, It's Free
                </Button>
            </Link>

            {/* Hero Image */}
            <img
                src="./landing.webp"
                alt="Discover your next adventure"
                className="w-full max-w-4xl mt-8 rounded-lg shadow-lg object-cover"
            />
        </div>
    );
}

export default Hero;
