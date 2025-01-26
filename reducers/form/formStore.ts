import { configureStore } from '@reduxjs/toolkit';
import formReducer from './formSlice';

const store = configureStore({
    reducer: {
        form: formReducer,
    },
});

export type FormState = ReturnType<typeof store.getState>;
export type FormDispatch = typeof store.dispatch;
export default store;