import React from 'react'
import { OrbitControls, useGLTF, Environment } from '@react-three/drei'
import { useThree } from '@react-three/fiber'

const Dog = () => {
  const model = useGLTF('/models/dog.drc.glb')

  const { camera } = useThree()
  
  // Set camera to proper viewing distance
  React.useEffect(() => {
    camera.position.set(0, 1, 5)
    camera.lookAt(0, 0, 0)
  }, [camera])
  
  return (
    <>
      {/* Ambient light for overall scene illumination */}
      <ambientLight intensity={0.5} />
      
      {/* Main directional light (sun) - softer intensity */}
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      
      {/* Fill light to reduce harsh shadows */}
      <directionalLight position={[-3, 2, -3]} intensity={0.3} />
      
      {/* Environment for realistic PBR material reflection */}
      <Environment preset="sunset" />
      
      <primitive object={model.scene} position={[0, 0, 0]} />
      
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={10}
      />
    </>
  )
}

export default Dog
