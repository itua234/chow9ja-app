import { useState, useEffect } from 'react';

export const useResendTimer = (initialTime: number) => {
    const [timer, setTimer] = useState(initialTime);
    const [resendIsDisabled, setResendIsDisabled] = useState(true);

    useEffect(() => {
        const countdown = setInterval(() => {
        if (timer > 0) {
            setTimer((prevTimer) => prevTimer - 1);
        } else {
            clearInterval(countdown);
            setResendIsDisabled((resendIsDisabled) => !resendIsDisabled);
        }
        }, 1000);
        return () => clearInterval(countdown);
    }, [timer]);

    const resetTimer = () => {
        setTimer(initialTime);
        setResendIsDisabled(true);
    };
    // Convert remaining time to minutes and seconds
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    const formattedTime = `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;

    return {
        timer,
        resendIsDisabled,
        resetTimer,
        formattedTime
    };
};