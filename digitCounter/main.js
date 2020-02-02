
//----------------------------------------------given maps
let digits = new Map([[0, ""],[1, "one"],[2, "two"],[3,"three"],[4,"four"],[5,"five"],[6,"six"],[7,"seven"],[8,"eight"],[9,"nine"]]);
let teens = new Map([[0,"ten"],[1,"eleven"],[2,"twelve"],[3,"thirteen"],[4,"fourteen"],[5,"fifteen"],[6,"sixteen"],[7,"seventeen"],[8,"eighteen"],[9,"nineteen"]]);
let decas = new Map([[0, ""],[1, "ten"],[2,"twenty"],[3,"thirty"],[4,"forty"],[5,"fifty"],[6,"sixty"],[7,"seventy"],[8,"eighty"],[9,"ninety"]]);
//-----------------------------------------------------------------------------


//----------------------------------------------declares global variables and modifies given maps
let givenNumber = 1000;  //   <<<<<================  ENTER NUMBER HERE
let bigArray =[];
decas.delete(0);
decas.delete(1);
let digitsClone = new Map(digits);
digitsClone.delete(0);
let endMain = false;
let keyHundreds, valueHundreds;
//-----------------------------------------------------------------------------

// ----------------------check if given number mathes current number of the cycle
function checkMatch(key,isMoreThan100) {
    if ((key == givenNumber) || (parseInt(`${keyHundreds?keyHundreds:0}0${key}`) == givenNumber && isMoreThan100)) {
        endMain = true;
        return true;
    } else
        return false;
}
//-----------------------------------------------------------------------------

// ----------------------print output in console
function output(){
    console.log(bigArray.join(" "));
    console.log("\n");

    console.log((bigArray.join("").replace(/ |,/g, '')).length);
    
}
//-----------------------------------------------------------------------------

// ----------------------cycle for numbers 0-9 and 100s
function upToNine(isMoreThan100,valueHundreds) {
    for (let [key, value] of digits) {
        if (key == 0 && isMoreThan100){
            bigArray.push(`${valueHundreds} hundred,`);

            if (checkMatch(key,isMoreThan100))
                return;
            continue;
        }

        if (isMoreThan100)
            bigArray.push(`${valueHundreds} hundred and`);
        bigArray.push(value+",");
        
        if (checkMatch(key,isMoreThan100))
            return;
    }
} 
//-----------------------------------------------------------------------------

// ----------------------cycle for numbers 10-19
function upToNineteen(isMoreThan100,valueHundreds) {
    for (let [key, value] of teens){

        if (isMoreThan100)
            bigArray.push(`${valueHundreds} hundred and`);
        bigArray.push(value+",");

        if ((key == givenNumber-10) || (parseInt(`${keyHundreds?keyHundreds:0}1${key}`) == givenNumber && isMoreThan100)){
            endMain = true;
            return;
        }
    }
}
//-----------------------------------------------------------------------------

// ----------------------cycle for numbers 20-99
function upToNinetyNine(isMoreThan100,keyHundreds,valueHundreds) {
    for (let [keyTens, valueTens] of decas) {

        for (let [keyOnes, valueOnes] of digits) {

            if (isMoreThan100)
                bigArray.push(`${valueHundreds} hundred and`);
            bigArray.push(valueTens);
            bigArray.push(valueOnes+",");

            if ( (parseInt(`${keyTens}${keyOnes}`) == givenNumber && !isMoreThan100) || (parseInt(`${keyHundreds}${keyTens}${keyOnes}`) == givenNumber && isMoreThan100)){
                endMain = true;
                return;
            }
        }
    }
}
//-----------------------------------------------------------------------------

// ----------------------cycle for hundred digits
function countHundreds() {

    for ([keyHundreds, valueHundreds] of digitsClone) {
        upToNine(true,valueHundreds);
        if(endMain)
            return;
        upToNineteen(true,valueHundreds);
        if(endMain)
            return;
        upToNinetyNine(true,keyHundreds,valueHundreds);
        if(endMain)
            return;
    }
}
//-----------------------------------------------------------------------------

// ----------------------assignes functions accordinelly to the given number value 
function main (){

    if (givenNumber < 10)
        upToNine(false,0);
    else if (givenNumber < 20){
        upToNine(false,0);
        upToNineteen(false,0);
    } else if (givenNumber < 100) {
        upToNine(false,0);
        upToNineteen(false,0);
        upToNinetyNine(false,0);
    } else if (givenNumber <= 1000){
        upToNine(false,0);
        upToNineteen(false,0);
        upToNinetyNine(false,0);
        countHundreds();
        if(endMain){
            output();
            return;
        }
        bigArray.push("one thousand");
    }
    output();
}


main();