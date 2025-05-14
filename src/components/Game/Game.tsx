import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import Maps from "./components/Maps/Maps";
import Player from "./components/Player/Player";
import { PointerLockControls } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import Win from "./components/Win/Win";
import GameTimer from "./components/GameTime/GameTimer";
import { useLocation } from "react-router-dom";
import MusicPlayer from "./components/MusicPlayer/MusicPlayer";
import { EffectComposer, RenderPass, ShaderPass } from "three/examples/jsm/Addons.js";

export interface IResaultParam {
    time: string;
    countRow: number;
    difficulty: number;
}

// Определяем шейдер для размытия
const BlurShader = {
    uniforms: {
        tDiffuse: { value: null },
        blurSize: { value: 1.0 }, // Настраиваемый параметр размытия
    },
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,
    fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float blurSize;
    varying vec2 vUv;

    void main() {
      vec2 blurOffset = vec2(blurSize / 1000.0);  // Нормализуем размер размытия

      vec4 sum = vec4(0.0);
      sum += texture2D(tDiffuse, vec2(vUv.x - 4.0 * blurOffset.x, vUv.y)) * 0.051;
      sum += texture2D(tDiffuse, vec2(vUv.x - 3.0 * blurOffset.x, vUv.y)) * 0.0918;
      sum += texture2D(tDiffuse, vec2(vUv.x - 2.0 * blurOffset.x, vUv.y)) * 0.12245;
      sum += texture2D(tDiffuse, vec2(vUv.x - blurOffset.x, vUv.y)) * 0.1531;
      sum += texture2D(tDiffuse, vUv) * 0.1633;
      sum += texture2D(tDiffuse, vec2(vUv.x + blurOffset.x, vUv.y)) * 0.1531;
      sum += texture2D(tDiffuse, vec2(vUv.x + 2.0 * blurOffset.x, vUv.y)) * 0.12245;
      sum += texture2D(tDiffuse, vec2(vUv.x + 3.0 * blurOffset.x, vUv.y)) * 0.0918;
      sum += texture2D(tDiffuse, vec2(vUv.x + 4.0 * blurOffset.x, vUv.y)) * 0.051;

      gl_FragColor = sum;
    }
  `,
};

const PostProcessing = () => {
    const { gl, scene, camera } = useThree();
    const composer = useRef<EffectComposer>(null);

    useEffect(() => {
        composer.current = new EffectComposer(gl);

        const renderPass = new RenderPass(scene, camera);
        composer.current.addPass(renderPass);

        const blurPass = new ShaderPass(BlurShader);
        blurPass.uniforms["blurSize"].value = 1.0;
        composer.current.addPass(blurPass);
        blurPass.renderToScreen = true;

        return () => {
            if (composer.current) {
                composer.current.dispose();
            }
        };
    }, [gl, scene, camera]);

    useFrame(() => {
        if (composer.current) {
            composer.current.render();
        }
    }, 1);

    return null;
};

const Game: React.FC = () => {
    const gameTimerRef = useRef<any>(null);
    const difficulty = useLocation().state;
    const [isWin, setIsWin] = useState<boolean>(false);
    const [resultParam, setResultParam] = useState<IResaultParam>({
        time: "",
        countRow: 0,
        difficulty: difficulty,
    });

    const winFunc = (countRow: number): void => {
        setResultParam({
            countRow,
            time: getTime(),
            difficulty: difficulty,
        });
        setIsWin(true);
    };
    const getTime = () => {
        if (gameTimerRef.current) {
            return gameTimerRef.current.getTime();
        }
        return 0;
    };

    return (
        <>
            {isWin ? (
                <Win resultParam={resultParam} />
            ) : (
                <>
                    <GameTimer ref={gameTimerRef} />
                    <MusicPlayer />
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
                            <Maps winFunc={winFunc} difficulty={difficulty} />
                            <Player />
                        </Physics>
                        <PostProcessing />
                    </Canvas>
                </>
            )}
        </>
    );
};
export default Game;
