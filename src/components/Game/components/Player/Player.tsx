import * as THREE from "three";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { useFrame, Vector3 } from "@react-three/fiber";
import { usePlayerMovement } from "../hooks/usePlayerMovement.js";
import { SIZE_MAP } from "../../index.js";
import Flashlight from "./Flashlight.js";

const MOVE_SPEED = 20;
const direction: Vector3 = new THREE.Vector3();
const frontVector: Vector3 = new THREE.Vector3();
const sideVector: Vector3 = new THREE.Vector3();
const Player = () => {
    const playerRef = useRef<RapierRigidBody>(null);
    const boxPlayerRef = useRef<THREE.Mesh>(null);

    const { forward, backward, left, right } = usePlayerMovement();

    useFrame((state) => {
        if (!playerRef.current) return;
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
            <RigidBody position={[SIZE_MAP, SIZE_MAP, SIZE_MAP]} ref={playerRef} type="dynamic" name="rigidPlayer">
                <mesh ref={boxPlayerRef} rotation={[0, 0, Math.PI * 2]} name="player">
                    <capsuleGeometry args={[1, 1]} />
                    <meshStandardMaterial visible={true} />
                </mesh>
            </RigidBody>
        </>
    );
};

export default Player;
