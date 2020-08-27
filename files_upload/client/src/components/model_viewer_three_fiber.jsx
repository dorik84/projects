
import React, { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, extend, useThree } from 'react-three-fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './model_viewer.css';


//============================================handlers


const CloseBtn = (props) => {
    const {setImgToModel} = props;

    const onCloseModelViewer = ()=>{
        setImgToModel(false);
    }

    return ( 
        <div className="close-container" onClick={()=>onCloseModelViewer()}>
            <div className="leftright"></div>
            <div className="rightleft"></div>
        </div>
    );
}
 


//============================================adding orbit controll
extend({ OrbitControls})
const Controls = () => {
    const {camera, gl} = useThree();  //retrieving objects (camera and renderer) from THREE
    const ref = useRef()

    useFrame(()=>{
        ref.current.update() //updating sate of controls in the renderer
    })

    return ( 
        <orbitControls
            args={[camera, gl.domElement]}
            ref={ref} />
    );
}
 

//===================================================adding box object
const Box = (props) => {
    const { imgToModel,setIsLoading} = props;
    const [texture, setTexture] = useState()
    const meshRef = useRef()

    //saving new texture(picture)  in state every time it changes in props
    useEffect(()=>{
        setTexture( new THREE.TextureLoader().load(imgToModel));
        setIsLoading(false);
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

//===========================================adding spere object to the light
const Spere = (props) => {
    const ref=useRef()
    return (  
        <mesh
            {...props}
            ref={ref}>
                <sphereBufferGeometry attach="geometry" args={[0.25, 16, 16]} />
                <meshBasicMaterial attach="material" color='white' />
        </mesh>
    );
}
 

//================================just adding plane for casting shadows on it
const Plane = () => {
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
 


//=========================================general SFC for Three js instance
const Model_viewer = (props) => {
    const { imgToModel,setImgToModel,setIsLoading} = props;
    
    return ( 
        <div className="wrapper">
            <CloseBtn setImgToModel={setImgToModel} />
            <Canvas 
                className="model_viewer"
                camera={{position:[0,5,5]}} 
                onCreated={({gl})=>{
                    gl.setPixelRatio( window.devicePixelRatio )
                    gl.setSize( window.innerWidth, window.innerHeight )
                    gl.setClearColor('white')
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
                        <Plane  />
                        <Box imgToModel = {imgToModel} setIsLoading={setIsLoading} />
                        
            </Canvas>
        </div>
    );
}
 
export default Model_viewer;