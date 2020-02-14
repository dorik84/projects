// importing the sass stylesheet for bundling
// import "./../sass/styles.scss";


    

//----------------------------------------------declaration of varaibales

let numberOfWeeksInSemestr;
let numberOfDaysAWeek;
let maximumNumbersOfClassesADay;
let schedulePattern;
let numberOfHoursInALesson;

let splitRemains;
let everySecondWeek = false;

let blueprint = [];
let leftovers = {};

let hoursLeft = 0;
let programName = "";
let teacherName = "";

let nextWeek = false;
let nextCourse = false;

let course;
let program;
let week;
let classNumber;
let startDay;
let startClass;

let NumberOfClassesAWeek;

let teachSchedule;
let progSchedule;

let givenProgramsArray = [];
//  = 
// [ 
// [   [75,"python","Sean"], [60,"html","Matt"], [60,"windows","Gord"], [60,"netw","Darlin"], [60,"sql","Gord"], [30,"comm1","Sheri"]     ],
// [   [60,"java","Sean"], [60,"serv","Matt"], [60,"proj","Matt"], [60,"js","Sean"], [60,"linux","Gord"],[30,"comm2","Sheri"]             ],
// [   [60,"java2","Sean"], [60,"serv2","Matt"], [60,"proj2","Matt"], [60,"js2","Sean"], [60,"linux2","Gord"],[30,"comm4","Sheri"],[30,"asd","Ketrine"]          */   ]      
// ];  

//-----------------------------------------------------------Print programs array to user
function printProgramsArray(){
    let output = document.getElementById('output');
    output.innerHTML="";
   
    givenProgramsArray.forEach(program => {

        let table = document.createElement("TABLE");
        output.appendChild(table);
        table.className += "table table-sm table-light table-bordered border border-success rounded my-1";

        let thead = document.createElement("THEAD");
        table.appendChild(thead);
        thead.classList.add("thead-light");

        let bigRow = document.createElement("TR");
        thead.appendChild(bigRow);

        let th1 = document.createElement("TH");
        th1.innerHTML = "Hours";
        let th2 = document.createElement("TH");
        th2.innerHTML = "Course";
        let th3 = document.createElement("TH");
        th3.innerHTML = "Name";
        bigRow.appendChild(th1);
        bigRow.appendChild(th2);
        bigRow.appendChild(th3);

        program.forEach(course => {

            let row = document.createElement("TR");
            table.appendChild(row);

            course.forEach(value => {

                let cell = document.createElement("TD");
                cell.innerHTML = value;
                row.appendChild(cell);
            })
        })
    });


}
//---------------------------------------------------------------


//----------------------------------------------------------------create programs Arrey from users input
function createProgramsArray(){
    let programCourses =[];
    
    for (let courseNum = 1; courseNum <= 10; courseNum++){
        let course = [];
        let h = document.getElementById(`hours${courseNum}`).value;
        let c = document.getElementById(`course${courseNum}`).value;
        let t = document.getElementById(`teacher${courseNum}`).value;
        if (h && c && t) {
            course.push(h, c, t);
            programCourses.push(course);
        } else
            break; 
    }
    givenProgramsArray.push(programCourses);
    console.log(givenProgramsArray);
    printProgramsArray();
}
//-----------------------------------------------------------


//-----------------------------------------------------------Print output result
function printScedule(){
    
    for (let program=0; program < givenProgramsArray.length; program++) {
        for (let week=0; week < numberOfWeeksInSemestr; week++) {
            console.log( window["ScheduleForProgram" + program + week] );
        }
        for(let course=0; course < givenProgramsArray[program].length; course++){
            console.log( window[givenProgramsArray[program][course][2] + 0] );
        } 
    }
}
//-----------------------------------------------------------------------------------------------------


//--------------------------------------find the last class of current course in the program schedule
function findLastClass(){
    for (let day = numberOfDaysAWeek-1; day >= 0; day--) {
        let spotClass = progSchedule[day].indexOf(programName);
        if (spotClass >= 0){
            console.log (day,spotClass);
            return [day,spotClass];
        }
    }
}
//--------------------------------------------------------------------------------------------------


//-------------------------------Checking a number of classes of given course in current week
function checkNumberOfClassesAWeek () {
    let count = 0;
    for(let day of progSchedule){
        for(let clas of day) {
            clas == programName ? count++ : count += 0;
        }
    }
    return count;  
}
//-----------------------------------------------------------------------------------------------------


