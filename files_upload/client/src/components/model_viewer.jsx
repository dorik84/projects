import * as THREE from 'three';
import React, {useEffect, useState} from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Vector3, FogExp2, FrontSide } from 'three';
const Model_viewer = (props) => {
    const imgToModel = props.imgToModel;

    let mount;

    useEffect (()=>{
        //-------------------------------------------SCENE
        const scene = new THREE.Scene();
        scene.fog = new FogExp2('#f5f5f0', 0.03);
       
        //-------------------------------------------CAMERA
        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        camera.position.set(0,5,10);
        camera.lookAt(new Vector3(0,0,0));

        //-------------------------------------------LIGHT
        const light1 = new THREE.PointLight(0xffffff, 1, 100 );
        light1.position.set( -2, 8, 1 );
        light1.castShadow = true;
        light1.shadow.mapSize.width = 1024;  // default
        light1.shadow.mapSize.height = 1024;   // default
        light1.shadow.bias = 0.001;
        scene.add( light1 );

        //-------------------------------------------RENDERER
        const renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.shadowMap.enabled = true;
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setClearColor('#b8b894');

        //replace renderer.domElement if exist with new one
        let canvas = document.querySelectorAll('canvas')[0];
        if (canvas) {
            mount.replaceChild(renderer.domElement, canvas);
        } else {
            mount.appendChild( renderer.domElement );
        }


        //-------------------------------------------OBJECTS
        const cube = addCube (2,2,2);
        const plane = addPlane (100,100);
        const sphere1 = addSphere (0.25);
        
        scene.add( cube );
        scene.add( plane );
        light1.add(sphere1);

        //-------------------------------------------ORBIT CONTROLS
        const controls = new OrbitControls( camera, renderer.domElement );
        controls.update();

        //-------------------------------------------ANIMATE
        const animate = function () {
            requestAnimationFrame( animate );
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            controls.update();
            renderer.render( scene, camera );
        };

        animate();


        //-------------------------------------------CUSTOM FUNCTIONS
        function addCube (width, height, depth) {

            let url = imgToModel;
            const texture = new THREE.TextureLoader().load( url );
            const material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide } );

            const geometry = new THREE.BoxGeometry(width, height, depth);

            const cube = new THREE.Mesh( geometry, material );
            cube.castShadow = true;
            cube.position.set( 0, 2, 0 );
            return cube
        }


        function addPlane (size1,size2) {
            const geometry = new THREE.PlaneGeometry(size1,size2);
            const material = new THREE.MeshStandardMaterial( {color: '#f5f5f0', side: THREE.DoubleSide} );
            const plane = new THREE.Mesh( geometry, material );
            plane.rotation.x = 90 * Math.PI/180;
            plane.receiveShadow = true;
            return plane
        }

        function addSphere (radius) {
            const geometry = new THREE.SphereGeometry(radius, 24, 24);
            const material = new THREE.MeshBasicMaterial( {color: '#ffffff'} );
            const sphere = new THREE.Mesh( geometry, material );
            return sphere
        }

    },[imgToModel])
    


    return ( <div className = "container d-flex justify-content-center p-2" ref={ref => (mount = ref)} /> );
}
 
export default Model_viewer;