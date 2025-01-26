import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
    }
});

export type AuthState = ReturnType<typeof store.getState>;
export type AuthDispatch = typeof store.dispatch;
export default store;