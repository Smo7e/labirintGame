import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import Maps from "./components/Maps/Maps";
import Player from "./components/Player/Player";
import { PointerLockControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import Win from "./components/Win/Win";
import GameTimer from "./components/GameTime/GameTimer";

export interface IResaultParam {
    time: string;
    countRow: number;
}
const Game: React.FC = () => {
    const gameTimerRef = useRef<any>(null);
    const [isWin, setIsWin] = useState<boolean>(false);
    const [resultParam, setResultParam] = useState<IResaultParam>({
        time: "",
        countRow: 0,
    });

    const winFunc = (countRow: number): void => {
        console.log({
            countRow,
            time: getTime(),
        });
        setResultParam({
            countRow,
            time: getTime(),
        });
        setIsWin(true);
    };
    const getTime = () => {
        if (gameTimerRef.current) {
            return gameTimerRef.current.getTime();
        }
        return 0;
    };
    useEffect(() => {
        const timeInterval = setInterval(() => {
            console.log(getTime());
        }, 1000);
        return () => {
            clearInterval(timeInterval);
        };
    }, []);
    return (
        <>
            {isWin ? (
                <Win resultParam={resultParam} />
            ) : (
                <>
                    <GameTimer ref={gameTimerRef} />
                    <Canvas
                        color="black"
                        style={{ backgroundColor: "black" }}
                        camera={{
                            near: 0.1,
                            far: 1000,
                            rotation: [0, Math.PI, 0],
                        }}
                    >
                        <PointerLockControls />
                        <ambientLight intensity={2} position={[0, 0, 5]} />
                        <Physics gravity={[0, -5, 0]}>
                            <Maps winFunc={winFunc} />
                            <Player />
                        </Physics>
                    </Canvas>
                </>
            )}
        </>
    );
};
export default Game;
