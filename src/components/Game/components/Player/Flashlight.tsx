import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { SpotLight, Vector3 } from "three";

const Flashlight = () => {
    const spotLightRef = useRef<SpotLight>(null);
    const { camera, pointer, raycaster, scene } = useThree();
    const lastPosition = useRef(new Vector3());
    const lightPosition = useRef(new Vector3());
    const lightTargetPosition = useRef(new Vector3());
    const lerpFactor = 0.1;

    useFrame(() => {
        if (!spotLightRef.current) return;

        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);
        let targetPosition = new Vector3();

        if (intersects.length > 0) {
            targetPosition.copy(intersects[0].point);
            lastPosition.current.copy(targetPosition);
        } else {
            targetPosition.copy(lastPosition.current);
        }

        lightPosition.current.copy(camera.position);
        spotLightRef.current.position.lerp(lightPosition.current, lerpFactor);

        lightTargetPosition.current.copy(targetPosition);
        spotLightRef.current.target.position.lerp(lightTargetPosition.current, lerpFactor);

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
