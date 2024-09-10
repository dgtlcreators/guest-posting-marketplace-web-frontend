// App.js
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useState } from 'react';
import { Html, useProgress } from '@react-three/drei';

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{ color: 'white' }}>{progress.toFixed(0)}% loading</div>
    </Html>
  );
}

function Model() {
  const gltf = useGLTF('/path-to-your-3d-model.glb');
  return <primitive object={gltf.scene} scale={0.5} />;
}

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div style={{ height: '100vh' }}>
      <Canvas>
        {/* Add camera and light */}
        <Suspense fallback={<Loader />}>
          <Model />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default App;
