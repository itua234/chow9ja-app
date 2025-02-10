import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import formReducer from '@/reducers/form/formSlice';
import locationReducer from '@/reducers/location/locationSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        form: formReducer,
        location: locationReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;