import axios from 'axios';

const BASE_URL = "https://places.googleapis.com/v1/places:searchText"

const config = {
    headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': 'AIzaSyABHX-5NilFxu1IK91X_-sJOhhbROR8c94',
        'X-Goog-FieldMask': 'places.photos,places.displayName,places.id'
    }
}


export const GetPlaceDetails = (data) => {
    const requestBody = {
        textQuery: data.textQuery,
        languageCode: "en"
    };
    return axios.post(BASE_URL, requestBody, config);
}


export const PHOTO_REF_URL = 'https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&&maxWidthPx=1000&key=AIzaSyABHX-5NilFxu1IK91X_-sJOhhbROR8c94'
