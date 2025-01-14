export const SelectTravelsList = [
    {
        id: 1,
        title: 'Just Me',
        desc: 'A sole traveler in exploration',
        icon: '🧍',
        people: '1',
    },
    {
        id: 2,
        title: 'A Couple',
        desc: 'Two travelers in tandem',
        icon: '💑',
        people: '2 People',
    },
    {
        id: 3,
        title: 'Family',
        desc: 'A group of fun-loving adventurers',
        icon: '👨‍👩‍👧‍👦',
        people: '3 to 5 People',
    },
    {
        id: 4,
        title: 'Friends',
        desc: 'A bunch of thrill-seekers',
        icon: '✈️',
        people: '5 to 10 People',
    },
];

export const SelectBudgetList = [{
    id: 1,
    title: 'Budget',
    desc: 'Economical travel',
    icon: '💰',
},
{
    id: 2,
    title: 'Standard',
    desc: 'Moderate travel',
    icon: '💵',
},
{
    id: 3,
    title: 'Luxury',
    desc: 'Lavish travel',
    icon: '💎',
    budget: 'High',
},
];

export const AI_PROMPT = "Generate Travel Plan for Location: {location}, for {totalDays} Days for {traveler} with a {budget} budget, give me Hotels options list with HotelName, Hotel address, Price, hotel image URL, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, Time travel each of the location for {totalDays} days with each day plan with best time to visit in JSON format.";
