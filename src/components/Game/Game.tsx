import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import Maps from "./components/Maps/Maps";
import Player from "./components/Player/Player.tsx/Player";
import { PointerLockControls } from "@react-three/drei";

const Game: React.FC = () => {
    return (
        <>
            <Canvas
                color="black"
                style={{ backgroundColor: "black" }}
                camera={{
                    near: 0.1,
                    far: 1000,
                }}
            >
                <PointerLockControls />
                <ambientLight intensity={2} position={[0, 0, 5]} />
                <Physics gravity={[0, -5, 0]}>
                    <Maps />
                    <Player />
                </Physics>
            </Canvas>
        </>
    );
};
export default Game;
