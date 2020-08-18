
import React, { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, extend, useThree } from 'react-three-fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


//adding orbit controll
extend({ OrbitControls})
const Controls = () => {
    const {camera, gl} = useThree();
    const ref = useRef()

    useFrame(()=>{
        ref.current.update()
    })

    return ( 
        <orbitControls
            args={[camera, gl.domElement]}
            ref={ref} />
    );
}
 

//adding box object
const Box = (props) => {
    const { imgToModel} = props;
    const [texture, setTexture] = useState()
    const meshRef = useRef()

    useEffect(()=>{
        setTexture( new THREE.TextureLoader().load(imgToModel));
        
    },[imgToModel])

    return ( 
        <mesh 
            ref = {meshRef}
            castShadow>
                <boxBufferGeometry attach="geometry" args={[3, 3, 3]} />
                <meshPhysicalMaterial attach="material"  map={texture} color='white' />
        </mesh>
    );
}

//adding spere object to the light
const Spere = (props) => {
    const ref=useRef()
    return (  
        <mesh
            {...props}
            ref={ref}>
            <sphereBufferGeometry attach="geometry" args={[0.25, 16,16]} />
            <meshBasicMaterial attach="material" color='white' />
        </mesh>
    );
}
 

//just adding plane for casting shadows on it
const Plane = (props) => {
    const meshRef = useRef()
    return ( 
        <mesh  
            receiveShadow
            position={[0,-1.5,0]} 
            ref = {meshRef}
            rotation ={[-Math.PI/2,0,0]}>
                <planeBufferGeometry attach="geometry" args={[100, 100]} />
                <meshPhysicalMaterial attach="material" color='white' />
        </mesh>
    );
}
 


// general function for Three js instance
const Model_viewer = (props) => {
    const { imgToModel} = props;

    return ( 
        <Canvas 
        className="model_viewer"
        camera={{position:[0,5,5]}} 
        onCreated={({gl})=>{
            gl.setPixelRatio( window.devicePixelRatio );
            gl.setClearColor('black')
            gl.shadowMap.enabled = true
            gl.shadowMap.type = THREE.PCFSoftShadowMap}}>
            <fog 
                attach="fog" 
                args={["black", 15,30 ]}/>
            <Controls />
            <ambientLight intensity={0.2}/>
            <group position ={[0,7,20]} >
                <spotLight
                intensity={1}
                castShadow 
                penumbra={0.5}/>
                <Spere />
            </group>
            <Box imgToModel = {imgToModel}/>
            <Plane  />
        </Canvas>
    );
}
 
export default Model_viewer;