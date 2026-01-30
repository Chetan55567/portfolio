import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

export default function Door({ position, label, onClick, color = "#8b4513" }) {
  const meshRef = useRef();
  const [hovered, setHovered] = React.useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.x = THREE.MathUtils.lerp(
        meshRef.current.scale.x,
        hovered ? 1.1 : 1,
        0.1
      );
      meshRef.current.scale.y = THREE.MathUtils.lerp(
        meshRef.current.scale.y,
        hovered ? 1.1 : 1,
        0.1
      );
    }
  });

  return (
    <group position={position}>
      <RoundedBox
        ref={meshRef}
        args={[1.5, 2.5, 0.2]}
        radius={0.05}
        smoothness={4}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={hovered ? "#a0522d" : color} 
          roughness={0.7}
          metalness={0.1}
        />
      </RoundedBox>
      
      <Text
        position={[0, 0, 0.15]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
      
      {/* Door handle */}
      <mesh position={[0.5, 0, 0.15]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="gold" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}
