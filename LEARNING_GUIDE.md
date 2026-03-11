# DogStudio - Complete Learning Guide

## 📚 Table of Contents
1. [Project Overview](#project-overview)
2. [Technologies & Libraries](#technologies--libraries)
3. [Components Used](#components-used)
4. [Hooks & Functions](#hooks--functions)
5. [Data Types & Props](#data-types--props)
6. [3D Concepts](#3d-concepts)
7. [Advanced Techniques](#advanced-techniques)
8. [Step-by-Step Learning Roadmap](#step-by-step-learning-roadmap)

---

## 🎯 Project Overview

**DogStudio** is a 3D web application that renders and displays a 3D dog model in an interactive scene using React and Three.js.

**Tech Stack:**
- React 19.2.0
- Three.js 0.183.2
- @react-three/fiber (React renderer for Three.js)
- @react-three/drei (Helper components)
- Vite (Build tool)

---

## 📦 Technologies & Libraries

### 1. **React**
- **What it is:** JavaScript library for building user interfaces
- **Purpose:** Manages component state, lifecycle, and rendering
- **Version:** 19.2.0

### 2. **Three.js**
- **What it is:** JavaScript 3D library for WebGL
- **Purpose:** Creates and displays 3D graphics in the browser
- **Version:** 0.183.2

### 3. **@react-three/fiber**
- **What it is:** React renderer for Three.js
- **Purpose:** Allows you to write Three.js code using React components
- **Version:** 9.5.0

### 4. **@react-three/drei**
- **What it is:** Helper library with useful components for R3F
- **Purpose:** Provides pre-built components like OrbitControls, Environment, etc.
- **Version:** 10.7.7

### 5. **Vite**
- **What it is:** Fast build tool and development server
- **Purpose:** Bundle and serve the application
- **Version:** 7.3.1

---

## 🧩 Components Used

### **1. App Component** (`src/App.jsx`)

```javascript
function App() {
  return (
    <>
      <Canvas style={{ width: '100vw', height: '100vh' }}>
        <Dog />
      </Canvas>
    </>
  )
}
```

**What it does:**
- Root component of the application
- Renders the Canvas component which creates the 3D scene
- Contains the Dog component inside the Canvas

**Elements:**
- `<>...</>` - React Fragment (wrapper without DOM node)
- `<Canvas>` - Creates WebGL context and Three.js scene
- `<Dog />` - Custom component that renders the 3D dog

---

### **2. Canvas Component** (from `@react-three/fiber`)

```javascript
<Canvas style={{ width: '100vw', height: '100vh' }}>
```

**What it does:**
- Creates a WebGL canvas element
- Sets up Three.js Scene, Camera, and Renderer automatically
- Manages the render loop (60 FPS animation)

**Props Used:**
- `style` (Object) - CSS styling for the canvas
  - `width: '100vw'` - Full viewport width
  - `height: '100vh'` - Full viewport height

**Data Type:** JSX Component
**Default Camera:** Perspective camera at position [0, 0, 5]

---

### **3. Dog Component** (`src/components/Dog.jsx`)

**Purpose:** Renders the 3D dog model with lighting and controls

**Component Structure:**
```javascript
const Dog = () => {
  const model = useGLTF('/models/dog.drc.glb')
  const { camera } = useThree()
  
  React.useEffect(() => {
    camera.position.set(0, 1, 5)
    camera.lookAt(0, 0, 0)
  }, [camera])
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <directionalLight position={[-3, 2, -3]} intensity={0.3} />
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
```

---

### **4. primitive Component** (from `@react-three/fiber`)

```javascript
<primitive object={model.scene} position={[0, 0, 0]} />
```

**What it does:**
- Adds existing Three.js objects to the React scene
- Used when you have a pre-built Three.js object (like loaded models)

**Props:**
- `object` (THREE.Object3D) - The Three.js object to render
- `position` (Array[3]) - [x, y, z] coordinates in 3D space
  - Data type: `[number, number, number]`
  - Example: `[0, 0, 0]` is the center

**When to use:** For loaded GLTF models, existing Three.js objects

---

### **5. ambientLight Component**

```javascript
<ambientLight intensity={0.5} />
```

**What it does:**
- Provides uniform lighting from all directions
- Illuminates all objects equally (no shadows)
- Prevents completely black shadows

**Props:**
- `intensity` (Number) - Brightness level (0 to infinity)
  - `0.5` = 50% brightness
  - Default: 1

**Use Case:** Base lighting to ensure nothing is pitch black

---

### **6. directionalLight Component**

```javascript
<directionalLight position={[5, 5, 5]} intensity={1} castShadow />
```

**What it does:**
- Simulates sunlight (parallel rays)
- Casts light in one direction from a position
- Can cast shadows on objects

**Props:**
- `position` (Array[3]) - Where the light is located [x, y, z]
- `intensity` (Number) - Brightness (0 to infinity)
- `castShadow` (Boolean) - Enable shadow casting

**Light Direction:** From position toward origin (0, 0, 0)

**Multiple Lights in Project:**
1. Main light: `[5, 5, 5]` intensity 1 - Primary illumination
2. Fill light: `[-3, 2, -3]` intensity 0.3 - Softens shadows

---

### **7. Environment Component** (from `@react-three/drei`)

```javascript
<Environment preset="sunset" />
```

**What it does:**
- Provides realistic environment lighting and reflections
- Uses HDR images for lighting (Image-Based Lighting)
- Makes materials look realistic with reflections

**Props:**
- `preset` (String) - Pre-made environment name
  - Options: "sunset", "dawn", "night", "city", "studio", "forest", "park", "apartment", "warehouse"

**Why it matters:** PBR (Physically Based Rendering) materials need environment reflections to look realistic

---

### **8. OrbitControls Component** (from `@react-three/drei`)

```javascript
<OrbitControls 
  enablePan={true}
  enableZoom={true}
  enableRotate={true}
  minDistance={2}
  maxDistance={10}
/>
```

**What it does:**
- Allows user to control camera with mouse/touch
- Rotate: Left-click + drag
- Zoom: Scroll wheel
- Pan: Right-click + drag

**Props:**
- `enablePan` (Boolean) - Allow moving camera position
- `enableZoom` (Boolean) - Allow zooming in/out
- `enableRotate` (Boolean) - Allow rotating around target
- `minDistance` (Number) - Closest zoom distance
- `maxDistance` (Number) - Farthest zoom distance

**Data Types:** All boolean except distances (numbers)

---

## 🎣 Hooks & Functions

### **1. useGLTF Hook** (from `@react-three/drei`)

```javascript
const model = useGLTF('/models/dog.drc.glb')
```

**What it does:**
- Loads 3D models in GLTF/GLB format
- Caches the model (loads once, reuses)
- Returns the loaded model object

**Parameter:**
- Path (String) - File path to the .glb/.gltf file

**Returns:**
- Object with properties:
  - `scene` (THREE.Group) - The 3D model
  - `animations` (Array) - Animation clips
  - `cameras` (Array) - Cameras in the model
  - `materials` (Object) - Materials used

**Usage:** Access the model with `model.scene`

---

### **2. useThree Hook** (from `@react-three/fiber`)

```javascript
const { camera } = useThree()
```

**What it does:**
- Access the Three.js renderer state
- Get camera, scene, renderer, etc.

**Returns Object with:**
- `camera` (THREE.Camera) - The scene camera
- `scene` (THREE.Scene) - The Three.js scene
- `gl` (THREE.WebGLRenderer) - The WebGL renderer
- `size` (Object) - Canvas dimensions {width, height}
- `viewport` (Object) - Viewport dimensions in 3D units

**Common Use Cases:**
- Modify camera position/settings
- Access renderer for post-processing
- Get screen dimensions for responsive design

---

### **3. React.useEffect Hook**

```javascript
React.useEffect(() => {
  camera.position.set(0, 1, 5)
  camera.lookAt(0, 0, 0)
}, [camera])
```

**What it does:**
- Runs side effects after component renders
- Runs when dependencies change

**Parameters:**
1. Effect function (Function) - Code to run
2. Dependency array (Array) - When to re-run
   - `[camera]` - Run when camera changes
   - `[]` - Run once on mount
   - No array - Run on every render

**Use in Project:**
- Set camera position to `(0, 1, 5)` - Proper viewing distance
- Make camera look at origin `(0, 0, 0)` - Center the view

---

### **4. camera.position.set()**

```javascript
camera.position.set(0, 1, 5)
```

**What it does:**
- Sets the 3D position of the camera

**Parameters:**
- `x` (Number) - Left (-) / Right (+)
- `y` (Number) - Down (-) / Up (+)
- `z` (Number) - Back (-) / Forward (+)

**Coordinate System:**
- `(0, 0, 0)` - World origin (center)
- `(0, 1, 5)` - Slightly above and 5 units away

---

### **5. camera.lookAt()**

```javascript
camera.lookAt(0, 0, 0)
```

**What it does:**
- Points the camera at a specific position
- Updates camera rotation automatically

**Parameter:**
- Target position (x, y, z)
- `(0, 0, 0)` - Look at world center

---

## 📊 Data Types & Props

### **Position Array**
```javascript
position={[0, 0, 0]}
```
- **Type:** `Array[number, number, number]`
- **Format:** `[x, y, z]`
- **Values:** Numbers (can be negative)

### **Intensity**
```javascript
intensity={0.5}
```
- **Type:** `Number`
- **Range:** 0 to Infinity
- **Common:** 0.1 to 10

### **Boolean Props**
```javascript
enablePan={true}
castShadow={true}
```
- **Type:** `Boolean`
- **Values:** `true` or `false`

### **String Props**
```javascript
preset="sunset"
```
- **Type:** `String`
- **Format:** Text in quotes

### **Object/Model Data**
```javascript
object={model.scene}
```
- **Type:** `THREE.Object3D` | `THREE.Group`
- **Source:** Loaded from GLTF file

---

## 🎨 3D Concepts

### **1. 3D Coordinate System**

```
        Y (Up)
        |
        |
        |_______ X (Right)
       /
      /
     Z (Forward)
```

- **X-axis:** Left (negative) to Right (positive)
- **Y-axis:** Down (negative) to Up (positive)  
- **Z-axis:** Back (negative) to Forward (positive)

### **2. Camera**

**Types:**
- **PerspectiveCamera** (default) - Realistic view with depth
- **OrthographicCamera** - No perspective (2D-like)

**Camera Position:** Where the camera is in 3D space
**Camera Target:** What the camera is looking at

### **3. Lighting Types**

| Type | Behavior | Shadows | Use Case |
|------|----------|---------|----------|
| **Ambient** | Uniform everywhere | No | Base lighting |
| **Directional** | Parallel rays (sun) | Yes | Main light source |
| **Point** | Radiates from point | Yes | Lamps, bulbs |
| **Spot** | Cone of light | Yes | Flashlight effect |
| **Hemisphere** | Sky + ground colors | No | Outdoor scenes |

### **4. PBR Materials**

**Physically Based Rendering** - Realistic material system

**Requires:**
- Proper lighting (ambient + directional)
- Environment maps (for reflections)
- Correct material properties (metalness, roughness)

**Benefits:**
- Realistic appearance
- Consistent in all lighting conditions

### **5. Scene Graph**

```
Scene
├── Camera
├── Lights
│   ├── ambientLight
│   ├── directionalLight (main)
│   └── directionalLight (fill)
├── Environment
├── Dog Model (primitive)
│   ├── Mesh (geometry + material)
│   ├── Bones (skeleton)
│   └── Animations
└── Controls (OrbitControls)
```

---

## � Advanced Techniques

### **1. useTexture Hook** (from `@react-three/drei`)

```javascript
const textures = useTexture({
  normalMap: '/models/dog_normal.png',
})
```

**What it does:**
- Loads image files as Three.js textures
- Caches textures for performance
- Can load multiple textures at once
- Automatically handles texture loading state

**Parameters:**
- Single path: `useTexture('/image.png')`
- Multiple paths: `useTexture({ map: '/a.png', normalMap: '/b.png' })`
- Array: `useTexture(['/1.png', '/2.png'])`

**Returns:**
- Single texture: `THREE.Texture` object
- Multiple textures: Object with named textures
- Array: Array of texture objects

**Common Texture Types:**
```javascript
const textures = useTexture({
  map: '/color.png',              // Base color (albedo)
  normalMap: '/normal.png',       // Surface detail without geometry
  roughnessMap: '/roughness.png', // Surface roughness
  metalnessMap: '/metalness.png', // Metallic vs non-metallic
  aoMap: '/ao.png',               // Ambient occlusion (shadows in crevices)
  displacementMap: '/height.png', // Actual geometry displacement
})
```

---

### **2. Normal Maps**

**What is a Normal Map?**
- Special texture that simulates surface details
- Creates illusion of bumps and grooves WITHOUT adding geometry
- Uses RGB colors to encode surface direction
- **Huge performance benefit** - looks detailed but low polygon count

**Visual Comparison:**
```
Without Normal Map:        With Normal Map:
   Smooth surface             Detailed bumpy surface
   500 polygons              500 polygons (same!)
   Flat lighting              Rich lighting details
```

**How to Use:**
```javascript
material.normalMap = texture
material.normalScale = new THREE.Vector2(1, 1)  // Intensity control
```

**normalScale Values:**
- `(1, 1)` - Normal strength
- `(2, 2)` - 2x stronger effect (more pronounced bumps)
- `(0.5, 0.5)` - 50% weaker (subtle detail)
- `(-1, 1)` - Invert X direction
- `(1, -1)` - Invert Y direction

**When to Use Normal Maps:**
- Detail on curved surfaces (wrinkles, scales, fabric)
- Brick walls, stone, concrete
- Character skin, fur, scales
- Any time you want detail without geometry

---

### **3. Scene Traversal with traverse()**

```javascript
model.scene.traverse((child) => {
  if (child.isMesh && child.name.includes("DOG")) {
    child.material = new THREE.MeshStandardMaterial({
      normalMap: textures.normalMap,
    })
  }
})
```

**What it does:**
- Loops through EVERY object in a 3D model hierarchy
- Visits parent, children, grandchildren, etc.
- Allows you to find and modify specific parts

**Parameters:**
- Callback function that receives each object as `child`

**Common Use Cases:**

**1. Find Specific Meshes:**
```javascript
model.scene.traverse((child) => {
  if (child.isMesh) {
    console.log('Found mesh:', child.name)
  }
})
```

**2. Change Materials:**
```javascript
model.scene.traverse((child) => {
  if (child.isMesh) {
    child.material.color.set('red')  // Make everything red
  }
})
```

**3. Enable Shadows:**
```javascript
model.scene.traverse((child) => {
  if (child.isMesh) {
    child.castShadow = true
    child.receiveShadow = true
  }
})
```

**4. Find by Name:**
```javascript
model.scene.traverse((child) => {
  if (child.name === 'Head') {
    child.visible = false  // Hide the head
  }
  
  if (child.name.includes('Wheel')) {
    child.rotation.z += 0.1  // Rotate all wheels
  }
})
```

**Object Properties to Check:**
- `child.isMesh` - Is it a mesh (geometry + material)?
- `child.isLight` - Is it a light?
- `child.isCamera` - Is it a camera?
- `child.name` - Object name from 3D software
- `child.type` - Type string ('Mesh', 'Group', 'Bone', etc.)

---

### **4. Direct THREE.js Usage**

```javascript
import * as THREE from 'three'

// Create materials directly
const material = new THREE.MeshStandardMaterial({
  normalMap: textures.normalMap,
  normalScale: new THREE.Vector2(1, 1),
})
```

**Why import THREE?**
- Access to Three.js constructors and utilities
- Create materials, geometries, vectors manually
- More control than JSX components

**Common THREE.js Classes:**

**Materials:**
```javascript
new THREE.MeshBasicMaterial({ color: 0xff0000 })
new THREE.MeshStandardMaterial({ metalness: 0.5, roughness: 0.5 })
new THREE.MeshPhysicalMaterial({ clearcoat: 1 })
```

**Vectors:**
```javascript
new THREE.Vector2(x, y)      // 2D vector (UV coords, normal scale)
new THREE.Vector3(x, y, z)   // 3D vector (positions, rotations)
new THREE.Color(0xff0000)    // Color (can use hex, rgb, string)
```

**Geometries:**
```javascript
new THREE.BoxGeometry(1, 1, 1)
new THREE.SphereGeometry(1, 32, 32)
new THREE.PlaneGeometry(10, 10)
```

**When to Use THREE Directly:**
- Custom material properties not available in JSX
- Mathematical operations (vectors, matrices)
- Advanced features (shaders, post-processing)
- Fine-grained control

---

### **5. THREE.Vector2**

```javascript
normalScale: new THREE.Vector2(1, 1)
```

**What it is:**
- A 2D vector with X and Y components
- Used for UV coordinates, 2D positions, scales

**Properties:**
```javascript
const vec = new THREE.Vector2(1, 1)
vec.x  // 1
vec.y  // 1
```

**Common Uses:**
- **Normal map scale** - Control bump intensity
- **Texture repeat** - `texture.repeat.set(2, 2)`
- **Texture offset** - `texture.offset.set(0.5, 0.5)`
- **UV coordinates** - Texture mapping positions

**Methods:**
```javascript
vec.set(x, y)           // Set both values
vec.add(otherVec)       // Add vectors
vec.multiply(otherVec)  // Multiply
vec.length()            // Distance from origin
vec.normalize()         // Scale to length 1
```

---

### **6. MeshStandardMaterial Properties**

```javascript
new THREE.MeshStandardMaterial({
  // Color & Maps
  color: 0xffffff,              // Base color (white = show texture colors)
  map: colorTexture,            // Color/albedo texture
  
  // Normal Mapping
  normalMap: normalTexture,     // Normal map texture
  normalScale: new Vector2(1,1), // Bump intensity
  
  // PBR Properties
  metalness: 0,                 // 0 = non-metal, 1 = full metal
  roughness: 1,                 // 0 = mirror, 1 = rough/matte
  metalnessMap: metalnessTexture,
  roughnessMap: roughnessTexture,
  
  // Lighting Details
  aoMap: aoTexture,             // Ambient occlusion
  aoMapIntensity: 1,            // AO strength
  
  // Displacement
  displacementMap: heightTexture,
  displacementScale: 0.1,       // Height magnitude
  
  // Emission (Self-glow)
  emissive: 0x000000,           // Glow color
  emissiveMap: emissiveTexture,
  emissiveIntensity: 1,
  
  // Other
  opacity: 1,                   // Transparency (need transparent: true)
  transparent: false,
  side: THREE.FrontSide,        // Which side to render
})
```

**Material Property Ranges:**
- `metalness`: 0.0 to 1.0 (0 = plastic/wood, 1 = metal)
- `roughness`: 0.0 to 1.0 (0 = polished mirror, 1 = rough matte)
- `opacity`: 0.0 to 1.0 (0 = invisible, 1 = solid)
- `normalScale`: (-Infinity to Infinity) - typically -2 to 2

---

### **7. Multiple useEffect Hooks**

```javascript
// Effect 1: Camera setup
React.useEffect(() => {
  camera.position.set(0, 2, 8)
  camera.lookAt(0, 0, 0)
}, [camera])

// Effect 2: Texture application
React.useEffect(() => {
  model.scene.traverse((child) => {
    // Apply materials
  })
}, [model, textures])
```

**Why Multiple useEffect?**
- **Separation of Concerns** - Each effect does one thing
- **Different Dependencies** - Run when different values change
- **Easier Debugging** - Know which effect caused issues
- **Better Performance** - Only re-run what changed

**Dependency Arrays Explained:**

```javascript
// Runs ONCE on component mount
useEffect(() => {
  console.log('Component mounted')
}, [])

// Runs when 'count' changes
useEffect(() => {
  console.log('Count:', count)
}, [count])

// Runs on EVERY render (usually avoid this!)
useEffect(() => {
  console.log('Every render')
})

// Runs when camera OR model changes
useEffect(() => {
  console.log('Camera or model changed')
}, [camera, model])
```

**Best Practices:**
1. Keep effects focused (one responsibility)
2. Always include dependencies (avoid stale closures)
3. Use separate effects for separate concerns
4. Add cleanup functions when needed:

```javascript
useEffect(() => {
  const interval = setInterval(() => {
    console.log('Tick')
  }, 1000)
  
  // Cleanup function
  return () => {
    clearInterval(interval)
  }
}, [])
```

---

### **8. Conditional Checks in traverse()**

```javascript
if (child.isMesh && child.name.includes("DOG"))
```

**Why Check `isMesh`?**
- Models contain many object types (Groups, Bones, Lights, etc.)
- Only Meshes have `geometry` and `material`
- Prevents errors from trying to modify non-mesh objects

**Object Type Checks:**
```javascript
child.isMesh         // THREE.Mesh
child.isGroup        // THREE.Group
child.isBone         // THREE.Bone
child.isLight        // Any light type
child.isCamera       // Any camera type
child.isLine         // THREE.Line
child.isPoints       // THREE.Points
```

**String Methods for Names:**
```javascript
// Exact match
if (child.name === "DogBody")

// Contains substring
if (child.name.includes("DOG"))

// Starts with
if (child.name.startsWith("Dog_"))

// Ends with
if (child.name.endsWith("_LOD0"))

// Case-insensitive match
if (child.name.toLowerCase().includes("dog"))

// Multiple conditions
if (child.isMesh && child.name.includes("DOG") && child.visible)
```

**Example - Complex Filtering:**
```javascript
model.scene.traverse((child) => {
  // Only visible meshes with "Dog" in name
  if (child.isMesh && child.visible && child.name.includes("Dog")) {
    child.material.roughness = 0.5
  }
  
  // Hide all bones
  if (child.isBone) {
    child.visible = false
  }
  
  // Log everything
  console.log(`Type: ${child.type}, Name: ${child.name}`)
})
```

---

### **9. Texture Loading Patterns**

**Single Texture:**
```javascript
const normalMap = useTexture('/textures/normal.png')
material.normalMap = normalMap
```

**Multiple Textures (Object):**
```javascript
const { map, normalMap, roughnessMap } = useTexture({
  map: '/textures/color.png',
  normalMap: '/textures/normal.png',
  roughnessMap: '/textures/roughness.png',
})
```

**Multiple Textures (Array):**
```javascript
const [texture1, texture2] = useTexture([
  '/textures/wood.png',
  '/textures/metal.png',
])
```

**With Preload (Better Performance):**
```javascript
// At bottom of component file
useGLTF.preload('/models/dog.drc.glb')
useTexture.preload('/textures/dog_normal.png')
```

---

## 🎓 Advanced Techniques Summary

### **What You've Learned:**

| Technique | Purpose | Difficulty |
|-----------|---------|------------|
| **useTexture** | Load image files as textures | ⭐⭐ |
| **Normal Maps** | Add surface detail without geometry | ⭐⭐⭐ |
| **traverse()** | Find and modify model parts | ⭐⭐⭐ |
| **THREE.js Direct** | Full control with Three.js API | ⭐⭐⭐⭐ |
| **MeshStandardMaterial** | PBR realistic materials | ⭐⭐⭐ |
| **Vector2** | 2D math for scales/UVs | ⭐⭐ |
| **Multiple useEffect** | Organize side effects | ⭐⭐ |

### **Your Current Project Uses:**

✅ **Basic Setup** - Canvas, Camera, Lights  
✅ **Model Loading** - useGLTF for 3D models  
✅ **Environment** - HDR lighting  
✅ **Controls** - OrbitControls for interaction  
✅ **Advanced Textures** - Normal maps with useTexture  
✅ **Material Customization** - Traverse & custom materials  
✅ **THREE.js API** - Direct Three.js usage  

### **Next Learning Steps:**

1. **Animations** - Play model animations with useAnimations
2. **Post-Processing** - Add effects (bloom, depth of field)
3. **Interactions** - Click handling and raycasting
4. **Physics** - Collision and gravity with cannon/rapier
5. **Shaders** - Custom visual effects with GLSL

---

## �🗺️ Step-by-Step Learning Roadmap

### **Phase 1: Foundation (Week 1-2)**

#### **Step 1: HTML/CSS Basics**
- ✅ Understand HTML structure
- ✅ Learn CSS styling (flexbox, viewport units)
- **Resources:** MDN Web Docs, freeCodeCamp

#### **Step 2: JavaScript Fundamentals**
- Variables (const, let)
- Functions (arrow functions)
- Arrays and Objects
- ES6+ features (destructuring, spread operator)
- **Practice:** Basic JS exercises

#### **Step 3: React Basics**
```javascript
// Learn these concepts:
- JSX syntax
- Components (function components)
- Props
- State (useState)
- Effects (useEffect)
```

**Project:** Build a simple React app (todo list, counter)

---

### **Phase 2: React Deep Dive (Week 3-4)**

#### **Step 4: React Hooks**
```javascript
- useState() - State management
- useEffect() - Side effects & lifecycle
- useRef() - References to DOM/values
- Custom hooks - Reusable logic
```

#### **Step 5: Component Patterns**
- Component composition
- Props drilling
- Children props
- Conditional rendering
- Lists and keys

**Project:** Multi-component React app with state management

---

### **Phase 3: 3D Graphics Basics (Week 5-6)**

#### **Step 6: Three.js Fundamentals**

**Core Concepts:**
```javascript
// The Three.js trinity:
1. Scene - Container for all objects
2. Camera - Viewpoint
3. Renderer - Draws to canvas

// Basic setup:
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
```

**Learn:**
- Creating scenes
- Adding meshes (geometry + material)
- Positioning objects
- Animation loop

**Resources:**
- Three.js Documentation
- Three.js Journey course
- Three.js examples

#### **Step 7: 3D Mathematics**
- Vectors (THREE.Vector3)
- Position, rotation, scale
- Coordinate systems
- Basic transformations

**Practice:** Create simple 3D shapes, move them around

---

### **Phase 4: React Three Fiber (Week 7-8)**

#### **Step 8: R3F Basics**

**Learn:**
```javascript
// Three.js vs R3F syntax:

// Three.js (imperative):
const mesh = new THREE.Mesh(geometry, material)
mesh.position.set(0, 1, 0)
scene.add(mesh)

// R3F (declarative):
<mesh position={[0, 1, 0]}>
  <boxGeometry />
  <meshStandardMaterial />
</mesh>
```

**Key Concepts:**
- Declarative 3D
- Props = Three.js properties
- Auto-disposal (memory management)
- Hooks (useThree, useFrame)

#### **Step 9: R3F Hooks**

```javascript
// useThree - Access renderer state
const { camera, gl, scene } = useThree()

// useFrame - Animation loop
useFrame((state, delta) => {
  meshRef.current.rotation.x += delta
})

// useLoader - Load assets
const texture = useLoader(TextureLoader, '/image.jpg')
```

**Project:** Create animated 3D scene with R3F

---

### **Phase 5: Drei Helpers (Week 9)**

#### **Step 10: @react-three/drei Components**

**Essential Components:**
```javascript
// Camera controls
<OrbitControls />
<PerspectiveCamera />

// Loaders
useGLTF('/model.glb')
useTexture('/texture.jpg')

// Lighting
<Environment preset="sunset" />
<ContactShadows />

// Helpers
<Stats />
<Grid />
<Sky />
```

**Learn:**
- When to use each helper
- Props and customization
- Performance considerations

---

### **Phase 6: 3D Models & Assets (Week 10)**

#### **Step 11: Working with GLTF/GLB**

**Learn:**
- GLTF format (JSON + binary)
- glTF vs glB (text vs binary)
- Loading models with useGLTF()
- Accessing model parts (meshes, materials, animations)

**Tools:**
- Blender (3D modeling software)
- Sketchfab (download models)
- glTF Viewer (preview models)

#### **Step 12: Textures & Materials**

**Material Types:**
```javascript
<meshBasicMaterial />      // No lighting
<meshStandardMaterial />   // PBR (most common)
<meshPhysicalMaterial />   // Advanced PBR
```

**Properties:**
- color - Base color
- metalness - How metallic (0-1)
- roughness - How rough (0-1)
- map - Texture image

---

### **Phase 7: Lighting & Environments (Week 11)**

#### **Step 13: Lighting Setup**

**Three-Point Lighting:**
```javascript
// 1. Key Light (main)
<directionalLight position={[5, 5, 5]} intensity={1} />

// 2. Fill Light (soften shadows)
<directionalLight position={[-3, 2, -3]} intensity={0.3} />

// 3. Back/Rim Light (separation)
<directionalLight position={[0, 2, -5]} intensity={0.5} />

// Base ambient
<ambientLight intensity={0.5} />
```

**Learn:**
- Light types and use cases
- Intensity and color
- Shadow configuration
- HDRI environments

#### **Step 14: Environment Maps**

```javascript
// Preset environments
<Environment preset="sunset" />

// Custom HDR
<Environment files="/studio.hdr" />

// Performance options
<Environment preset="city" background={false} />
```

---

### **Phase 8: Interactivity (Week 12)**

#### **Step 15: User Controls**

**OrbitControls:**
```javascript
<OrbitControls
  enablePan={true}
  enableZoom={true}
  enableRotate={true}
  minDistance={2}
  maxDistance={10}
  target={[0, 0, 0]}
/>
```

**Other Controls:**
- FlyControls - First-person flying
- PointerLockControls - First-person shooter
- TrackballControls - Free rotation

#### **Step 16: Mouse/Touch Events**

```javascript
<mesh onClick={(e) => console.log('clicked')}>
<mesh onPointerOver={(e) => console.log('hover')}>
<mesh onPointerDown={(e) => console.log('mouse down')}>
```

**Project:** Interactive 3D scene with clickable objects

---

### **Phase 9: Animation (Week 13)**

#### **Step 17: Model Animations**

```javascript
const { animations } = useGLTF('/animated-model.glb')
const { actions } = useAnimations(animations, group)

// Play animation
useEffect(() => {
  actions['Walk'].play()
}, [actions])
```

#### **Step 18: Custom Animations**

```javascript
// Rotate over time
useFrame((state, delta) => {
  meshRef.current.rotation.y += delta * 0.5
})

// Spring animations with react-spring
<animated.mesh position={springPosition}>
```

---

### **Phase 10: Optimization & Polish (Week 14)**

#### **Step 19: Performance Optimization**

**Techniques:**
- Model optimization (reduce polygons)
- Texture compression
- Level of Detail (LOD)
- Instancing for repeated objects
- Frustum culling

```javascript
// Example: Limit render updates
<Canvas frameloop="demand">

// Shadows only when needed
<directionalLight castShadow={false} />

// Compressed textures
useTexture('/texture.ktx2')
```

#### **Step 20: Build & Deploy**

```bash
# Build for production
npm run build

# Preview build
npm run preview

# Deploy to:
- Vercel
- Netlify
- GitHub Pages
```

---

## 🎯 Project-Specific Learning Path

### **For DogStudio Specifically:**

1. **Understand the structure:** (`Week 1-2`)
   - How App.jsx renders Canvas
   - How Dog.jsx loads and displays model
   - Component hierarchy

2. **Modify the dog:** (`Week 3`)
   - Change position: `<primitive position={[x, y, z]} />`
   - Rotate: Add `rotation={[x, y, z]}`
   - Scale: Add `scale={1.5}`

3. **Experiment with lighting:** (`Week 4`)
   - Try different light positions
   - Adjust intensities
   - Change environment presets

4. **Add interactivity:** (`Week 5`)
   - Make dog clickable
   - Change color on hover
   - Add UI controls (leva library)

5. **Animate the dog:** (`Week 6`)
   - If model has animations, play them
   - Create rotation animation
   - Add idle bobbing motion

---

## 📚 Additional Resources

### **Documentation:**
- [React Official Docs](https://react.dev)
- [Three.js Docs](https://threejs.org/docs)
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Drei Docs](https://github.com/pmndrs/drei)

### **Tutorials:**
- [Three.js Journey](https://threejs-journey.com) - Paid, comprehensive
- [Bruno Simon's Three.js Course](https://threejs-journey.com)
- [R3F Official Examples](https://docs.pmnd.rs/react-three-fiber/getting-started/examples)

### **3D Model Sources:**
- [Sketchfab](https://sketchfab.com) - Downloadable models
- [Poly Pizza](https://poly.pizza) - Free low-poly models
- [TurboSquid](https://www.turbosquid.com)

### **Tools:**
- **Blender** - Free 3D modeling software
- **glTF Viewer** - Preview GLTF files
- **Three.js Editor** - Visual scene editor

---

## 🚀 Next Steps

After mastering the basics:

1. **Add UI Controls** - Use `leva` or `dat.gui`
2. **Post-processing** - Add effects (bloom, depth of field)
3. **Physics** - Use `@react-three/cannon` or `@react-three/rapier`
4. **Multiple Models** - Create a full 3D scene
5. **VR Support** - Use `@react-three/xr`

---

## 💡 Tips for Learning

1. **Start Small** - Don't try to learn everything at once
2. **Build Projects** - Apply what you learn immediately
3. **Read Code** - Study examples from docs and GitHub
4. **Debug** - Use console.log to understand values
5. **Join Community** - Discord: Poimandres, Three.js, React

---

## 🐛 Common Issues & Solutions

### **Model not showing:**
- ✅ Check camera position (`camera.position.set(0, 1, 5)`)
- ✅ Verify model path (`/models/dog.drc.glb`)
- ✅ Add lights (at least ambient)

### **Model too dark:**
- ✅ Increase light intensity
- ✅ Add `<Environment preset="sunset" />`
- ✅ Add ambient light

### **Controls not working:**
- ✅ Import OrbitControls from drei
- ✅ Place inside `<Canvas>`
- ✅ Check enableRotate, enableZoom props

### **Performance issues:**
- ✅ Reduce model complexity  
- ✅ Optimize textures
- ✅ Disable shadows (`castShadow={false}`)
- ✅ Use `<Bounds>` for auto-fit

---

## ✅ Checklist for This Project

### **Basic Features:**
- [x] React components structure
- [x] Canvas setup with proper size
- [x] 3D model loading with useGLTF
- [x] Camera positioning and lookAt
- [x] Lighting setup (ambient + directional + fill)
- [x] Environment for PBR materials
- [x] OrbitControls for interaction
- [x] Proper code organization

### **Advanced Features:**
- [x] Texture loading with useTexture
- [x] Normal maps for surface detail
- [x] Scene traversal (model.scene.traverse)
- [x] Custom material application
- [x] Direct THREE.js usage
- [x] Multiple useEffect hooks
- [x] Conditional mesh filtering
- [x] Camera distance controls (minDistance/maxDistance)

### **Next Steps:**
- [ ] Add animations (if model supports)
- [ ] Add UI controls (leva/dat.gui)
- [ ] Add more textures (roughness, metalness, AO)
- [ ] Add post-processing effects
- [ ] Add click interactions
- [ ] Deploy to production

---

**Happy Learning! 🎨🚀**

_Last Updated: March 9, 2026_
