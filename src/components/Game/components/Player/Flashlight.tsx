import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { SpotLight, Vector3 } from "three";

const Flashlight = () => {
    const spotLightRef = useRef<SpotLight>(null);
    const { camera, pointer, raycaster, scene } = useThree();
    let lastPosition = new Vector3(0, 0, 0);

    useFrame(() => {
        if (!spotLightRef.current) return;

        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);
        let targetPosition = new Vector3();
        if (intersects.length > 0) {
            targetPosition = intersects[0].point;
            lastPosition = targetPosition;
        } else {
            targetPosition = lastPosition;
        }

        spotLightRef.current.position.copy(camera.position);

        spotLightRef.current.target.position.copy(targetPosition);
        spotLightRef.current.target.updateMatrixWorld();
    });

    return (
        <spotLight
            ref={spotLightRef}
            color="white"
            intensity={2}
            angle={0.6}
            penumbra={1}
            distance={100}
            decay={0.1}
            position={[-5, 2, 2]}
            castShadow
        />
    );
};

export default Flashlight;
