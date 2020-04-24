class Gravity {

    constructor(x,y,a){
        //----------------------------------------parameters
        this.acc = a; 
        this.incrTime = 0.2;
        this.animationAndFunctionInterval = 1000;
        this.speedDecreaseIndex = 1;
        this.repeat = 0;

        this.before = {};
        this.current = {};
        this.next = {};
        this.initial = {};

        this.totalDistanceX = 0;
        this.totalDistanceY = 0;

        this.accX = a;
        this.accY = a;

        this.tX = 0;
        this.tY = 0;

        this.initial.x = 0;
        this.initial.y = 0;

        this.speedX = 0;
        this.speedY = 0;

        this.before.x = 0;
        this.before.y = 0;

        this.current.x = 0;
        this.current.y = 0;

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
                this.tX += this.incrTime;
                this.tY += this.incrTime;
                this.before = this.grav.getBoundingClientRect();

                this.totalDistanceX = this.initial.x + (this.speedX / this.incrTime) * this.tX + (this.accX * Math.pow(this.tX, 2)) / 2;
                this.totalDistanceY = this.initial.y + (this.speedY / this.incrTime) * this.tY + (this.accY * Math.pow(this.tY, 2)) / 2;
                this.grav.style.transform = `translate(${this.totalDistanceX}px, ${this.totalDistanceY}px)`;
        
                
        
                console.log(`totalDistanceX ${this.totalDistanceX} = ${this.initial.x} + (${this.speedX}/${this.incrTime})*${this.tX} + (${this.accX} * ${this.tX}^2))/2 `); 
                console.log(`totalDistanceY ${this.totalDistanceY} = ${this.initial.y} + (${this.speedY}/${this.incrTime})*${this.tY} + (${this.accY} * ${this.tY}^2))/2 `); 
            }, this.animationAndFunctionInterval);
        }
    }
    

    //-----------------------------------------------------------------------------
    defineAcceleration(){

        let tempAccX = 0;
        let tempAccY = 0;

        let differenceX = this.next.x - this.current.x; // + right
        let differenceY = this.next.y - this.current.y; // + down
        let ratio = Math.abs(differenceX / differenceY);
        
        if (ratio >= 1) {
            ratio = 1/ratio;
            tempAccX = this.acc;
            tempAccY = ratio * this.acc;
        } else if (ratio < 1) {
            tempAccX = ratio * this.acc;
            tempAccY = this.acc;
        }

        //define acceleration and direction
        this.accX = (differenceX > 0) ? tempAccX : -tempAccX ;
        this.accY = (differenceY > 0) ? tempAccY : -tempAccY ;
    }

    //-----------------------------------------------------------------------------
    changeDirection(){
        this.current = this.grav.getBoundingClientRect();
        
        console.log(`y(${this.before.y} < ${this.current.y} && ${this.current.y} > ${this.next.y} && ${this.accY} > 0)`);


        if ((this.before.x < this.current.x && this.current.x > this.next.x && this.accX > 0) || (this.before.x > this.current.x && this.current.x < this.next.x  && this.accX < 0)){
            this.defineAcceleration();

            this.tX = this.incrTime;
            this.speedX = (this.current.x - this.before.x) * this.speedDecreaseIndex;
            this.initial.x = this.totalDistanceX;
        }

        if ((this.before.y < this.current.y && this.current.y > this.next.y && this.accY > 0) || (this.before.y > this.current.y && this.current.y < this.next.y && this.accY < 0)){
            this.defineAcceleration();

            this.tY = this.incrTime;
            this.speedY = (this.current.y - this.before.y) * this.speedDecreaseIndex;
            this.initial.y = this.totalDistanceY; 
        }
        console.log("this.totalDistanceX ",this.initial.x, this.totalDistanceX);
        console.log("this.totalDistanceY ",this.initial.y, this.totalDistanceY);
    }
//#################################################################################################

}
export {Gravity};