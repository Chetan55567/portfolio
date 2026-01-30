import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Stars } from '@react-three/drei';
import Building from './Building';
import { motion, AnimatePresence } from 'framer-motion';

export default function Scene3D({ portfolioData, onSectionClick }) {
  const [cameraPosition, setCameraPosition] = useState([0, 2, 15]);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Zoom in animation after 2 seconds
    const timer = setTimeout(() => {
      setCameraPosition([0, 0, 10]);
      setShowIntro(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-screen relative">
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 pointer-events-none"
          >
            <div className="text-center text-white">
              <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-5xl font-bold mb-4"
              >
                {portfolioData?.personalInfo?.name || 'Welcome'}
              </motion.h1>
              <motion.p
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-2xl"
              >
                {portfolioData?.personalInfo?.title || 'Explore My Portfolio'}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera 
            makeDefault 
            position={cameraPosition}
            fov={75}
          />
          
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <spotLight 
            position={[0, 10, 5]} 
            angle={0.3} 
            penumbra={1} 
            intensity={1}
            castShadow
          />

          {/* Stars background */}
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

          {/* Environment lighting */}
          <Environment preset="night" />

          {/* Building with doors */}
          <Building 
            onDoorClick={onSectionClick}
            portfolioData={portfolioData}
          />

          {/* Camera controls */}
          <OrbitControls 
            enablePan={false}
            minDistance={5}
            maxDistance={20}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
