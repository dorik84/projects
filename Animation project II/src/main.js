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

let hero = new Character(500,100,10);

function getRandom() {
    return Math.floor(Math.random() * 450) + 1;
}

let asteroidObj ={};
let asteroidArray = [];
let n = 0;
let generator = setInterval(()=>{
    asteroidObj[n] = new Gravity(getRandom(),getRandom(),25);
    asteroidArray.push(asteroidObj[n]);
    asteroidObj[n].goTo(hero.x,hero.y);
    n++;
},5000)




let heroNode = document.querySelectorAll('.hero')[0];
heroNode.addEventListener('move', () => {
    // asteroid1.goTo(hero.x,hero.y);
    // asteroid2.goTo(hero.x,hero.y);
    // asteroid3.goTo(hero.x,hero.y);
    // asteroid4.goTo(hero.x,hero.y);

    
    
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

});





