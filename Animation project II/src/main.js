// importing the sass stylesheet for bundling
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./../node_modules/bootstrap/dist/js/bootstrap.min.js";
import $ from "jquery";
import dragula from "dragula";


import "./../node_modules/popper.js/dist/popper.min.js";
import "./../node_modules/@fortawesome/fontawesome-free/css/all.css"
import "./../node_modules/@fortawesome/fontawesome-free/js/all.js"
import "./../sass/styles.scss";

import {Gravity} from "./gravity.js";
import {Character} from "./character.js";

let hero = new Character(500,100,1);
let score1 = 0;
let score2 = 0;
const ASTEROID_MAX_NUMBER = 11;
const ASTEROID_SPAM_INTERVAL = 2000;
const RENDER_INTERVAL = 20;

function getRandom(max) {
    return (Math.random() * max);
}

let asteroidObj = {};
let asteroidArray = [];
let n = 0;

setInterval(() => {
    //create asteroids every 2 sec
    if (asteroidArray.length < ASTEROID_MAX_NUMBER){
        asteroidObj[n] = new Gravity(getRandom(450),getRandom(450),getRandom(0.5));
        asteroidArray.push(asteroidObj[n]);
        n++;
    }
}, ASTEROID_SPAM_INTERVAL);

function shooting(){
    if (hero.isShooting()){
        let {x,y,width} = document.querySelector(".bullet").getBoundingClientRect();
        asteroidArray.forEach((asteroid,key) => {
            if (asteroid.isHit(x, y, width)) {
                asteroid.remove(); 
                hero.removeBullet();
                asteroidArray.splice(key, 1);
                $('#score1').text(function(){
                    score1++;
                    return score1;
                });
            }

        });
    }
}

function collide(){

    let {x,y,width} = document.querySelector(".hero").getBoundingClientRect();
    asteroidArray.forEach((asteroid,key) => {
        if (asteroid.isHit(x, y, width)) {
            asteroid.remove(); 
            // hero.removeBullet();
            asteroidArray.splice(key, 1);
            $('#score2').text(function(){
                score2++;
                return score2;
            });
        }
    });
}


let renderer = setInterval(()=>{    
    
    //follow spaceship
    asteroidArray.forEach(asteroid => {
        asteroid.goTo(hero.x,hero.y);
    });

    //shooting processor
    hero.engine();
    shooting();
    collide();

}, RENDER_INTERVAL);





