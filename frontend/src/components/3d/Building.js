import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import Door from './Door';
import * as THREE from 'three';

export default function Building({ onDoorClick, portfolioData }) {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      // Subtle rotation animation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  // Only show doors for sections with data
  const sections = [
    { key: 'skills', label: 'Skills', position: [-3, 0, 0], color: '#4a90e2' },
    { key: 'experience', label: 'Experience', position: [0, 0, 0], color: '#e24a4a' },
    { key: 'projects', label: 'Projects', position: [3, 0, 0], color: '#4ae24a' },
    { key: 'education', label: 'Education', position: [-1.5, -3, 0], color: '#e2a44a' },
    { key: 'contact', label: 'Contact', position: [1.5, -3, 0], color: '#a44ae2' },
  ];

  return (
    <group ref={groupRef}>
      {/* Building base/floor */}
      <mesh position={[0, -4, -1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[15, 10]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
      </mesh>

      {/* Building walls */}
      <mesh position={[0, 0, -2]}>
        <boxGeometry args={[10, 8, 0.5]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
      </mesh>

      {/* Render doors for sections that have data */}
      {sections.map((section) => {
        const hasData = portfolioData && portfolioData[section.key] && 
          (Array.isArray(portfolioData[section.key]) ? portfolioData[section.key].length > 0 : 
           Object.keys(portfolioData[section.key]).length > 0);
        
        if (hasData) {
          return (
            <Door
              key={section.key}
              position={section.position}
              label={section.label}
              color={section.color}
              onClick={() => onDoorClick(section.key)}
            />
          );
        }
        return null;
      })}
    </group>
  );
}
