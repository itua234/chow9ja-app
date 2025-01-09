import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
        console.log(key, value);
    } catch (e) {
        console.log(e);
    }
};

export const getData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        console.log(value);
        return value;
        /*if (value !== null) {
            // value previously stored
        }*/
    } catch (e) {
        console.log(e);
    }
};