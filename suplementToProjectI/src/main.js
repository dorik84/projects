// importing the sass stylesheet for bundling
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./../node_modules/bootstrap/dist/js/bootstrap.min.js";
import $ from "jquery";
import dragula from "dragula";

import THREELib from "three-js";
import * as dat from 'dat.gui';

import "./../node_modules/popper.js/dist/popper.min.js";
import "./../node_modules/@fortawesome/fontawesome-free/css/all.css"
import "./../node_modules/@fortawesome/fontawesome-free/js/all.js"
import "./../sass/styles.scss";

let beams;
let numberOfBeams = 2;
let blackHole;


function spreadBeamsEvenly(){
    let degToIncrement = 360/numberOfBeams;
    let deg=0;
    for(let beam of beams){   
        
        deg += degToIncrement;
        beam.style.transform = `rotate(${deg}deg)`;
    }
}


function addBeams(){
    blackHole.innerHTML = "";

    for (let i = 0; i < numberOfBeams; i++){
        let beam = document.createElement("div");
        beam.classList.add("beam");
        
        beam.style.animationDelay = "2s";
        beam.style.setProperty('--i', `${rnd (0,1)}s`);
        beam.style.setProperty('--d', `1s`);
        
        blackHole.appendChild(beam);
    }

    beams = document.querySelectorAll(".beam");
}

function speedUpAnimation(){
    // console.log("speedUP");
    let time = 1;
    let timeoutID  = setInterval (function (){
        $(".beam").css('--d', `${time}s`);
        console.log("speedUP");
        time-=0.1
        if (time <= 0.1){
            clearTimeout(timeoutID);
            let timeout  = setTimeout (function(){resetSpeed()},1000);
            
        }
    },300);   
}

function resetSpeed(){
    $(".beam").css('--d', `1s`);
}

function explode(){

    
}

function main (){
    blackHole = document.querySelectorAll(".blackHole")[0];
    
    
    addBeams();
    spreadBeamsEvenly();
    speedUpAnimation();
}

function rnd (min,max){
    return Math.random() * (max - min) + min;
}

main();