
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
            position={[0,0,0]}
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
 

// function Camera(props) {
//     const camera = useRef()
//     const { size, setDefaultCamera, viewport } = useThree()
//     useEffect(() => void setDefaultCamera(camera.current), [])
//     useFrame(() => camera.current.updateMatrixWorld())

//     return( 
//         <perspectiveCamera
//             {...props}
//             ref={camera}
//             aspect={viewport.width / viewport.height}
//             radius={(viewport.width + viewport.height) / 4}
//             onUpdate={self => self.updateProjectionMatrix()}
//         />
//     )
//   }


//=========================================general SFC for Three js instance
const Model_viewer = (props) => {
    const { imgToModel,setImgToModel,setIsLoading} = props;
    // const wrapper = document.querySelector(".wrapper");
    // const refer = useRef()
    return ( 
        <div className="wrapper" >
            <CloseBtn setImgToModel={setImgToModel} />
            <Canvas 
                camera = {{position:[2,5,10]}}
                onCreated={({gl})=>{
                    gl.setPixelRatio( window.devicePixelRatio )
                    gl.setClearColor('white')
                    gl.shadowMap.enabled = true
                    gl.shadowMap.type = THREE.PCFSoftShadowMap}}>
                        <fog 
                            attach="fog" 
                            args={["white", 25,50 ]}/>

                        <Controls />
                        <ambientLight intensity={0.5}/>
                        <group position ={[0,15,20]} >
                            <spotLight
                                intensity={0.7}
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