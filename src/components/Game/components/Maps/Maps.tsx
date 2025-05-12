import { RigidBody } from "@react-three/rapier";
import { SIZE_MAP } from "../..";
import React, { useEffect, useRef, useState } from "react";
import { Box3, DoubleSide, Mesh } from "three";
import { generateMaze } from "./generateMaze";
import { useThree } from "@react-three/fiber";

const COL = 10;
const ROW = COL;
const Maps: React.FC<{ winFunc: Function }> = ({ winFunc }) => {
    const boxRef = useRef<Mesh>(null);
    let [wallArr, setWallArr] = useState<number[][]>([]);
    const { scene } = useThree();
    const generateMaze_ = generateMaze;

    function checkMeshIntersection(mesh1: Mesh, mesh2: Mesh): boolean {
        const box1 = new Box3().setFromObject(mesh1);
        const box2 = new Box3().setFromObject(mesh2);

        return box1.intersectsBox(box2);
    }

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
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <>
            <fogExp2 attach="fog" args={["#808080", 0.08]} />
            <RigidBody
                lockTranslations
                lockRotations
                position={[(ROW / 2) * SIZE_MAP, SIZE_MAP * 0.5, (COL / 2) * SIZE_MAP]}
            >
                <mesh rotation-x={-Math.PI / 2}>
                    <planeGeometry args={[(ROW + 2) * SIZE_MAP, (COL + 5) * SIZE_MAP]} />
                    <meshStandardMaterial color="gray" />
                </mesh>
            </RigidBody>
            <RigidBody
                lockTranslations
                lockRotations
                position={[(ROW / 2) * SIZE_MAP, SIZE_MAP * 1.5, (COL / 2) * SIZE_MAP]}
            >
                <mesh rotation-x={-Math.PI / 2}>
                    <planeGeometry args={[(ROW + 2) * SIZE_MAP, (COL + 5) * SIZE_MAP]} />
                    <meshStandardMaterial color="gray" side={DoubleSide} />
                </mesh>
            </RigidBody>

            <mesh
                position={[SIZE_MAP * COL - SIZE_MAP * 2, SIZE_MAP, SIZE_MAP * ROW + SIZE_MAP * 2]}
                ref={boxRef}
                name="win"
            >
                <boxGeometry args={[SIZE_MAP, SIZE_MAP, SIZE_MAP]} />
                <meshStandardMaterial />
            </mesh>

            {wallArr.map((row, rowIndex) => {
                return row.map((rowNum, rowNumIndex) => {
                    const key = `${rowIndex}-${rowNumIndex}-wall`;

                    return rowNum ? (
                        <RigidBody lockTranslations lockRotations key={key}>
                            <mesh position={[rowNumIndex * SIZE_MAP, SIZE_MAP, rowIndex * SIZE_MAP]}>
                                <boxGeometry args={[SIZE_MAP, SIZE_MAP, SIZE_MAP]} />
                                <meshStandardMaterial color="red" />
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
