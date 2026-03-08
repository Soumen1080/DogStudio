import Dog from './components/Dog'
import './App.css'
import { Canvas } from '@react-three/fiber'


function App() {
  return (
    <>
      <Canvas style={{ width: '100vw', height: '100vh' }}>
        <Dog />
      </Canvas>
    </>
  )
}

export default App
