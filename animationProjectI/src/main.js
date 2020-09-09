// importing the sass stylesheet for bundling
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./../node_modules/bootstrap/dist/js/bootstrap.min.js";
import $ from "jquery";
import Keyframes from '@keyframes/core';
import "./../node_modules/popper.js/dist/popper.min.js";
import "./../node_modules/@fortawesome/fontawesome-free/css/all.css"
import "./../node_modules/@fortawesome/fontawesome-free/js/all.js"
import "./../sass/styles.scss";


let containerWidth;
let containerHeight;
let beams;
let blackHole;

//dots presettings
const NUMBER_OF_DOTS = 20;
const MAX_DELAY = 5;
const DURATION_MIN=5;
const DURATION_MAX=10;
const AMPLITUDE = 10;

//blackHole and Beams presettings
const NUMBER_OF_BEAMS = 36;
let BEAM_DELAY = 1;
let BEAM_ANIM_DURATION = 1;
let EXPLOSION_DELAY = 2000; //ms



//----------------------------------------------------------------------------------event handlers
function onResize(){
    getContainerSize(document.querySelectorAll("dot")[0]);
    spreadDots();
}


function mouseClick(e){
    $( ".blackHole" ).remove();
    let x = e.clientX;     
    let y = e.clientY;  

    $("dot").css("transition",`all ${EXPLOSION_DELAY}ms`);
    $("dot").css({"left":`${x}px`, "top":`${y}px`});

    //-------------------------------------------------------------
    blackHole = document.createElement("div");
    blackHole.classList.add("blackHole");
    blackHole.classList.add("exploide");
    document.querySelectorAll(".screen")[0].appendChild(blackHole);
    
    let half = $(".blackHole").width()/2;
    $(".blackHole").css({"left":`${x-half}px`,"top":`${y-half}px`});
  
    addBeams();
    spreadBeamsEvenly();
    speedUpAnimation();

   
    $(".blackHole").on("animationstart", function(){
        if (event.animationName ==  "wave"){
            spreadDots();
        }
    });
}


//################################################################################### DOTS

function move(elem) {

    const dot = new Keyframes(elem);
    let delay = getRndInteger(0, MAX_DELAY);
    let duration = getRndInteger(DURATION_MIN, DURATION_MAX);

    dot.play([
        `move ${duration}s linear ${delay}s infinite alternate none`
        ,`pulsation 0.5s linear ${delay}s infinite alternate none`
    ]);
}

function initialPosition(object){
    
    let x = getRndInteger(1, containerWidth);
    let y = getRndInteger(1, containerHeight);

    object.style.left = `${x}px`;
    object.style.top = `${y}px`;
}


function spreadDots(){
    let dots = document.querySelectorAll("dot");
    for (let dot of dots){
        dot.style.transition= "all 0.5s cubic-bezier(.43,.52,.02,.98)";
        initialPosition(dot);
    }
}

//################################################################################### BEAMS


function addBeams(){

    blackHole.innerHTML = "";

    for (let i = 0; i < NUMBER_OF_BEAMS; i++){
        let beam = document.createElement("div");
        beam.classList.add("beam");
        beam.style.animationDelay = "2s";
        beam.style.setProperty('--i', `${rnd (0,BEAM_DELAY)}s`);
        beam.style.setProperty('--d', `${BEAM_ANIM_DURATION}s`);
        
        blackHole.appendChild(beam);
    }

    beams = document.querySelectorAll(".beam");
}


function spreadBeamsEvenly(){
    let degToIncrement = 360/NUMBER_OF_BEAMS;
    let deg=0;
    for(let beam of beams){   
        deg += degToIncrement;
        beam.style.transform = `rotate(${deg}deg)`;
    }
}


function speedUpAnimation(){

    let time = 1;
    let timeoutID  = setInterval (function (){
        $(".beam").css('--d', `${time}s`);

        time-=0.1
        if (time <= 0.1){
            clearTimeout(timeoutID);
            let timeout  = setTimeout (function(){resetSpeed()}, 1000);
        }
    },100);   
}

//-------------------------------------------------------------------------------------main
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

//-------------------------------------------------------------------------------------private methods
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

function getContainerSize(object) {
    containerWidth = object.parentNode.offsetWidth ;
    containerHeight = object.parentNode.offsetHeight ;
}

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
    }]);
}

function resetSpeed(){
    $(".beam").css('--d', `1s`); //beam
}

function rnd (min,max){
    return Math.random() * (max - min) + min; //beam delay
}

//----------------------------------------------------------------------------------event listeners
$(".screen").click(mouseClick);
document.querySelectorAll(".screen")[0].addEventListener('touchstart', mouseClick);
window.addEventListener('resize', onResize);



main();


