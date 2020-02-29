
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./../node_modules/bootstrap/dist/js/bootstrap.min.js";
import "./../node_modules/jquery/dist/jquery.min.js";
import "./../node_modules/popper.js/dist/popper.min.js";
import "./../node_modules/@fortawesome/fontawesome-free/css/all.css"
import "./../node_modules/@fortawesome/fontawesome-free/js/all.js"
import "./../sass/styles.scss";


    

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
let programCourses =[];




//-----------------------------------------------------------Show program info to user after pressing Create Program button
function printProgramsArray(){
    let output = document.getElementById('output');
    let tables = output.getElementsByTagName('table');

    //remove all tables in the output node
    tables = Array.from(tables);
    tables.forEach(child => {
        output.removeChild(child);
    })
    
    //build program table based on givenProgramsArray
    givenProgramsArray.forEach(program => {

        let table = document.createElement("TABLE");
        output.insertBefore(table,output.querySelector('div:nth-last-child(2)'));
        table.className += "table table-sm table-light table-bordered mb-3 mx-3";

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
                // cell.className += "w-25";
                cell.innerHTML = value;
                row.appendChild(cell);
            })
        })
    });
}
//---------------------------------------------------------------


//------------------------------------------------------------delete course upon pressing delete button
function onDeleteBtn(e){
    let table = e.target.parentElement.parentElement;
    let nodeList = document.getElementById('output').querySelectorAll('[class="table-warning"]');

    nodeList = Array.from(nodeList);
    nodeList= nodeList.map(tr=>tr.parentElement);

    let index = nodeList.indexOf(table); //retrieving index of deleted table
    
    programCourses.splice(index,1); // remove course array from array of courses

    document.getElementById('output').removeChild(table); //only visual deletion
}
//---------------------------------------------------------------


//------------------------------------------------------------show course info after users input
function printCourse(course) {
    
    let output = document.getElementById('output');
    let table = document.createElement("TABLE");
    table.className += "table table-sm table-light table-bordered border rounded mb-3 mx-3";
    //insert this course table in front of the input form
    output.insertBefore(table,output.querySelector('div:nth-last-child(2)'));

    let row = document.createElement("TR");
    table.appendChild(row);
    row.className += "table-warning";
    course.forEach(value => {
        let cell = document.createElement("TD");
        cell.className += "w-25";
        cell.innerHTML = value;
        row.appendChild(cell);
    })
    let btn = document.createElement("button");
    btn.className += "btn btn-danger btn-sm btn-block";
    btn.innerHTML = "delete";
    btn.setAttribute('type','button');
    row.appendChild(btn);
    //add event listener to each red "delete" button next to course
    btn.addEventListener('click',onDeleteBtn);
    
}
//-----------------------------------------------------------



//-----------------------------------------------------------add courses to program / create program
function createProgramsArray(){
    givenProgramsArray.push(programCourses);
    programCourses = [];
    printProgramsArray();
}
//-----------------------------------------------------------



//-----------------------------------------------------------get input from user (objects info)

function createCourseArray(){
    
    let course = [];
    let h = document.getElementById(`hours1`).value;
    let c = document.getElementById(`course1`).value;
    let t = document.getElementById(`teacher1`).value;
    if (h && c && t) {
        course.push(h, c, t);
        programCourses.push(course);
    } 
    printCourse(course);
}
//-----------------------------------------------------------


//--------------------------------------find the last distributed class of the current course in the current week
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


//-------------------------------Checking a number of already distributed classes of given course in the current week
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


//---------------------------------------------Listing class order number from first to last
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


//---------------------------------------------calculate number of classes a week for current object
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


