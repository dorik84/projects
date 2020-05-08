class Character {

    constructor(x,y,a){
        //----------------------------------------parameters
        this.animationInterval = 100;
        this.timeIncrTemp = 100;
        this.accMax = 2;
        this.forward = 0;
        this.event = new Event('move');
        this.degree = 0;


        this.timeIncr = {};
        this.timeIncr.right = 0;
        this.timeIncr.left = 0;
        this.timeIncr.top = 0;
        this.timeIncr.down = 0;


        this.acc = {};
        this.acc.right = a;
        this.acc.left = -a;
        this.acc.down = a;
        this.acc.top = -a;
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
        this.hero = document.createElement("div");
        this.hero.classList.add("hero");
        let cssStackHero = `
            position:absolute;
            position:relative;
            width:20px;
            height:20px;
            left:${x}px;
            top:${y}px;
            transition: all ${this.animationInterval}ms linear;
        `;
        this.hero.style.cssText = cssStackHero;
        document.querySelectorAll("body")[0].appendChild(this.hero);

        this.ship = document.createElement("div");
        let cssStackShip = `
            position:absolute;
            background:red;
            border-radius: 0 5px 5px 0;
            width:100%;
            height:100%;
            transition: all ${this.animationInterval}ms linear;
        `;

        this.ship.style.cssText = cssStackShip;
        this.hero.appendChild(this.ship);
    }
//-------------------------------------------------------get |set methods

    get x(){
        return this.hero.getBoundingClientRect().x;
    }
    get y(){
        return this.hero.getBoundingClientRect().y;
    }

//-------------------------------------------------------public methods
    go(){

        document.addEventListener("keypress", (e) => {
            // console.log('keypress');
            this.acc.right = this.acc.temp;
            this.acc.left = -this.acc.temp;
            this.acc.down = this.acc.temp;
            this.acc.top = -this.acc.temp;


            if (e.key == "d" ) {
                this.timeIncr.right = this.timeIncrTemp;
            }

            if (e.key == "a" ) {
                this.timeIncr.left = this.timeIncrTemp;
            }

            if (e.key == "s" ) {
                this.timeIncr.down = this.timeIncrTemp;
            }

            if (e.key == "w" ) {
                this.timeIncr.top = this.timeIncrTemp;
            }

        });

        document.addEventListener("keyup",(e) => {
            
            if (e.key == "d" ) {
                this.timeIncr.right = -this.timeIncrTemp;
            }

            if (e.key == "a" ) {
                this.timeIncr.left = -this.timeIncrTemp;
            }

            if (e.key == "s" ) {
                this.timeIncr.down = -this.timeIncrTemp;
            }

            if (e.key == "w" ) {
                this.timeIncr.top = -this.timeIncrTemp;
            }

        });


        if (!this.forward){
            this.forward = setInterval( () => {
                this.hero.dispatchEvent(this.event);

                this.limitAcceleration("right");
                this.limitAcceleration("left");
                this.limitAcceleration("top");
                this.limitAcceleration("down");

                this.setBoundaries();
                this.rotate();

                // console.log(this.t.right, this.t.left, this.t.top, this.t.down);

                this.totalDistance.x = this.totalDistance.x + (this.acc.right * Math.pow(this.t.right, 2)) / 2 + (this.acc.left * Math.pow(this.t.left, 2)) / 2;
                this.totalDistance.y = this.totalDistance.y + (this.acc.down * Math.pow(this.t.down, 2)) / 2 + (this.acc.top * Math.pow(this.t.top, 2)) / 2;

                // console.log(`${this.totalDistance.x} = ${this.totalDistance.x} + ${this.acc.right} * Math.pow(${this.t.right})  + (${this.acc.left} * Math.pow(${this.t.left}, 2)) / 2`);
                
                this.hero.style.transform = `translate(${this.totalDistance.x}px, ${this.totalDistance.y}px)`;
                this.ship.style.transform = `rotate(${this.degree}deg)`; 
                
            
            }, this.animationInterval);
            
        }

    }
    //-------------------------private methods

    limitAcceleration(toward){
        this.t[toward] = this.t[toward] + this.timeIncr[toward]/1000;
        (this.t[toward] > this.accMax)? this.t[toward]=this.accMax : this.t[toward];
        (this.t[toward] < 0)? this.t[toward]=0 : this.t[toward];
    }

    setBoundaries(){

        let body = document.querySelectorAll('body')[0].getBoundingClientRect();
        let hero = this.hero.getBoundingClientRect();
        // console.log(body.width,body.height);
        // console.log(hero.x,hero.y);

        if (hero.x > body.width - 2*hero.width) {
            this.acc.right = 0;
        } else if (hero.x < 0 + hero.width) {
            this.acc.left = 0;
        }

        if (hero.y > body.height - 2*hero.width) {
            this.acc.down = 0;
        } else if (hero.y < 0 + hero.width) {
            this.acc.top = 0;
        }

    }

    rotate () {
        document.querySelector("body").addEventListener('mousemove', (e)=>{
            let hero = this.hero.getBoundingClientRect();
            let x = (hero.x) + hero.width /2;
            let y = (hero.y) + hero.height /2;
            let radians = Math.atan2(e.pageX - x,  e.pageY - y);
            this.degree = (radians * (180 / Math.PI) * -1) + 90;


            console.log(this.degree);
        });
    }
    
}
export {Character};