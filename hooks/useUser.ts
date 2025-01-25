import { useSelector } from 'react-redux';
import { RootState } from '@/reducers/auth/authStore';

export const useUser = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    return user;
};