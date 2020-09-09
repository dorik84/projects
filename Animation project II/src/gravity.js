import $ from "jquery";

class Gravity {

    constructor(x,y,a){
        //----------------------------------------parameters
        this.acceleration = a; 
        this.incrTime = 0.1;
        this.animationAndFunctionInterval = 500;
        this.speedDecreaseIndex = 0.95;
        // this.repeat = 0;
        // this.scan = 0;
        // this.gravArray = [];

        this.current = {};
        this.next = {};
        this.acc = {};
        this.speed = {};
        this.totalDistance = {};

        this.totalDistance.x = 0;
        this.totalDistance.y = 0;

        this.acc.x = a;
        this.acc.y = a;

        this.speed.x = 0;
        this.speed.y = 0;

        this.current.x = x;
        this.current.y = y;

        this.event = new Event('move');

        //----------------------------------------DOM element
        this.grav = document.createElement("div");
        this.grav.classList.add("grav");
        let cssStack = `
            left:${x}px;
            top:${y}px;
        `;
        this.grav.style.cssText = cssStack;
        document.querySelectorAll("body")[0].appendChild(this.grav);
    }

    //----------------------------------------------------- get | set method
    get x() {
        return this.current.x;
    }

    get y() {
        return this.current.y;
    }

    //----------------------------------------------------- public method
    goTo (x,y){
        
        this.next.x = x;
        this.next.y = y;

        this.grav.dispatchEvent(this.event);
        this.changeDirection();

        this.totalDistance.x = this.totalDistance.x + this.speed.x + (this.acc.x * Math.pow(this.incrTime, 2)) / 2;
        this.totalDistance.y = this.totalDistance.y + this.speed.y + (this.acc.y * Math.pow(this.incrTime, 2)) / 2;
        this.grav.style.transform = `translate(${this.totalDistance.x}px, ${this.totalDistance.y}px)`;

        // console.log(`totalDistanceX ${this.totalDistance.x} =  ${this.speed.x} + (${this.acc.x} * ${this.incrTime}^2))/2 `); 
        // console.log(`totalDistanceY ${this.totalDistance.y} =  ${this.speed.y} + (${this.acc.y} * ${this.incrTime}^2))/2 `);   
    }

    /*
    scanAndFollow(radius){
        this.scanNcreateArray();
        
        if (!this.scan){
            this.scan = setInterval(() => {
                
                for (let grav of this.gravArray) {
                    if (this.isClose(radius,grav)){
                        grav.addEventListener("move", ()=>{
                            let coord = grav.getBoundingClientRect();
                            let x = coord.x;
                            let y = coord.y;
                            this.goTo(x,y);
                        });
                    }
                }
            }, this.animationAndFunctionInterval);
        }
    }
    */


    isHit(x,y,size){
        let {left, top, right, bottom} = this.grav.getBoundingClientRect();
        if (( x + size >= left && x <= right ) && ( y + size >= top && y <= bottom ))
            return true;
    }

    //--------------------------------------------------------- private methods

    remove(){
        this.grav.remove();
        // clearInterval(this.repeat);
    }

/* 
    isClose(radius,elem){
        let rect = elem.getBoundingClientRect();
        let close = false;
        if (Math.abs(rect.x - this.current.x) <= radius && Math.abs(rect.y - this.current.y) <= radius){
            close = true;
        }
        // console.log(close);
        return close;
        
    }

    scanNcreateArray(){
        this.gravArray =  Array.from(document.querySelectorAll(".grav"));
        let index = this.gravArray.indexOf(this.grav);
        this.gravArray.splice(index, 1);
    }
*/

    defineAcceleration(){
        // find the intersection points of the line and the circle, where the radius of the circle is the acceleration,
        // and the line connects the center of the circle and the point of final destination. Returns acceleration parameters
        // for x and y axises
        
        let differenceX = this.next.x - this.current.x; // + right
        let differenceY = this.next.y - this.current.y; // + down

        let d = Math.pow(differenceX * this.acceleration, 2) / ( Math.pow(differenceY,2) + Math.pow(differenceX,2) ) ;
        let x = (differenceX > 0) ? this.current.x + Math.sqrt(d) / 2 : this.current.x - Math.sqrt(d) / 2; 
        let y = this.current.y + differenceY * (x - this.current.x) / differenceX;

        this.acc.x = x - this.current.x;
        this.acc.y = y - this.current.y;

        // console.log (this.acc.x , this.acc.y );
    }

    //-----------------------------------------------------------------------------
    changeDirection(){
        this.current = this.grav.getBoundingClientRect();

        this.defineAcceleration();

        this.speed.x = (this.speed.x + this.acc.x) * this.speedDecreaseIndex;
        this.speed.y = (this.speed.y + this.acc.y) * this.speedDecreaseIndex;
    }
}
export {Gravity};