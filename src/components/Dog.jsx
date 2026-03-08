import React from 'react'
import { OrbitControls, useGLTF, Environment, useTexture } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

const Dog = () => {
  const model = useGLTF('/models/dog.drc.glb')
  const { camera } = useThree()
  
  // Load textures
  const textures = useTexture({
    normalMap: '/models/dog_normal.png',
  })

  // Set camera to proper viewing distance
  React.useEffect(() => {
    camera.position.set(0, 2, 8)  // Good viewing distance: 8 units back, 2 units up
    camera.lookAt(0, 0, 0)        // Look at center where dog is positioned
  }, [camera])

  // Apply custom material with normal map to dog parts
  React.useEffect(() => {
    model.scene.traverse((child) => {
      if (child.isMesh && child.name.includes("DOG")) {
        child.material = new THREE.MeshStandardMaterial({
          normalMap: textures.normalMap,
          normalScale: new THREE.Vector2(1, 1),  // Adjust normal map intensity
        })
      }
    })
  }, [model, textures])
  
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
      
      {/* Dog model with position and rotation */}
      <primitive 
        object={model.scene} 
        position={[0.25, -0.55, 0]} 
        rotation={[0, Math.PI/3.9, 0]} 
      />

      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={15}
      />
    </>
  )
}

export default Dog
