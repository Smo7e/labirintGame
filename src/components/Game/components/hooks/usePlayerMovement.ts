import { useEffect, useState } from "react";

interface IKeys {
    KeyA: string;
    KeyW: string;
    KeyD: string;
    KeyS: string;
}
interface IMovement {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
}

export const usePlayerMovement = () => {
    const keys: IKeys = {
        KeyW: "forward",
        KeyS: "backward",
        KeyA: "left",
        KeyD: "right",
    };

    const moveFieldByKey = (key: keyof IKeys): string => keys[key];

    const [movement, setMovement] = useState<IMovement>({
        forward: false,
        backward: false,
        left: false,
        right: false,
    });

    const setMovementStatus = (code: string, status: boolean): void => {
        setMovement((m) => ({ ...m, [code]: status }));
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent): void => {
            const move = moveFieldByKey(e.code as keyof IKeys);
            setMovementStatus(move, true);
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            const move = moveFieldByKey(e.code as keyof IKeys);
            setMovementStatus(move, false);
        };

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    return movement;
};
