import React from 'react'
import { useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

const Dog = () => {
  const { camera, scene, gl } = useThree()
  
  console.log(camera)
  console.log(scene)
  console.log(gl)

  return (

<>

    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#00ff00" />
    </mesh>
{/* orbit controls allow us to move around the scene with our mouse, we can zoom in and out and rotate around the scene */}
    <OrbitControls />

    </>
  )
}

export default Dog