//--------------------------------------Split inappropriate number of remaining hours within semestr
function splitRemainingHours(){
    if (splitRemains && leftovers[programName] > 0) {

        hoursLeft = leftovers[programName];

        if (hoursLeft == ( numberOfHoursInALesson * numberOfWeeksInSemestr ) / 2)   // if remaining hours can be splitet equally and added to every second week instead of evey week
        everySecondWeek = true;

        [day,spotClass] = findLastClass();
        let temp  = day + schedulePattern * 2;
        if (temp + 1 > numberOfDaysAWeek){           // if it can be added in one day
            startClass = spotClass+1;
        } else {                                     // or the same day but different class
            startDay = temp;
        }

        leftovers[programName] = 0;
        NumberOfClassesAWeek += 1;

        changeWeek();
    }
}
//-----------------------------------------------------------------------------------------------------


//----------------------------------------------------Listing days within a current week
function changeDay(start=0) {
    
    for (let dayOfAWeek = start; dayOfAWeek < progSchedule.length; dayOfAWeek++){

        if (hoursLeft <= 0 ){
            splitRemainingHours(); 
            nextCourse = true;
            startClass = 0;         
            startDay = 0;              //return to starting day to Monday
            return; // [0,true] hours ran out, need to swith course  
        } 

        // check if there is free space in the schedule to accommodate classes of current course    
        if (checkNumberOfClassesAWeek () >= NumberOfClassesAWeek) {
            nextWeek = true;
            return; // [1,true] hours still remain / need to switch week
            
        } else if ((progSchedule[dayOfAWeek][classNumber] == 0) && (teachSchedule[dayOfAWeek][classNumber] == 0)){
            // startDay = 0;
            progSchedule[dayOfAWeek][classNumber] = programName;
            teachSchedule[dayOfAWeek][classNumber] = teacherName;
            dayOfAWeek += schedulePattern;
            hoursLeft -= numberOfHoursInALesson;    
        } 
    }
}
//-----------------------------------------------------------------------------------------------------


//---------------------------------------------Listing class order number from 8:30-10:30, 10:30-12:30, 13:30-15:30
function changeClass(start=0) {
        
    for (classNumber=start; classNumber < maximumNumbersOfClassesADay; classNumber++) {
        
        changeDay(startDay);
        
        if (nextCourse || nextWeek) 
            return;
    }
}   
//-----------------------------------------------------------------------------------------------------


//---------------------------------------------------------Change week
function changeWeek(){
    
    for (week=0; week < numberOfWeeksInSemestr; week++) {    

        progSchedule = window["ScheduleForProgram" + program + week];
        teachSchedule = window[givenProgramsArray[program][course][2] + week];
            
        changeClass(startClass);

        nextWeek = false;     //week is switched to next. return value to default

        if (everySecondWeek)  //skipping one week for spreding remains hours evry second week
            week++;

        if (nextCourse) 
            return;
    }
}
//-----------------------------------------------------------------------------------------------------


//---------------------------------------------define Number Of Classes A Week
function countNumberOfClassesAWeek (){
    
    let temp = hoursLeft / ( numberOfHoursInALesson * numberOfWeeksInSemestr );
    let remains = 0;
    
    if (Number.isInteger(temp)) {     // if course hours can be spreaded during weeks evenly
        NumberOfClassesAWeek = temp;

    } else {                          //  else define what part can be devided equally and what remains
        NumberOfClassesAWeek = Math.floor(temp);
        remains = leftovers[programName] = parseInt (hoursLeft % ( numberOfHoursInALesson * numberOfWeeksInSemestr ));
        
        console.log(remains);
    }
    return remains;
}   
//-----------------------------------------------------------------------------------------------------


//-------------------------------Processor. Entery point to schedule
function allocator() {

    hoursLeft = givenProgramsArray[program][course][0];
    programName = givenProgramsArray[program][course][1];
    teacherName = givenProgramsArray[program][course][2];
    
    remains = countNumberOfClassesAWeek();

    hoursLeft -= remains;
    everySecondWeek = false;

    changeWeek();

    if (nextCourse) 
        return;
}
//-----------------------------------------------------------------------------------------------------


//------------------------------------------Create teachers empty weeks for entire semester
function emptyTeacherSchedule () {
    
    for (let week=0; week < numberOfWeeksInSemestr; week++) {
        if (window[givenProgramsArray[program][course][2] + week]) {
            break;
        }
        window[givenProgramsArray[program][course][2] + week] = JSON.parse(JSON.stringify(blueprint));
    }
}
//-----------------------------------------------------------------------------------------------------


//----------------------------------------Listing courses 
function courseSwitcher () {
        
    for (course=0; course < givenProgramsArray[program].length; course++) {

        emptyTeacherSchedule ();
        allocator();
        nextCourse = false;
    }
}
//-----------------------------------------------------------------------------------------------------


