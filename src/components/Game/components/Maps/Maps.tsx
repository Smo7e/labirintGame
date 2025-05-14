import { RigidBody } from "@react-three/rapier";
import { SIZE_MAP } from "../..";
import React, { useEffect, useRef, useState } from "react";
import { Box3, DoubleSide, Mesh, RepeatWrapping, TextureLoader } from "three";
import { generateMaze } from "./generateMaze";
import { useLoader, useThree } from "@react-three/fiber";
import imageFloor from "./image/floor.jpg";
import imageWall from "./image/wall.jpg";
import imageCeiling from "./image/ceiling.jpg";
import imageWin from "./image/win.jpg";

const Maps: React.FC<{ winFunc: Function; difficulty: number }> = ({ winFunc, difficulty = 0 }) => {
    const COL = difficulty * 10;
    const ROW = COL;

    const boxRef = useRef<Mesh>(null);
    const { scene } = useThree();
    const generateMaze_ = generateMaze;
    let [wallArr, setWallArr] = useState<number[][]>([]);

    const textureFloor = useLoader(TextureLoader, imageFloor);
    const textureWall = useLoader(TextureLoader, imageWall);
    const textureCeiling = useLoader(TextureLoader, imageCeiling);
    const textureWin = useLoader(TextureLoader, imageWin);
    function checkMeshIntersection(mesh1: Mesh, mesh2: Mesh): boolean {
        const box1 = new Box3().setFromObject(mesh1);
        const box2 = new Box3().setFromObject(mesh2);

        return box1.intersectsBox(box2);
    }
    useEffect(() => {
        textureFloor.wrapS = RepeatWrapping;
        textureFloor.wrapT = RepeatWrapping;
        textureFloor.repeat.set(difficulty * 10, difficulty * 10);

        textureCeiling.wrapS = RepeatWrapping;
        textureCeiling.wrapT = RepeatWrapping;
        textureCeiling.repeat.set(difficulty * 15, difficulty * 15);

        textureWall.wrapS = RepeatWrapping;
        textureWall.wrapT = RepeatWrapping;
        textureWall.repeat.set(2, 2);
    }, [textureFloor, textureWall]);

    useEffect(() => {
        setWallArr(generateMaze_(COL, ROW, Math.random()));

        const meshWin = scene.children.filter((el) => {
            return el.name === "win";
        })[0] as Mesh;
        const meshPlayer = scene.children.filter((el) => {
            return el.name === "rigidPlayer";
        })[0].children[0] as Mesh;

        const interval = setInterval(() => {
            if (checkMeshIntersection(meshWin, meshPlayer)) {
                winFunc(ROW);
            }
        }, 500);

        return () => {
            clearInterval(interval);
        };
    }, []);
    useEffect(() => {
        function cheat(e: { code: string }) {
            if (e.code === "KeyM") {
                winFunc(ROW);
            }
        }
        window.addEventListener("keypress", cheat);
        return () => window.removeEventListener("keypress", cheat);
    }, []);

    return (
        <>
            <fogExp2 attach="fog" args={["#b0c4de", 0.08]} />
            <RigidBody
                lockTranslations
                lockRotations
                position={[(ROW / 2) * SIZE_MAP, SIZE_MAP * 0.5, (COL / 2) * SIZE_MAP]}
            >
                <mesh rotation-x={-Math.PI / 2}>
                    <planeGeometry args={[(ROW + 2) * SIZE_MAP, (COL + 5) * SIZE_MAP]} />
                    <meshStandardMaterial color="#302424" map={textureFloor} />
                </mesh>
            </RigidBody>
            <RigidBody
                lockTranslations
                lockRotations
                position={[(ROW / 2) * SIZE_MAP, SIZE_MAP * 1.5, (COL / 2) * SIZE_MAP]}
            >
                <mesh rotation-x={Math.PI / 2}>
                    <planeGeometry args={[(ROW + 2) * SIZE_MAP, (COL + 5) * SIZE_MAP]} />
                    <meshStandardMaterial side={DoubleSide} color={"#302424"} map={textureCeiling} />
                </mesh>
            </RigidBody>

            <mesh
                position={[SIZE_MAP * COL - SIZE_MAP * 2, SIZE_MAP, SIZE_MAP * ROW + SIZE_MAP * 2]}
                ref={boxRef}
                name="win"
            >
                <boxGeometry args={[SIZE_MAP, SIZE_MAP, SIZE_MAP]} />
                <meshStandardMaterial map={textureWin} color="#302424" />
            </mesh>

            {wallArr.map((row, rowIndex) => {
                return row.map((rowNum, rowNumIndex) => {
                    const key = `${rowIndex}-${rowNumIndex}-wall`;

                    return rowNum ? (
                        <RigidBody lockTranslations lockRotations key={key}>
                            <mesh position={[rowNumIndex * SIZE_MAP, SIZE_MAP, rowIndex * SIZE_MAP]}>
                                <boxGeometry args={[SIZE_MAP, SIZE_MAP, SIZE_MAP]} />
                                <meshStandardMaterial map={textureWall} color={"#302424"} />
                            </mesh>
                        </RigidBody>
                    ) : (
                        <React.Fragment key={key}></React.Fragment>
                    );
                });
            })}
        </>
    );
};
export default Maps;
