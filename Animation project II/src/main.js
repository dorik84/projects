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

function getRandom(max) {
    return (Math.random() * max);
}

let asteroidObj ={};
let asteroidArray = [];
let n = 0;
setInterval(()=>{
    //create asteroids every 5 sec
    if (asteroidArray.length < 11){
        asteroidObj[n] = new Gravity(getRandom(450),getRandom(450),getRandom(0.3));
        asteroidArray.push(asteroidObj[n]);
        n++;
    }
},3000)

function shooting(){
    if (hero.isShooting()){
        let {x,y} = document.querySelector(".bullet").getBoundingClientRect();
        asteroidArray.forEach((asteroid,key)=>{
            if (asteroid.isHit(x,y)) {
                asteroid.remove(); 
                hero.removeBullet();
                asteroidArray.splice(key, 1);
            }
        });
    }
}


let renderer = setInterval(()=>{    

    //follow spaceship
    asteroidArray.forEach(asteroid => {
        asteroid.goTo(hero.x,hero.y);
    });

    //shooting processor
    hero.engine();
    shooting();

},20);





