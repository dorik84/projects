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

import {Gravity} from "./gravity.js";

let obj = new Gravity(100,150,1);

document.addEventListener("mousedown", (event)=>{
    let x = event.clientX;
    let y = event.clientY;
    // console.log (x,y);
    obj.run(x,y);
});

// obj.run(200,250);
