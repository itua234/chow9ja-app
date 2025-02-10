import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Location from 'expo-location';

const useLocation = () => {
    const [msg, setMsg] = useState("");
    const [latitude, setLatitude] = useState<string | number>("");
    const [longitude, setLongitude] = useState<string | number>("");

    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if(status !== "granted"){
            setMsg("Permission to location was not granted");
            return;
        }
        let { coords } = await Location.getCurrentPositionAsync();
        if(coords){
            const { latitude, longitude } = coords;
            console.log("lat and long is", latitude, longitude);
            setLatitude(latitude);
            setLongitude(longitude);
            let response = await Location.reverseGeocodeAsync({
                latitude,
                longitude
            });
            console.log("USER LOCATION IS:", response);
        }
    }

    useEffect(() => {
        getLocation();
    }, []);

    return {latitude, longitude, msg};
}

export default useLocation;

