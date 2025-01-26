import { useSelector } from 'react-redux';
import { RootState } from '@/reducers/store';

export const useUser = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    return user;
};