//-------------------------------------------Listing programs 
function programSwitcher () {

    for (program=0; program < givenProgramsArray.length; program++) {
        courseSwitcher ();
    }
}
//-----------------------------------------------------------------------------------------------------


//----------------------------------------Create programs empty weeks for entire semester 
function emptyProgramSchedule() {
    for ( let numProg=0; numProg < givenProgramsArray.length; numProg++ ) {
            
            for ( let numWeek=0; numWeek < numberOfWeeksInSemestr; numWeek++ ) {
                window["ScheduleForProgram" + numProg + numWeek] = JSON.parse(JSON.stringify(blueprint)); 
            }
    }
}
//-----------------------------------------------------------------------------------------------------


//---------------------------------------------Create one empty week as frame
function createWeekFrame (){
    
    for (let j = 0; j < numberOfDaysAWeek; j++ ) {
        let day = [];

        for (let i = 0; i < maximumNumbersOfClassesADay; i++ ) {  

            let cell = document.getElementById(`cell${i}${j}`);
            if (!cell.classList.contains('table-danger')){
                day.push(0);
            } else {
                day.push(1);
            }
        }

        blueprint = blueprint.concat([day]);
    } 
    console.log(blueprint)
}
//-----------------------------------------------------------------------------------------------------


//----------------------------------------------Show schedule table for user
function showPreliminaryScheduleTable(){

    let scheduleTable = document.getElementById('tableBody');
    scheduleTable.innerHTML = "";

    
    for (let j = 0; j < maximumNumbersOfClassesADay; j++ ) {

        let row = document.createElement("TR");
        row.setAttribute("id",`row${j}`);
        scheduleTable.appendChild(row);

        let newTH = document.createElement("TH");
        newTH.classList.add("table-light");
        row.appendChild(newTH);
        newTH.innerHTML=`${j+1}`;
        
        for (let i = 0; i < numberOfDaysAWeek; i++ ) {  
            
            let newCell = document.createElement("TD");
            newCell.setAttribute("id",`cell${j}${i}`);
            newCell.classList.add("table-success");
            row.appendChild(newCell);
        }
    }
}
//--------------------------------------------------------------------------------------------------


//------------------------------------------------------------------get initial general data from the user
function getInitialData (){
    let temp = document.getElementById('numberOfWeeksInSemestr').value;
    numberOfWeeksInSemestr = temp? parseInt(temp) : 15;
    document.getElementById('weeks').innerHTML = numberOfWeeksInSemestr;

    temp = document.getElementById('numberOfDaysAWeek').value;
    numberOfDaysAWeek = temp? parseInt(temp) : 5;
    document.getElementById('days').innerHTML = numberOfDaysAWeek;

    temp = document.getElementById('maximumNumbersOfClassesADay').value;
    maximumNumbersOfClassesADay = temp? Number(temp) : 3;
    document.getElementById('classes').innerHTML = maximumNumbersOfClassesADay;

    schedulePattern = parseInt(document.querySelector('input[name="schedulePattern"]:checked').value);

    temp = document.getElementById('numberOfHoursInALesson').value;
    numberOfHoursInALesson = temp? parseInt(temp) : 2;
    document.getElementById('hoursInLesson').innerHTML = numberOfHoursInALesson;

    splitRemains = document.getElementById('customSwitch').checked;
    
}
//-------------------------------------------------------------------------------------------------------


// function resetInitData(){
//     numberOfWeeksInSemestr = 0;
//     document.getElementById('numberOfWeeksInSemestr').innerHTML = "";

//     numberOfDaysAWeek = 0;
//     document.getElementById('numberOfDaysAWeek').innerHTML = "";

//     maximumNumbersOfClassesADay = 0;
//     document.getElementById('maximumNumbersOfClassesADay').innerHTML = "";
    
//     numberOfHoursInALesson = 0;
//     document.getElementById('numberOfHoursInALesson').innerHTML = "";

//     splitRemains =false;
// }


//------------------------------------------------check off cells in the schedule
function onClickTd (event){
    let td = event.target;
    td.classList.toggle("table-danger");  
}
//------------------------------------------------------MAIN1
function main1(){
    getInitialData ();
    showPreliminaryScheduleTable();
}

//------------------------------------------------------MAIN2
function main2(){
    createWeekFrame();
    emptyProgramSchedule();
    programSwitcher ();
    printScedule();
}
//------------------------------------------------------event listeners

document.getElementById('btnGgraphSchedule').addEventListener('click',main2);
document.getElementById('tableToShow').addEventListener('click',onClickTd);

document.getElementById('firstButton').addEventListener('click',main1);
document.getElementById('addProgram').addEventListener('click',createProgramsArray);