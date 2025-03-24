import * as THREE from "three";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { useFrame, Vector3 } from "@react-three/fiber";
import { usePlayerMovement } from "../hooks/usePlayerMovement.js";
import { SIZE_MAP } from "../../index.js";
import Flashlight from "./Flashlight.js";

const MOVE_SPEED = 200;
const direction: Vector3 = new THREE.Vector3();
const frontVector: Vector3 = new THREE.Vector3();
const sideVector: Vector3 = new THREE.Vector3();
const Player = () => {
    const playerRef = useRef<RapierRigidBody>(null);
    const boxRef = useRef<THREE.Mesh>(null);
    const boxPlayerRef = useRef<THREE.Mesh>(null);

    const { forward, backward, left, right } = usePlayerMovement();
    function checkMeshIntersection(mesh1: THREE.Mesh, mesh2: THREE.Mesh) {
        const box1 = new THREE.Box3().setFromObject(mesh1);
        const box2 = new THREE.Box3().setFromObject(mesh2);

        return box1.intersectsBox(box2); // Возвращает true, если боксы пересекаются
    }
    useFrame((state) => {
        if (!playerRef.current) return;
        if (!boxRef.current || !boxPlayerRef.current) return;
        console.log(checkMeshIntersection(boxRef.current, boxPlayerRef.current));
        const velocity = playerRef.current.linvel();

        frontVector.set(0, 0, +backward - +forward);
        sideVector.set(+left - +right, 0, 0);
        direction
            .subVectors(frontVector, sideVector)
            .normalize()
            .multiplyScalar(MOVE_SPEED)
            .applyEuler(state.camera.rotation);

        playerRef.current.wakeUp();
        playerRef.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, false);
        const { x, y, z } = playerRef.current.translation();
        state.camera.position.set(x, y, z);
    });
    return (
        <>
            <Flashlight />
            <RigidBody position={[SIZE_MAP, SIZE_MAP * 10, SIZE_MAP]} lockTranslations ref={playerRef}>
                <mesh ref={boxPlayerRef}>
                    <capsuleGeometry args={[1, 1]} />
                    <meshStandardMaterial />
                </mesh>
            </RigidBody>
            <mesh position={[SIZE_MAP, SIZE_MAP * 10, SIZE_MAP + 5]} ref={boxRef}>
                <boxGeometry />
                <meshStandardMaterial />
            </mesh>
        </>
    );
};

export default Player;
