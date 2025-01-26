import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import formReducer from '@/reducers/form/formSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        form: formReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

// import { configureStore } from '@reduxjs/toolkit';
// import formReducer from './formSlice';

// const store = configureStore({
//     reducer: {
//         form: formReducer,
//     },
// });

// export type FormState = ReturnType<typeof store.getState>;
// export type FormDispatch = typeof store.dispatch;
// export default store;