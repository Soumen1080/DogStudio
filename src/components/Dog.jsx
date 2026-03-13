import React , { useEffect } from 'react'
import { OrbitControls, useGLTF, Environment, useTexture , useAnimations} from '@react-three/drei'
import { Canvas , useThree  } from '@react-three/fiber'

import * as THREE from 'three'

const Dog = () => {
  const model = useGLTF('/models/dog.drc.glb')
  const { camera } = useThree()
  
const { actions } =  useAnimations(model.animations , model.scene)

  useEffect(() => {

  actions["Take 001"].play() // Play the animation named "Take 001"
}, [ actions ])  


      const [normalMap,sampleMatCap1 , ] = useTexture(['/models/dog_normals.jpg','/matcap/mat-2.png', ]).map((texture) => {
      texture.flipY = false  // Flip Y for correct normal map orientation
      texture.colorSpace = THREE.SRGBColorSpace  // Ensure textures are in sRGB color space for correct colors
      return texture
    })
   
    const [ branchesNormals ,branchesDiffuse ] = useTexture(['/branches_normals.jpeg' , '/branches_diffuse.jpeg']).map((texture) => {
         texture.flipY = true  // Flip Y for correct normal map orientation
      texture.colorSpace = THREE.SRGBColorSpace  // Ensure textures are in sRGB color space for correct colors
      return texture
    })
   

  // Set camera to proper viewing distance
  React.useEffect(() => {
    camera.position.set(1, 2, 4)  // Good viewing distance: 4 units back, 2 units up
    camera.lookAt(0, 0, 0)        // Look at center where dog is positioned
     
  }, [camera])


   const dogMaterial = new THREE.MeshMatcapMaterial({
    matcap: sampleMatCap1, // Use the loaded matcap texture
    normalMap: normalMap,
    flatShading: false, // Use smooth shading for better appearance
  })

  const branchesMaterial = new THREE.MeshStandardMaterial({
    map: branchesDiffuse, // Diffuse texture for color
    normalMap: branchesNormals, // Normal map for surface details
    roughness: 0.8, // Adjust roughness for less shininess
    metalness: 0.2, // Slight metallic effect for more realism
  })


  // Apply custom material with matcap to dog parts
  React.useEffect(() => {
    model.scene.traverse((child) => {
      if (child.isMesh && child.name.includes("DOG")) {
        child.material = dogMaterial
      }else{
        child.material = branchesMaterial
        }
    })
  }, [model, normalMap, sampleMatCap1 , branchesNormals , branchesDiffuse ]) // Re-apply material if textures change






  return (
    <>

  {/* Ambient light for overall scene illumination */}
      <ambientLight intensity={0.5} />
      
      {/* Main directional light (sun) - softer intensity */}
      <directionalLight position={[5, 5, 5]} intensity={0.5} castShadow />
      
      
         



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
