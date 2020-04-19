class Validator {
    constructor(regexp, message, className){
        this.regExp = RegExp(regexp);
        //--------------------------------------------Creaing a wrapper around the input text field
        this.wrapper = document.createElement("div");
        this.wrapper.style.cssText = `position:relative; display:flex;`;

        let cloneInput = document.querySelectorAll(`.${className}`)[0].cloneNode(true);
        this.wrapper.appendChild(cloneInput);
        (document.querySelectorAll(`.${className}`)[0].parentNode).replaceChild(this.wrapper, document.querySelectorAll(`.${className}`)[0]);
        
        //-------------------------------------------Initializing input field 
        this.input = document.querySelectorAll(`.${className}`)[0];
        this.input.style.cssText = `display:inline-block; transition:all 0.5s;`;


        let height = this.input.clientHeight;

        //-------------------------------------------Creating warning message element
        this.msg = document.createElement("span");
        this.msg.style.cssText = `color:#d9534f; margin:0; padding:0; font-size: 0.6rem; position:absolute; transform: translateY(${height+2}px); opacity:0; display:block; transition: all 0.5s; z-index:5;`;
        this.msg.textContent = message;
        this.wrapper.appendChild(this.msg);

        //-------------------------------------------Creating CheckMark sign element
        this.mark = document.createElement("span");
        this.mark.style.cssText = `color:#5cb85c; margin:0; padding:0 0 0 5px; font-size: 1rem;  line-height:${height}px ; opacity:0; display:inline; transition: all 0.5s; z-index:5;`;
        this.mark.innerHTML = "&#10003;";
        this.wrapper.appendChild(this.mark);
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