import {
    GoogleSignin,
    isErrorWithCode,
    isSuccessResponse,
    statusCodes
} from '@react-native-google-signin/google-signin';
import { useDispatch } from 'react-redux';
import { setUser, setisAuthenticated } from '@/reducers/auth/authSlice';
import { google_login } from '@/api';
import { storeData } from '@/util/helper';
import { router } from 'expo-router';
import { AxiosResponse, AxiosError } from 'axios';
import { User } from "@/models/User";
interface LoginResponse {
    message: string;
    results: User;
    error: boolean;
}

export const useGoogleSignIn = (handleMessage: (message: string) => void) => {
    const dispatch = useDispatch();

    const handleGoogleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn();
            if (isSuccessResponse(response)) {
                try{
                    let payload = {
                        email: response.data.user.email,
                        firstname: response.data.user.familyName?.split(" ")[0] ||  null,
                        lastname: response.data.user.givenName,
                        photo: response.data.user.photo,
                        googleId: response.data.user.id,
                    }
                    await new Promise(resolve => setTimeout(resolve, 100)); // Create a delay
                    const res: AxiosResponse<LoginResponse> = await google_login(payload);
                    const user: User = res.data?.results;
                    // Store tokens and user data
                    await Promise.all([
                        storeData("user_token", user?.token),
                        storeData("refresh_token", user?.refresh_token),
                        storeData('isFirstTime', 'false')
                    ]);
                    // Dispatch the user and set authentication status
                    dispatch(setUser(user));
                    dispatch(setisAuthenticated(true));
                    // Navigate to the dashboard
                    router.replace('/dashboard');
                }catch(error: AxiosError<any> | any){
                    handleMessage('');
                    if (error.response) {
                        if (error.response.status === 400 || error.response.status === 401) {
                            handleMessage(error.response.data.message);
                        }
                    }
                }
            } else {
              // sign in was cancelled by user
            }
        } catch (error: any) {
            console.error("Sign-In Error", error);
            if (isErrorWithCode(error)) {
              switch (error.code) {
                case statusCodes.SIGN_IN_CANCELLED:
                    console.log("User cancelled the sign-in process")
                  // Android only, play services not available or outdated
                  break;
                case statusCodes.IN_PROGRESS:
                    console.log("Sign-in process is in progress");
                  // operation (eg. sign in) already in progress
                  break;
                case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                    console.log("Google Play services not available.")
                  // Android only, play services not available or outdated
                  break;
                default:
                    console.log('Unknown error:', error);
                // some other error happened
              }
            } else {
              // an error that's not related to google sign in occurred
            }
        }
    };

    return { handleGoogleSignIn };
};