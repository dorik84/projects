// importing the sass stylesheet for bundling
// import "./../sass/styles.scss";

function main(){
    
    //----------------------------------------------declaration of varaibales
    let temp = document.getElementById('numberOfWeeksInSemestr').value;
    let numberOfWeeksInSemestr = temp? parseInt(temp) : 15;
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
    
    let blueprint = [];
    let param = {hoursLeft:0, nextWeek:false, nextCourse:false, programName:"",teacherName:""};
    let leftovers = {};
    let course;
    let program;
    let week;
    let classNumber;
    let NumberOfClassesAWeek;

    let givenProgramsArray = 
    [ 
    [   
        [60,"python","Sean"], [60,"html","Matt"], [60,"windows","Gord"], [60,"netw","Darlin"], [60,"sql","Gord"], [30,"comm1","Sheri"]     ],
    [   [60,"java","Sean"], [60,"serv","Matt"], [60,"proj","Matt"], [60,"js","Sean"], [60,"linux","Gord"],[30,"comm2","Sheri"]           
    ]    
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
    }
    //-----------------------------------------------------------------------------------------------------




    //-------------------------------Checking a number of classes of given course in current week
    function checkNumberOfClassesAWeek () {
        let count = 0;
        for(let day of param.progSchedule){
            for(let clas of day) {
                clas == param.programName ? count++ : count += 0;
            }
        }
        return count;  
    }
    //-----------------------------------------------------------------------------------------------------



    //----------------------------------------------------------------------Listing days within a current week
    function changeDay() {
        
        for (let dayOfAWeek = 0; dayOfAWeek < param.progSchedule.length; dayOfAWeek++){

            if (param.hoursLeft <= 0 ){
                param.nextCourse = true;
                return; // [0,true] hours ran out, need to swith course  
            } 

            // check if there is free space in the schedule to accommodate classes of current course    
            if (checkNumberOfClassesAWeek () >= NumberOfClassesAWeek) {
                param.nextWeek = true;
                return; // [1,true] hours still remain / need to switch week
                
            } else if ((param.progSchedule[dayOfAWeek][classNumber] == 0) && (param.teachSchedule[dayOfAWeek][classNumber] == 0)){
                param.progSchedule[dayOfAWeek][classNumber] = param.programName;
                param.teachSchedule[dayOfAWeek][classNumber] = param.teacherName;
                dayOfAWeek += schedulePattern;
                param.hoursLeft -= numberOfHoursInALesson;    
            } 
        }
    }
    //-----------------------------------------------------------------------------------------------------



    //---------------------------------------------Listing class order number from 8:30-10:30, 10:30-12:30, 13:30-15:30
    function changeClass() {
            
        for (classNumber=0; classNumber < maximumNumbersOfClassesADay; classNumber++) {

            changeDay();

            if (param.nextCourse || param.nextWeek) 
                return;
        }
    }   
    //-----------------------------------------------------------------------------------------------------



    //---------------------------------------------------------Change week
    function changeWeek(){
        
        for (week=0; week < numberOfWeeksInSemestr; week++) {    

            param.progSchedule = window["ScheduleForProgram" + program + week];
            param.teachSchedule = window[givenProgramsArray[program][course][2] + week];

            changeClass();

            param.nextWeek = false;
            if (param.nextCourse) 
                return;
        }
    }
    //-----------------------------------------------------------------------------------------------------




    //---------------------------------------------define Number Of Classes A Week
    function countNumberOfClassesAWeek (){
        
        let temp = param.hoursLeft / ( numberOfHoursInALesson * numberOfWeeksInSemestr );
        let remains = 0;

        if (Number.isInteger(temp)) { 
            NumberOfClassesAWeek = temp;

        } else {
            NumberOfClassesAWeek = Math.floor(temp);
            remains = leftovers[param.programName] = parseInt (param.hoursLeft % ( numberOfHoursInALesson * numberOfWeeksInSemestr ));
            console.log(remains);
        }
        return remains;
    }   
    //-----------------------------------------------------------------------------------------------------



    //-------------------------------Processor.  Entery point to schedule
    function allocator() {

        param.hoursLeft = givenProgramsArray[program][course][0];
        param.programName = givenProgramsArray[program][course][1];
        param.teacherName = givenProgramsArray[program][course][2];
        
        remains = countNumberOfClassesAWeek();

        param.hoursLeft -= remains;

        changeWeek();

        if (param.nextCourse) 
            return;
    }
    //-----------------------------------------------------------------------------------------------------



    //----------------------------------------Listing courses 
    function courseSwitcher () {

        for (course=0; course < givenProgramsArray[program].length; course++) {
            emptyTeacherSchedule ();
            allocator();
            param.nextCourse = false;
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
        blueprint = [];
        
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
            if (givenProgramsArray[numProg]) {
                
                for ( let numWeek=0; numWeek < numberOfWeeksInSemestr; numWeek++ ) {
                    window["ScheduleForProgram" + numProg + numWeek] = JSON.parse(JSON.stringify(blueprint)); 
                }
            }
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