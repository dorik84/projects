// importing the sass stylesheet for bundling
// import "./../sass/styles.scss";

function main(){
    
    //----------------------------------------------declaration of varaibales
    let temp = document.getElementById('numberOfWeeksInSemestr').value;
    let numberOfWeeksInSemestr = temp? parseInt(temp) : 4;
    document.getElementById('weeks').innerHTML = numberOfWeeksInSemestr;
    
    temp = document.getElementById('numberOfDaysAWeek').value;
    let numberOfDaysAWeek = temp? parseInt(temp) : 5;
    document.getElementById('days').innerHTML = numberOfDaysAWeek;

    temp = document.getElementById('maximumNumbersOfClassesADay').value;
    let maximumNumbersOfClassesADay = temp? parseInt(temp) : 3;
    document.getElementById('classes').innerHTML = maximumNumbersOfClassesADay;

    let schedulePattern = parseInt(document.querySelector('input[name="schedulePattern"]:checked').value);
    
    temp = document.getElementById('numberOfHoursInALesson').value;
    let numberOfHoursInALesson = temp? parseInt(temp) : 2;
    document.getElementById('hoursInLesson').innerHTML = numberOfHoursInALesson;

    let splitRemains = true;
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

    let NumberOfClassesAWeek;

    let teachSchedule;
    let progSchedule;

    let givenProgramsArray = 
    [ 
    [   [20,"python","Sean"], [16,"html","Matt"]/*, [60,"windows","Gord"], [60,"netw","Darlin"], [60,"sql","Gord"], [30,"comm1","Sheri"]     ],
    [   [60,"java","Sean"], [60,"serv","Matt"], [60,"proj","Matt"], [60,"js","Sean"], [60,"linux","Gord"],[30,"comm2","Sheri"]             ],
    [   [60,"java2","Sean"], [60,"serv2","Matt"], [60,"proj2","Matt"], [60,"js2","Sean"], [60,"linux2","Gord"],[30,"comm4","Sheri"],[30,"asd","Ketrine"]          */   ]      
    ];  
    //--------------------------------------------------------------------------------------------------


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
        // console.log(leftovers.python);
    }
    //-----------------------------------------------------------------------------------------------------




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



    //----------------------------------------------------------------------Listing days within a current week
    function changeDay() {
        
        for (let dayOfAWeek = startDay|0; dayOfAWeek < progSchedule.length; dayOfAWeek++){

            if (hoursLeft <= 0 ){
                if (splitRemains && leftovers[programName]>0) {
                    hoursLeft = leftovers[programName];
                    leftovers[programName] = 0;
                    NumberOfClassesAWeek+=1;
                    startDay = 4*schedulePattern;
                    if (hoursLeft == ( numberOfHoursInALesson * numberOfWeeksInSemestr )/2)
                        everySecondWeek = true;
                    changeWeek();
                }
                nextCourse = true;
                startDay = 0;
                return; // [0,true] hours ran out, need to swith course  
            } 

            // check if there is free space in the schedule to accommodate classes of current course    
            if (checkNumberOfClassesAWeek () >= NumberOfClassesAWeek) {
                nextWeek = true;
                return; // [1,true] hours still remain / need to switch week
                
            } else if ((progSchedule[dayOfAWeek][classNumber] == 0) && (teachSchedule[dayOfAWeek][classNumber] == 0)){
                progSchedule[dayOfAWeek][classNumber] = programName;
                teachSchedule[dayOfAWeek][classNumber] = teacherName;
                dayOfAWeek += schedulePattern;
                hoursLeft -= numberOfHoursInALesson;    
            } 
        }
    }
    //-----------------------------------------------------------------------------------------------------



    //---------------------------------------------Listing class order number from 8:30-10:30, 10:30-12:30, 13:30-15:30
    function changeClass() {
            
        for (classNumber=0; classNumber < maximumNumbersOfClassesADay; classNumber++) {

            changeDay();
            
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
             
            changeClass();
            if (everySecondWeek)
                week++;
            nextWeek = false;
            if (nextCourse) 
                return;
        }
    }
    //-----------------------------------------------------------------------------------------------------




    //---------------------------------------------define Number Of Classes A Week
    function countNumberOfClassesAWeek (){
        
        let temp = hoursLeft / ( numberOfHoursInALesson * numberOfWeeksInSemestr );
        let remains = 0;
        
        if (Number.isInteger(temp)) { 
            NumberOfClassesAWeek = temp;

        } else {
            NumberOfClassesAWeek = Math.floor(temp);
            remains = leftovers[programName] = parseInt (hoursLeft % ( numberOfHoursInALesson * numberOfWeeksInSemestr ));
            
            console.log(remains);
        }
        return remains;
    }   
    //-----------------------------------------------------------------------------------------------------



    //-------------------------------Processor.  Entery point to schedule
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



    //---------------------------------------------Create one empty week as frame
    function createWeekFrame (){
        
        for (let j = 0; j < numberOfDaysAWeek; j++ ) {
            let day = [];

            for (let i = 0; i < maximumNumbersOfClassesADay; i++ ) {    
                day.push(0);
            }
            blueprint = blueprint.concat([day]);
        }
        
    }
    //-----------------------------------------------------------------------------------------------------



    //----------------------------------------Create programs empty weeks for entire semester 
    function emptyProgramSchedule() {
        for ( let numProg=0; numProg < givenProgramsArray.length; numProg++ ) {
            // if (givenProgramsArray[numProg]) {
                
                for ( let numWeek=0; numWeek < numberOfWeeksInSemestr; numWeek++ ) {
                    window["ScheduleForProgram" + numProg + numWeek] = JSON.parse(JSON.stringify(blueprint)); 
                }
            // }
        }
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

    createWeekFrame();
    emptyProgramSchedule();
    programSwitcher ();
    printScedule();
}

main();