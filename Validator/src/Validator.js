class Validator {
    constructor(regexp, message, className){
        this.regExp = RegExp(regexp);

        this.input = document.querySelectorAll(`.${className}`)[0];
        this.input.style.cssText = `transition: all 0.5s;`;
        this.height = this.input.clientHeight;
        this.width = this.input.clientWidth;

        this.msg = document.createElement("p");
        this.msg.style.cssText = `color:#d9534f; margin:0; padding:0; font-size: 0.6rem; position:absolute; transform: translateY(${this.height+2}px); opacity:0; transition: all 0.5s;`;
        this.msg.textContent = message;
        this.input.parentElement.insertBefore(this.msg, this.input);

        this.mark = document.createElement("span");
        this.mark.style.cssText = `color:#5cb85c; margin:0; padding:0; font-size: 1rem; position:absolute; line-height:${this.height}px ; transform:translateX(${this.width+5}px); opacity:0; transition: all 0.5s;`;
        this.mark.innerHTML = "&#10003;";
        (this.input.parentElement).insertBefore(this.mark, this.input);
    }

//-------------------------------------------------------------------public methods
    constantCheck(){
        this.input.addEventListener("focus", ()=>{
            this.singleCheck ();
        });

        this.input.addEventListener("keyup", ()=>{
            this.singleCheck ();
        });

        this.input.addEventListener("focusout", ()=>{
            if (this.isValid()){
                this.input.style.boxShadow = "none";
            }
        });
    }

    singleCheck (){
        if (!this.input.value == ""){
            if (!this.isValid()){
                this.input.style.boxShadow = "inset 0 0 2px 1px #d9534f";
                this.showMsg();
                this.hideMark();
            } else {
                this.input.style.boxShadow = "inset 0 0 2px 1px #5cb85c";
                this.hideMsg();
                this.showMark();
            }
        } else {
            this.input.style.boxShadow = "none";
            this.hideMsg();
            this.hideMark();

        }
    }
//-------------------------------------------------------------------private methods
    isValid(){
        return this.regExp.test(this.input.value);
    }

    showMsg(){
        this.msg.style.opacity = "1";
    }

    hideMsg(){
        this.msg.style.opacity = "0";
    }
    showMark(){
        this.mark.style.opacity = "1";
    }

    hideMark(){
        this.mark.style.opacity = "0";
    }

}

export {Validator};