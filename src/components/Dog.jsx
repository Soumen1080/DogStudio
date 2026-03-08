import React from 'react'
import { OrbitControls, useGLTF, Environment } from '@react-three/drei'
import { useThree } from '@react-three/fiber'

const Dog = () => {
  const model = useGLTF('/models/dog.drc.glb')

  const { camera } = useThree()
  
  // Set camera to proper viewing distance
  React.useEffect(() => {
    camera.position.set(0, 1, 5 ) //  Position the camera slightly above and back from the model
    camera.lookAt(0, 0, 0) // work around the fact that the model is not centered at the origin  
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
      
      <primitive object={model.scene} position={[0, -0.5, 0.3]} />  { /*Adjust model position to sit on the ground plane*/}
      
      <OrbitControls 
        enablePan={true} // Allow panning the camera // WHAT is panning => panning is moving the camera left/right/up/down without changing its orientation
        enableZoom={true} // Allow zooming in/out
        enableRotate={true} // Allow rotating around the target
        minDistance={1}
        maxDistance={1}
      />
    </>
  )
}

export default Dog
