import { useState, useEffect, useImperativeHandle, forwardRef } from "react";

export interface IGameStats {
    time: number;
}

const GameTimer = forwardRef((_, ref) => {
    const [startTime, setStartTime] = useState<Date>(new Date());
    const [elapsedTime, setElapsedTime] = useState<number>(0);

    const updateTime = () => {
        const currentTime = new Date();

        setElapsedTime(currentTime.getTime() - startTime.getTime());
    };

    useEffect(() => {
        const interval = setInterval(updateTime, 1000);
        return () => {
            clearInterval(interval);
        };
    }, [startTime]);

    // const formatTime = (timeInMs: number) => {
    //     const totalSeconds = Math.floor(timeInMs / 1000);
    //     const hours = Math.floor(totalSeconds / 3600);
    //     const minutes = Math.floor((totalSeconds % 3600) / 60);
    //     const seconds = totalSeconds % 60;

    //     return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
    //         .toString()
    //         .padStart(2, "0")}`;
    // };

    const getTime = (): number => {
        return elapsedTime / 1000;
    };
    const resetData = () => {
        setElapsedTime(0);
        setStartTime(new Date());
    };

    useImperativeHandle(ref, () => ({
        getTime,
        resetData,
    }));
    return (
        <div style={{ position: "fixed", color: "white", zIndex: 10 }} className="noselect">
            {/* <p>Time: {formatTime(elapsedTime)}</p> */}
        </div>
    );
});

export default GameTimer;
