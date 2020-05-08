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
hero.go();
hero.rotate();


let obj1 = new Gravity(150,150,25);
let obj2 = new Gravity(450,350,25);
let obj3 = new Gravity(350,450,25);
let obj4 = new Gravity(250,250,25);




let heroNode = document.querySelectorAll('.hero')[0];
heroNode.addEventListener('move', () => {
    obj1.run(hero.x,hero.y);
    obj2.run(hero.x,hero.y);
    obj3.run(hero.x,hero.y);
    obj4.run(hero.x,hero.y);
});

// document.addEventListener("mousedown", (event)=>{
//     let x = event.clientX;
//     let y = event.clientY;
//     console.log ("mouseclick",x,y);
//     obj1.run(x,y);
// });


