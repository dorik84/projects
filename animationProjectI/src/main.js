// importing the sass stylesheet for bundling
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./../node_modules/bootstrap/dist/js/bootstrap.min.js";
import $ from "jquery";
import dragula from "dragula";
import Keyframes from '@keyframes/core';


import THREELib from "three-js";
import * as dat from 'dat.gui';

import "./../node_modules/popper.js/dist/popper.min.js";
import "./../node_modules/@fortawesome/fontawesome-free/css/all.css"
import "./../node_modules/@fortawesome/fontawesome-free/js/all.js"
import "./../sass/styles.scss";
let containerWidth;
let containerHeight;

const NUMBER_OF_DOTS = 10;
const MAX_DELAY = 20;
const DURATION_MIN=5;
const DURATION_MAX=10;
const AMPLITUDE = 10;

function defineKeyframes(i){

    Keyframes.define([{
        name: 'move',
        '0%':  {transform: `translate(0px,0px)`},
        '10%': {transform: `translate(${getRndPlusMinus(0, i)}px,${getRndPlusMinus(0, i)}px)`},
        '20%': {transform: `translate(${getRndPlusMinus(0, i)}px,${getRndPlusMinus(0, i)}px)`},
        '30%': {transform: `translate(${getRndPlusMinus(0, i)}px,${getRndPlusMinus(0, i)}px)`},
        '40%': {transform: `translate(${getRndPlusMinus(0, i)}px,${getRndPlusMinus(0, i)}px)`},
        '50%': {transform: `translate(${getRndPlusMinus(0, i)}px,${getRndPlusMinus(0, i)}px)`},
        '60%': {transform: `translate(${getRndPlusMinus(0, i)}px,${getRndPlusMinus(0, i)}px)`},
        '70%': {transform: `translate(${getRndPlusMinus(0, i)}px,${getRndPlusMinus(0, i)}px)`},
        '80%': {transform: `translate(${getRndPlusMinus(0, i)}px,${getRndPlusMinus(0, i)}px)`},
        '90%': {transform: `translate(${getRndPlusMinus(0, i)}px,${getRndPlusMinus(0, i)}px)`},
        '100%': {transform: `translate(${getRndPlusMinus(0, i)}px,${getRndPlusMinus(0, i)}px)`}
    },
    {
        name:'pulsation',
        '0%'  : {boxShadow: '0 0 2px 1px rgba(0, 0, 0, 0.60)'},
        '85%' : {boxShadow: '0 0 2px 3px rgba(0, 0, 0, 0.9)'},
        '100%': {boxShadow: '0 0 2px 4px rgba(0, 0, 0, 0.95)'} 
    }]);

}



function getContainerSize(object) {
    containerWidth = object.parentNode.offsetWidth ;
    containerHeight = object.parentNode.offsetHeight ;
}

function move(elem) {

    const dot = new Keyframes(elem);
    let delay = getRndInteger(0, MAX_DELAY);
    let duration = getRndInteger(DURATION_MIN, DURATION_MAX);

    dot.play([
        `move ${duration}s linear ${delay}s infinite alternate none`,
        `pulsation 0.5s linear ${delay}s infinite alternate none`
    ]);
}

function initialPosition(object){
    
    let x = getRndInteger(1, containerWidth);
    let y = getRndInteger(1, containerHeight);

    console.log("initial position",x,y);
    object.style.left = `${x}px`;
    object.style.top = `${y}px`;
}

function randPlus(){
    let random = Math.floor(Math.random() * 2 ) ;
    (random == 0)? random = 1: random = -1;
    return random;
}

function getRndPlusMinus(min, max) {
    return randPlus()*Math.floor(Math.random() * (max - min + 1) ) + min;
}

function getRndInteger(min, max) {
    return (Math.random() * (max - min + 1) ) + min;
}



function mouseClick(e){
    let x = e.clientX;     
    let y = e.clientY; 
    console.log(x, y);

    let dotNodes=document.querySelectorAll("dot");
    for (let dot of dotNodes) {
        dot.style.transition= "all 2s";
        dot.style.left = `${x}px`;
        dot.style.top = `${y}px`;
    }
    var timeoutID = window.setTimeout(spreadDots, 2000);
}

function spreadDots(){
    let dots = document.querySelectorAll("dot");
    for (let dot of dots){
        dot.style.transition= "all 0.5s cubic-bezier(.43,.52,.02,.98)";
        initialPosition(dot);
    }
}

function onResize(){
    getContainerSize(document.querySelectorAll("dot")[0]);
    spreadDots();
}

function main() {

    defineKeyframes (AMPLITUDE);
   
    for (let count = 0; count < NUMBER_OF_DOTS; count++){
        let dot = document.createElement("dot");
        $(".screen").append(dot);
        getContainerSize(dot);
        initialPosition(dot);
        move(dot);
    }
}

main();

$(".screen").click(mouseClick);
document.querySelectorAll(".screen")[0].addEventListener('touchstart', mouseClick);

window.addEventListener('resize', onResize);