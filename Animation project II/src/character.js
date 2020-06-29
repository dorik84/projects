import $ from "jquery";

class Character {

    constructor(x,y,a){
        //----------------------------------------parameters
        this.animationInterval = 100;
        this.acceleration = 50;
        this.speedMax = 3;
        this.forward = 0;
        this.event = new Event('move');
        this.degree = 0;


        this.timeIncr = {};
        this.timeIncr.right = 0;
        this.timeIncr.left = 0;
        this.timeIncr.top = 0;
        this.timeIncr.down = 0;


        this.acc = {};
        this.acc.temp = a;


        this.totalDistance = {};
        this.totalDistance.x = 0;
        this.totalDistance.y = 0;


        this.t = {};
        this.t.right=0;
        this.t.left=0;
        this.t.down=0;
        this.t.top=0;

        //----------------------------------------DOM element
        //------outer div of the Character
        this.hero = document.createElement("div");
        this.hero.classList.add("hero");
        let cssStackHero = `
            left:${x}px;
            top:${y}px;
        `;
        this.hero.style.cssText = cssStackHero;
        document.querySelectorAll("body")[0].appendChild(this.hero);

        //-----inner div/body of the Character
        this.ship = document.createElement("div");
        this.hero.appendChild(this.ship);

        //-----canon
        this.canon = document.createElement("div");
        this.ship.appendChild(this.canon);
        this.bullet = null;
        this.shot = null;

        //start private inner functions to control the Character instance
        this.steering();
        this.focusOnCursor();
        this.shoot();
    }
//-------------------------------------------------------get |set methods

    get x(){
        return this.hero.getBoundingClientRect().x;
    }
    get y(){
        return this.hero.getBoundingClientRect().y;
    }



//-------------------------------------------------------public methods
    steering(){

        document.addEventListener("keypress", (e) => {
            this.hero.dispatchEvent(this.event);

            if (e.key == "d" ) {
                this.timeIncr.right = this.acceleration;
            }

            if (e.key == "a" ) {
                this.timeIncr.left = this.acceleration;
            }

            if (e.key == "s" ) {
                this.timeIncr.down = this.acceleration;
            }

            if (e.key == "w" ) {
                this.timeIncr.top = this.acceleration;
            }

        });

        document.addEventListener("keyup",(e) => {
            
            if (e.key == "d" ) {
                this.timeIncr.right = -this.acceleration;
            }

            if (e.key == "a" ) {
                this.timeIncr.left = -this.acceleration;
            }

            if (e.key == "s" ) {
                this.timeIncr.down = -this.acceleration;
            }

            if (e.key == "w" ) {
                this.timeIncr.top = -this.acceleration;
            }
        });

    }

    engine () {

        this.limitAcceleration("right");
        this.limitAcceleration("left");
        this.limitAcceleration("top");
        this.limitAcceleration("down");

        this.setBoundaries();

        // console.log(this.t.right, this.t.left, this.t.top, this.t.down);

        this.totalDistance.x = this.totalDistance.x + (this.acc.right * Math.pow(this.t.right, 2)) / 2 + (this.acc.left * Math.pow(this.t.left, 2)) / 2;
        this.totalDistance.y = this.totalDistance.y + (this.acc.down * Math.pow(this.t.down, 2)) / 2 + (this.acc.top * Math.pow(this.t.top, 2)) / 2;

        // console.log(`${this.totalDistance.x} = ${this.totalDistance.x} + ${this.acc.right} * Math.pow(${this.t.right})  + (${this.acc.left} * Math.pow(${this.t.left})) / 2`);
        // console.log(`${this.totalDistance.y} = ${this.totalDistance.y} + ${this.acc.down} * Math.pow(${this.t.top})  + (${this.acc.down} * Math.pow(${this.t.top})) / 2`);
        
        this.hero.style.transform = `translate(${this.totalDistance.x}px, ${this.totalDistance.y}px)`;
        this.ship.style.transform = `rotate(${this.degree}deg)`;  
    }

    isShooting(){
        return this.hero.isShooting;
    }


    //-------------------------private methods
    shoot () {
        document.addEventListener("click",(e)=> {
            if (!this.hero.isShooting){
                //get ship position coordinates
                let {top,left} = this.hero.getBoundingClientRect();

                //-----creating missel DOM element
                this.bullet = document.createElement("div");
                this.bullet.classList.add("bullet");
                let cssStackBullet = `
                    left:${left}px;
                    top:${top}px;
                `;
                this.bullet.style.cssText = cssStackBullet;
                document.querySelectorAll("body")[0].appendChild(this.bullet);
                this.hero.isShooting = true;

                //launch missel
                setTimeout(()=>{
                    $(".bullet").css({
                        "left" : `${e.pageX-8}px`,
                        "top" : `${e.pageY-7.5}px`
                    });
                },1);
                
                
                this.shot = setTimeout(() => { 
                    this.removeBullet();
                }, 500);
            }
        
        })
    };


    removeBullet(){
        this.bullet.remove();
        this.hero.isShooting = false;
        clearTimeout(this.shot);
    }


    limitAcceleration(toward){
        this.t[toward] = this.t[toward] + this.timeIncr[toward]/1000;
        (this.t[toward] > this.speedMax)? this.t[toward] = this.speedMax : this.t[toward];
        (this.t[toward] < 0)? this.t[toward] = 0 : this.t[toward];
    }


    setBoundaries(){

        let body = document.querySelectorAll('body')[0].getBoundingClientRect();
        let {left, top, right, bottom, width, height} = this.hero.getBoundingClientRect();

        this.acc.right = this.acc.temp;
        this.acc.left = -this.acc.temp;
        this.acc.down = this.acc.temp;
        this.acc.top = -this.acc.temp;

        if (right > body.width - width) {
            
            this.acc.right = 0;
        } else if (left < 0 + width) {
            this.acc.left = 0;
        } 

        if (bottom > screen.height - height) {
            this.acc.down = 0;
        } else if (top < 0 + height) {
            this.acc.top = 0;
        } 

    }

    focusOnCursor () {
        document.querySelector("body").addEventListener('mousemove', (e)=>{
            let g = new Promise(resolve => {
                let hero = this.hero.getBoundingClientRect();
                let x = (hero.x) + hero.width /2;
                let y = (hero.y) + hero.height /2;
                let radians = Math.atan2(e.pageX - x,  e.pageY - y);
                let degree = (radians * (180 / Math.PI) * -1) + 90;
                resolve (degree);
            });
            g.then(degree => this.degree = degree)
        });

    }
    
}
export {Character};