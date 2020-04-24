class Gravity {

    constructor(x,y,a){
        //----------------------------------------parameters
        this.acceleration = a; 
        this.incrTime = 0.2;
        this.animationAndFunctionInterval = 1000;
        this.speedDecreaseIndex = 1;
        this.repeat = 0;

        this.before = {};
        this.current = {};
        this.next = {};
        this.initial = {};
        this.acc = {};
        this.speed = {};
        this.timer = {};
        this.totalDistance = {};

        this.totalDistance.x = 0;
        this.totalDistance.y = 0;

        this.acc.x = a;
        this.acc.y = a;

        this.timer.x = 0;
        this.timer.y = 0;

        this.initial.x = 0;
        this.initial.y = 0;

        this.speed.x = 0;
        this.speed.y = 0;

        this.before.x = x;
        this.before.y = y;

        this.current.x = x;
        this.current.y = y;

        //----------------------------------------DOM element
        this.grav = document.createElement("div");
        this.grav.classList.add("grav");
        let cssStack = `
            position:absolute;
            background: black;
            width:20px;
            height:20px;
            left:${x}px;
            top:${y}px;
            transition: all ${this.animationAndFunctionInterval}ms linear;
        `;
        this.grav.style.cssText = cssStack;
        document.querySelectorAll("body")[0].appendChild(this.grav);
    }
    

    run (x,y){
        
        this.next.x = x;
        this.next.y = y;

        this.changeDirection();

        if (!this.repeat){
            this.repeat = setInterval(()=> {
                this.timer.x += this.incrTime;
                this.timer.y += this.incrTime;
                this.before = this.grav.getBoundingClientRect();

                this.totalDistance.x = this.initial.x + (this.speed.x / this.incrTime) * this.timer.x + (this.acc.x * Math.pow(this.timer.x, 2)) / 2;
                this.totalDistance.y = this.initial.y + (this.speed.y / this.incrTime) * this.timer.y + (this.acc.y * Math.pow(this.timer.y, 2)) / 2;
                this.grav.style.transform = `translate(${this.totalDistance.x}px, ${this.totalDistance.y}px)`;
        
                // console.log(`totalDistanceX ${this.totalDistance.x} = ${this.initial.x} + (${this.speed.x}/${this.incrTime})*${this.timer.x} + (${this.acc.x} * ${this.timer.x}^2))/2 `); 
                // console.log(`totalDistanceY ${this.totalDistance.y} = ${this.initial.y} + (${this.speed.y}/${this.incrTime})*${this.timer.y} + (${this.acc.y} * ${this.timer.y}^2))/2 `); 
            }, this.animationAndFunctionInterval);
        }
    }
    

    //-----------------------------------------------------------------------------
    defineAcceleration(z){
        let tempAccZ = this.acceleration;
        let differenceX = this.next.x - this.current.x; // + right
        let differenceY = this.next.y - this.current.y; // + down
        let ratio = Math.abs(differenceX / differenceY);

        let diff = this.next[z] - this.current[z];
        
        if (ratio < 1) {
            tempAccZ = ratio * this.acceleration;
        }
        //define acceleration and direction
        this.acc[z] = (diff > 0) ? tempAccZ : -tempAccZ ;
    }


    shouldChange(z){
        console.log(`${z}(${this.before[z]} < ${this.current[z]} && ${this.current[z]} > ${this.next[z]} && ${this.acc[z]} > 0)`);
        
        this.current = this.grav.getBoundingClientRect();
        if ((this.before[z] < this.current[z] && this.current[z] > this.next[z] && this.acc[z] > 0) || (this.before[z] > this.current[z] && this.current[z] < this.next[z] && this.acc[z] < 0)){
            this.defineAcceleration(z);

            this.timer[z] = this.incrTime;
            this.speed[z] = (this.current[z] - this.before[z]) * this.speedDecreaseIndex;
            this.initial[z] = this.totalDistance[z]; 
        }
    }

    //-----------------------------------------------------------------------------
    changeDirection(){

        this.shouldChange("x");
        this.shouldChange("y");
    }
//#################################################################################################

}
export {Gravity};