//-----------------------------------------------------Processor. Entery point to schedule
function allocator() {

    hoursLeft = givenProgramsArray[program][course][0];
    programName = givenProgramsArray[program][course][1];
    teacherName = givenProgramsArray[program][course][2];
    
    let remains = countNumberOfClassesAWeek();

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


//----------------------------------------Create programs empty weeks for entire semester 
function emptyProgramSchedule() {
    for ( let numProg=0; numProg < givenProgramsArray.length; numProg++ ) {
            
            for ( let numWeek=0; numWeek < numberOfWeeksInSemestr; numWeek++ ) {
                window["ScheduleForProgram" + numProg + numWeek] = JSON.parse(JSON.stringify(blueprint)); 
            }
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


//---------------------------------------------Create one empty week as a template after recession notations 
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


//----------------------------------------------Show first visual empty schedule table for user
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


//-------------------------------------------------------initial input /get initial general data from the user
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


//------------------------------------------------checking off cells in the visual schedule to note recessions
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
    createDropdowns();
}

//------------------------------------------------------event listeners
document.getElementById('btnGgraphSchedule').addEventListener('click',main2);
document.getElementById('tableToShow').addEventListener('click',onClickTd);
document.getElementById('firstButton').addEventListener('click',main1);
document.getElementById('addProgram').addEventListener('click',createProgramsArray);
document.getElementById('addCourse').addEventListener('click',createCourseArray);
//----------------------------------------------------------------------------


//--------------------------------------------------------populate schedule tables with content
function populateScheduleTable(myArray){
    let lastForm = document.querySelectorAll('form')[3];



    let weekTable = document.getElementById('tableToShow').cloneNode(true);
    weekTable.removeAttribute("id");
    

    lastForm.appendChild(weekTable);
    
    let tbody = weekTable.querySelector('tbody');
    tbody.removeAttribute("id");
    
    for (let j = 0; j < myArray[0].length; j++ ) {

        for (let i = 0; i < myArray.length; i++ ) {  
            
            let cell = tbody.querySelector(`#cell${j}${i}`);
            
            cell.innerHTML = (myArray[i][j] != 0 && myArray[i][j] != 1)?myArray[i][j]:"";
        }
    }
}
//----------------------------------------------------------------------------


//---------------------------------------------------call populateScheduleTable according to users choice
function onChangeSelect(){
    
    let weekOptions = document.querySelector('#lastForm').querySelectorAll('select')[1];

    let weeks;
    // console.log(weekOptions);
  
    for (let option of weekOptions) {
        if (option.selected == true) weeks = option.value;
    };

    let program = document.querySelector('#lastForm').querySelectorAll('select')[0].selectedIndex;
    document.querySelectorAll('form')[3].innerHTML = "";

    for (let week=0; week < weeks; week++) {
        // console.log(window["ScheduleForProgram" + program + week]);
        populateScheduleTable(window["ScheduleForProgram" + program + week]);
    }

    for(let course=0; course < givenProgramsArray[program].length; course++){
        populateScheduleTable(window[givenProgramsArray[program][course][2] + 0]); 
    } 
}
//----------------------------------------------------------------------------



//--------------------------------------------------create weeks options dropdowns
function createDropdowns(){
    let lastForm = document.querySelector('#lastForm');
    lastForm.innerHTML = `
    <form class="form-inline">
        <label class="my-1 mr-2">Select program</label>
        <select class="custom-select my-1 mr-sm-2"></select>
        <label class="my-1 mr-2">Select weeks to show</label>
        <select class="custom-select my-1 mr-sm-2">
            <option value="1">One week</option>
            <option value="2">Two Weeks</option>
            <option value=\"${numberOfWeeksInSemestr}\">All weeks</option>
        </select>
    </form>`;

    let programOptions = lastForm.querySelectorAll('select')[0].options;

    for (let i = 0; i < givenProgramsArray.length; i++) {
        let option = document.createElement("option");
        option.innerHTML = i+1;
        programOptions.add(option);
    }

    lastForm.getElementsByTagName('select')[0].addEventListener('change',onChangeSelect);
    lastForm.getElementsByTagName('select')[1].addEventListener('change',onChangeSelect);
    onChangeSelect();
}
//----------------------------------------------------------------------------