// store/slices/locationSlice.js
import { createSlice } from '@reduxjs/toolkit';

interface LocationState {
    latitude: string | number;
    longitude: string | number;
}

const initialState: LocationState = {
    latitude: "",
    longitude: "",
};

const locationSlice = createSlice({
    name: 'location',
    initialState: initialState,
    reducers: {
        setLatitude: (state, action) => {
            state.latitude = action.payload;
        },
        setLongitude: (state, action) => {
            state.longitude = action.payload;
        }
    }
});

export const { 
    setLatitude, 
    setLongitude, 
} = locationSlice.actions;
export default locationSlice.reducer;