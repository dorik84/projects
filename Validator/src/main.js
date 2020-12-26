// importing the sass stylesheet for bundling
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./../node_modules/bootstrap/dist/js/bootstrap.min.js";
import "./../node_modules/popper.js/dist/popper.min.js";
import "./../node_modules/@fortawesome/fontawesome-free/css/all.css"
import "./../node_modules/@fortawesome/fontawesome-free/js/all.js"
// import "./../sass/styles.scss";

import {Validator} from "./Validator";

let valid = new Validator(/^\d+$/,"only set of digits from 0 to 9", "form1");
let valid2 = new Validator(/^[a-zA-Z]+$/,"only set of letters", "form2");

valid.constantCheck();
valid2.constantCheck();