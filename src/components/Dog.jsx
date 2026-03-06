import React from 'react'
import { useThree } from '@react-three/fiber'

const Dog = () => {
  const { camera, scene, gl } = useThree()
  
  console.log(camera)
  console.log(scene)
  console.log(gl)

  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#00ff00" />
    </mesh>
  )
}

export default Dog
