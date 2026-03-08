import React from 'react'
import { OrbitControls, useGLTF, Environment } from '@react-three/drei'
import { useThree } from '@react-three/fiber'

const Dog = () => {
  const model = useGLTF('/models/dog.drc.glb')

  const { camera } = useThree()
  
  // Set camera to proper viewing distance
  React.useEffect(() => {
   
    camera.position.z = 0.5 // Move the camera back to ensure the model is fully visible
   
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
      
      <primitive object={model.scene} position={[0.25, -0.55, 0] }  rotation = {[0,Math.PI/3.9,0]} />  { /*Adjust model position to sit on the ground plane*/}
      

      <OrbitControls 
        
        
        enableRotate={true} // Allow rotating around the target
        
      />
    </>
  )
}

export default Dog
