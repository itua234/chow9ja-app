// store/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

// interface AuthState {
//     isAuthenticated: boolean;
//     isLoading: boolean;
//     user: any | null;
//     appIsReady: boolean
// }

// const initialState: AuthState = {
//     user: null,
//     isAuthenticated: false,
//     isLoading: true,
//     appIsReady: false
// };

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isAuthenticated: false,
        isLoading: true,
        appIsReady: false
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            //state.isAuthenticated = !!action.payload;
            state.isLoading = false;
        },
        setisAuthenticated: (state, action) => {
            state.isAuthenticated = !!action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
        }
    }
});

export const { setUser, setLoading, setisAuthenticated, logout } = authSlice.actions;
export default authSlice.reducer;