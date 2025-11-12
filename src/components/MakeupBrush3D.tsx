import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Cylinder, Sphere } from "@react-three/drei";
import * as THREE from "three";

const MakeupBrush3D = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Brush handle */}
      <Cylinder args={[0.05, 0.05, 2, 32]} position={[0, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
        <meshStandardMaterial color="#E599B2" metalness={0.8} roughness={0.2} />
      </Cylinder>
      
      {/* Brush bristles */}
      <Sphere args={[0.3, 32, 32]} position={[0.8, 0.8, 0]}>
        <meshStandardMaterial color="#F4C67C" metalness={0.3} roughness={0.7} />
      </Sphere>

      {/* Decorative spheres */}
      <Sphere args={[0.15, 32, 32]} position={[-1, -0.5, 0.5]}>
        <meshStandardMaterial color="#E68AAE" metalness={0.9} roughness={0.1} emissive="#E68AAE" emissiveIntensity={0.3} />
      </Sphere>
      
      <Sphere args={[0.1, 32, 32]} position={[0.5, -1, -0.3]}>
        <meshStandardMaterial color="#F4C67C" metalness={0.9} roughness={0.1} emissive="#F4C67C" emissiveIntensity={0.3} />
      </Sphere>
    </group>
  );
};

export default MakeupBrush3D;
