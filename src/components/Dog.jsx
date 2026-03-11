import React from 'react'
import { OrbitControls, useGLTF, Environment, useTexture } from '@react-three/drei'
import { Canvas , useThree  } from '@react-three/fiber'
import * as THREE from 'three'

const Dog = () => {
  const model = useGLTF('/models/dog.drc.glb')
  const { camera } = useThree()
  
  // Load textures
  const textures = useTexture({
    normalMap: '/models/dog_normals.jpg',
    sampleMatCap: '/matcap/mat-2.png',
  })
  
    textures.normalMap.flipY = false  // Flip Y for correct normal map orientation
    textures.sampleMatCap.colorSpace = THREE.SRGBColorSpace  // Ensure matcap texture is in sRGB color space for correct colors




  // Set camera to proper viewing distance
  React.useEffect(() => {
    camera.position.set(0, 2, 4)  // Good viewing distance: 4 units back, 2 units up
    camera.lookAt(0, 0, 0)        // Look at center where dog is positioned
  }, [camera])





  // Apply custom material with matcap to dog parts
  React.useEffect(() => {
    model.scene.traverse((child) => {
      if (child.isMesh && child.name.includes("DOG")) {
        child.material = new THREE.MeshMatcapMaterial({
          matcap: textures.sampleMatCap,  // Apply matcap for stylized shading and color
          normalMap: textures.normalMap,
          normalScale: new THREE.Vector2(1, 1),  // Adjust normal map intensity
        })
      }
    })
  }, [model, textures])
  





  return (
    <>

  {/* Ambient light for overall scene illumination */}
      <ambientLight intensity={1} />
      
      {/* Main directional light (sun) - softer intensity */}
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      
      
         



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
       
      />
    </>
  )
}

export default Dog
