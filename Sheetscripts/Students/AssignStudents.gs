//JSHint verified 9/29/2017 dicksontc
/**
 * @desc Main application for assigning students to their lunch tables each day.
 * @funtional - updated
 * @author - dicksontc
 */
function assignStudentLunchDays() {
  var docProps = PropertiesService.getDocumentProperties();
  var properties = docProps.getProperties();
  var primarySheetName = properties.studentData;
  var primary = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(primarySheetName);
  var teacherSheetName = properties.teacherChoices;
  var teacher = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(teacherSheetName);
  var lunchDays = JSON.parse(properties.lunchDays);
  
  var assignedLunches = [];
  var nonAssignedLunches = [];
  var lunchTimes = [];
  var lunchDaysList = [];
  var i,j,k,p;
  for(i = 0; i < lunchDays.length; i++){
    lunchDaysList.push(lunchDays[i].letter);
  }
  
  var times = lunchDays[0].times;
  for(i = 0; i < times.length; i++){
    lunchTimes.push(times[i]);
    if(times[i].assignedBy == "table"){
      assignedLunches.push(times[i]);
    }else if(times[i].assignedBy == "none" || times[i].assignedBy == "house"){
      nonAssignedLunches.push(times[i]);
    }
  }
  
  var primaryData = primary.getDataRange();
  var teacherData = teacher.getDataRange();
  
  var pValues = primaryData.getValues();
  var tValues = teacherData.getValues();
  
  var pNumRows = primaryData.getNumRows();
  var tNumRows = teacherData.getNumRows();
  
  var stu;
  
  var fullStudentsArray = [];
  var fullTeachersArray = [];
  var hasBeenUpdated = false;
  
  fullTeachersArray = getTeachers(tValues, tNumRows, properties);
  hasBeenUpdated = updateSheetWithFaculty(properties);
  pValues = primaryData.getValues();
  fullStudentsArray = getStudents(pValues, pNumRows, fullTeachersArray, assignedLunches, nonAssignedLunches, properties);
  
  var badStudentsAndTableAssignedTimes = addLunches(fullStudentsArray, lunchDays, lunchTimes, assignedLunches, nonAssignedLunches, properties);
  var tableAssignedTimesWithStudents = badStudentsAndTableAssignedTimes.tableAssignedTimes;
  var studentsWithTooManyLunches = badStudentsAndTableAssignedTimes.studentsOver;
  
  if(studentsWithTooManyLunches.length > 0){
    var message = "These Students have conflicting lunches:\n";
    for(i = 0; i < studentsWithTooManyLunches.length; i++){
      var bad = studentsWithTooManyLunches[i];
      message += "" + bad.fName + " " + bad.lName + ": " + bad.lunches.length + " lunches\n";
    }
    SpreadsheetApp.getUi().alert(message);
    return;
  }
  
  var assignedEachDay = [];
  var day;
  var time;
  for(i = 0; i < lunchDays.length; i++){
    day = lunchDays[i];
    assignedEachDay[i] = [];
    for(j = 0; j < day.times.length; j++){
      time = day.times[j];
      if(time.assignedBy === "table"){
        assignedEachDay[i].push({"day": day.letter, "time": time.name, "priority": time.priority,
        "timeInfo":{"numStuPerTable": time.numStuPerTable, "minTables": time.minTables, "maxTables": time.maxTables},
        "studentsInLunch": []});
      }
    }
  }
  
  for(i = 0; i < tableAssignedTimesWithStudents.length; i++){
    var studentsTables = tableAssignedTimesWithStudents[i].studentsTables;
    for(j = 0; j < studentsTables.length; j++){
      stu = studentsTables[j].stuAssigned;
      day = stu.lunches[studentsTables[j].lunchIndex].day;
      time = stu.lunches[studentsTables[j].lunchIndex].time;
      for(k = 0; k < assignedEachDay.length; k++){
        var numDays = assignedEachDay[k].length;
        for(p = 0; p < numDays; p++){
          if(assignedEachDay[k][p].day === day && assignedEachDay[k][p].time === time){
            assignedEachDay[k][p].studentsInLunch.push(studentsTables[j]);
            p = numDays;
            k = assignedEachDay.length;
          }
        }
      }
    }
  }
  //Checks to see if there are too many students in any lunch
  var badLunches = [];
  var timeObj, tooManyStudents, studentsOver;
     
  for(i = 0; i < assignedEachDay.length; i++){
    for(j = 0; j < assignedEachDay[i].length; j++){
      timeObj = assignedEachDay[i][j];
      tooManyStudents = tooManyStudentsInLunch(timeObj.timeInfo, timeObj.studentsInLunch);
      if(tooManyStudents){
        studentsOver = timeObj.studentsInLunch.length - timeObj.timeInfo.numStuPerTable * timeObj.timeInfo.maxTables;
        badLunches.push({"day": timeObj.day, "time": timeObj.time, "studentsOver": studentsOver});
      }
    }
  }
  if(badLunches.length > 0){
    var error = "";
    for(i = 0; i < badLunches.length; i++){
      error += " - " + badLunches[i].day + ":" + badLunches[i].time + " ( " + badLunches[i].studentsOver + " ), "; 
    }
    SpreadsheetApp.getUi().alert("Too many students in lunches " + error + " need to switch more classes(faculty) from that lunch. Number in () is number of students over lunch limit.");
    return;
  }
  
  var lengthCheck = tooFewStudentsInLunch(assignedEachDay, fullStudentsArray, assignedLunches, nonAssignedLunches, properties);

  if(lengthCheck.valid) {
    var ui = SpreadsheetApp.getUi();
    var result = ui.alert("Number of students moved from non-assigned lunches to assigned lunches: " + lengthCheck.numStu + "\nDo you want to assign students?", ui.ButtonSet.YES_NO);
    if(result == ui.Button.YES) {
      assignAndPrint(lengthCheck, assignedLunches, assignedEachDay, fullStudentsArray, primary, properties);
      return true;
    } 
  }
  return true;
}

/**
 * @desc Checks to see if there are enough students in each lunch, assigns the tables, and prints to the sheet
 * @params - lengthCheck - TRUE: the correct amount of students are in each lunch
 *           assignedLunches - the list of assigned lunches
 *           assignedEachDay - array containing the assigned lunches for each day and the students in them
 *           fullStudentsArray - the list of all students
 *           sheet - the sheet being printed to
 *           properties - the list of document properties
 * @funtional - updated
 * @author - dicksontc
 */
function assignAndPrint(lengthCheck, assignedLunches, assignedEachDay, fullStudentsArray, sheet, properties){
  var i, j;
  if(lengthCheck.valid){
    for(i = 0; i < assignedEachDay.length; i++){
      for(j = 0; j < assignedEachDay[i].length; j++){
        doRandomAssignment(assignedLunches, assignedEachDay[i][j], properties);
      }
    }
    printStudentsToSheet(fullStudentsArray, sheet, properties);
  }else{
    var errorMessage = "Not enough students in these lunches:\n";
    var badStudents = lengthCheck.badStudents;
    for(i = 0; i < badStudents.length; i++){
      errorMessage += "Day:" + badStudents[i].day + ", Time:" + badStudents[i].time + ", Number of Students needed:" + badStudents[i].numStu + "\n";
    }
    SpreadsheetApp.getUi().alert(errorMessage);
  }
  return true;
}

/**
 * @desc Checks to see if there are too few students in each assigned lunch. If there are, it assigns
 *       students with free periods to that lunch.
 * @params - assignedEachDay - array containing the assigned lunches for each day and the students in them
 *           fullStudentsArray - the list of all students
 *           assignedLunches - the list of assigned lunches
 *           nonAssignedLunches - the list of non-assigned lunches
 *           properties - the list of document properties
 * @return - false if there are too few students any lunch after moving free students into assigned lunches
 * @funtional - updated
 * @author - dicksontc
 */
function tooFewStudentsInLunch(assignedEachDay, fullStudentsArray, assignedLunches, nonAssignedLunches, properties){
  var timeObj;
  var timeInfo, studentsInLunch;
  var numStuPerTable, minTables;
  var badLunches = [];
  var valid = true;
  var needed;
  var i, j;
  var numStu = 0;
  for(i = 0; i < assignedEachDay.length; i++){
    for(j = 0; j < assignedEachDay[i].length; j++){
      timeObj = assignedEachDay[i][j];
      timeInfo = timeObj.timeInfo;
      studentsInLunch = timeObj.studentsInLunch;
      numStuPerTable = timeInfo.numStuPerTable;
      minTables = timeInfo.minTables;
      if(studentsInLunch.length < numStuPerTable * minTables){
        needed = (numStuPerTable * minTables) - studentsInLunch.length;
        numStu += needed;
        studentsInLunch = moveFromNonToAssigned(timeObj, fullStudentsArray, studentsInLunch, assignedLunches, nonAssignedLunches, needed, properties);
      }else if(studentsInLunch.length % numStuPerTable !== 0){
        needed = numStuPerTable - studentsInLunch.length % numStuPerTable;
        numStu += needed;
        studentsInLunch = moveFromNonToAssigned(timeObj, fullStudentsArray, studentsInLunch, assignedLunches, nonAssignedLunches, needed, properties);
      }
      if(studentsInLunch.length < numStuPerTable * minTables || studentsInLunch.length % numStuPerTable !== 0){
        valid = false;
        numStu = 0;
        badLunches.push({"numStu": numStuPerTable*minTables - studentsInLunch.length, "day": timeObj.day, "time": timeObj.time});
      }
    }
  }
  return {"valid":valid, "numStu": numStu, "badLunches": badLunches};
}

/**
 * @desc Checks to see if there are too many students in a lunch
 * @params - timeInfo - contains the number of students per table and the max tables in the lunch
 *           studentsInLunch - the list of students in the lunch
 * @return - true if there are too many students in that lunch, false otherwise
 * @funtional - updated
 * @author - dicksontc
 */
function tooManyStudentsInLunch(timeInfo, studentsInLunch){
  var numStuPerTable = timeInfo.numStuPerTable;
  var maxTables = timeInfo.maxTables;
  if(studentsInLunch.length > numStuPerTable * maxTables){
    return true;
  }else{
    return false;
  }
}

/**
 * @desc Gets all courses and their corresponding days from the courses sheet
 * @params - selected - the list of courses that are to be changed
 * @return - the course information for rescheduling
 * @funtional - updated
 * @author - dicksontc
 */
function getCourses(selected) {
  var docProps = PropertiesService.getDocumentProperties();
  var properties = docProps.getProperties();
  var coursesData = SpreadsheetApp
  .getActiveSpreadsheet()
  .getSheetByName(properties.courseSheet)
  .getDataRange()
  .getValues();
  
  var courses = {};
  var titles = {};
  for(var i = 0; i < coursesData.length; i++){
    var lunchTime = coursesData[i][4];
    var courseTitle = coursesData[i][0];
    var lunchDay = coursesData[i][3];
    var courseDayConcat = courseTitle + lunchDay;
    if(lunchTime !== "Lunch Time"){
      courseDayConcat = courseDayConcat.replace(/\s/g,'');
      courses[courseDayConcat] = lunchTime;
      titles[courseDayConcat] = {"title" : courseTitle, "day" : lunchDay, "time" : lunchTime};
    }
  }
  
  return {"courses": courses, "selected" : selected, "titles" : titles};
}

/**
 * @desc Finds the name of the faculty member whom teaches a course on a certain day
 * @params - course - the course in question
 *           day - the day the faculty teaches the course
 *           properties - the list of document properties
 * @return - the first and last name of the faculty member
 * @funtional - updated
 * @author - clemensam
 */
function findFacultyName(course, day, properties){
  
  var courseSheetProp = properties.courseSheet;
  var courseSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(courseSheetProp);
  
  var courseData = courseSheet.getDataRange();
  var values = courseData.getValues();
  var numRows = courseData.getNumRows();
  
  var lunchDayCol = parseInt(properties["Student Lunch Day"]);
  var courseTitleCol = parseInt(properties["Student Course Title"]);
  var facultyFirstNameCol = parseInt(properties["Student Faculty First Name"]);
  var facultyLastNameCol = parseInt(properties["Student Faculty Last Name"]);
  
  var facultyName = {};
  var i; 
  for(i = 0; i < numRows; i++){
    var courseTitle = values[i][courseTitleCol];
    var lunchDay = values[i][lunchDayCol];
    var facultyFirstName = values[i][facultyFirstNameCol];
    var facultyLastName = values[i][facultyLastNameCol];
    
    if(courseTitle === course && lunchDay === day) {
      facultyName.firstName = facultyFirstName;
      facultyName.lastName = facultyLastName;
      i = numRows;
    }
  }
  return facultyName;
}

/**
 * @desc Creates new sheet and pushes data to it containing course name, day, time, and faculty teaching the course
 * @funtional - updated
 * @author - clemensam
 */
function pushCoursesToCourseSheet() {
  var docProps = PropertiesService.getDocumentProperties();
  var properties = docProps.getProperties();
  var studentDataProp = properties.studentData;
  var primarySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(studentDataProp);
  
  var primaryData = primarySheet.getDataRange();
  var pValues = primaryData.getValues();
  var pNumRows = primaryData.getNumRows();
  
  var lunchDayCol = parseInt(properties["Student Lunch Day"]);
  var courseTitleCol = parseInt(properties["Student Course Title"]);
  var lunchTimeCol = parseInt(properties["Student Lunch Time"]);
  var facultyFirstNameCol = parseInt(properties["Student Faculty First Name"]);
  var facultyLastNameCol = parseInt(properties["Student Faculty Last Name"]);
  
  var headerRow = ["Course Title", "Lunch Day", "Lunch Time", "Faculty First Name", "Faculty Last Name"];
  var newData = [];
  var courses = [];
  var i; 
  for(i = 0; i < pNumRows; i++){
    var courseTitle = pValues[i][courseTitleCol];
    var lunchDay = pValues[i][lunchDayCol];
    var lunchTime = pValues[i][lunchTimeCol];
    var facultyFirstName = pValues[i][facultyFirstNameCol];
    var facultyLastName = pValues[i][facultyLastNameCol];
    
    var newRow = [courseTitle, facultyFirstName, facultyLastName, lunchDay, lunchTime];
    
    var courseDayTimeConcat = courseTitle + lunchDay + lunchTime;
    
    if((courses.indexOf(courseDayTimeConcat) < 0) && (facultyFirstName !== '' && facultyLastName !== '')) {
      courses.push(courseDayTimeConcat);
      newData.push(newRow);
    }
  }
  
  newData = newData.slice(0, 1).concat(newData.slice(1, newData.length).sort());
  
  createNewSheet(newData, "Courses");
  return true;
}

/*
 * @desc - creates new sheet and pushes data to it containing course name, day, time, and faculty teaching the course
 * @author - clemensam
 */
 function pushCoursesToCourseSheet() {
   var docProps = PropertiesService.getDocumentProperties();
   var properties = docProps.getProperties();
   var studentDataProp = properties.studentData;
   var primarySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(studentDataProp);
   
   var primaryData = primarySheet.getDataRange();
   var pValues = primaryData.getValues();
   var pNumRows = primaryData.getNumRows();
 
   var lunchDayCol = parseInt(properties["Student Lunch Day"]);
   var courseTitleCol = parseInt(properties["Student Course Title"]);
   var lunchTimeCol = parseInt(properties["Student Lunch Time"]);
   var facultyFirstNameCol = parseInt(properties["Student Faculty First Name"]);
   var facultyLastNameCol = parseInt(properties["Student Faculty Last Name"]);
   
   var headerRow = ["Course Title", "Lunch Day", "Lunch Time", "Faculty First Name", "Faculty Last Name"];
   var newData = [];
   var courses = [];
   var i; 
   for(i = 0; i < pNumRows; i++){
     var courseTitle = pValues[i][courseTitleCol];
     var lunchDay = pValues[i][lunchDayCol];
     var lunchTime = pValues[i][lunchTimeCol];
     var facultyFirstName = pValues[i][facultyFirstNameCol];
     var facultyLastName = pValues[i][facultyLastNameCol];
     
     var newRow = [courseTitle, facultyFirstName, facultyLastName, lunchDay, lunchTime];
     
     var courseDayTimeConcat = courseTitle + lunchDay + lunchTime;
     
      if((courses.indexOf(courseDayTimeConcat) < 0) && (facultyFirstName !== '' && facultyLastName !== '')) {
       courses.push(courseDayTimeConcat);
       newData.push(newRow);
     }
   }
   
   newData = newData.slice(0, 1).concat(newData.slice(1, newData.length).sort());
   
   createNewSheet(newData, "Courses");
   return true;
 }

/**
 * @desc Updates the final student sheet with faculty information for the middle school students
 * @params - properties - the list of document properties
 * @funtional - updated
 * @author - clemensam
 */
 function updateSheetWithFaculty(properties) {
   var studentDataProp = properties.studentData;
   var primarySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(studentDataProp);
   
   var primaryData = primarySheet.getDataRange();
   var pValues = primaryData.getValues();
   var pNumRows = primaryData.getNumRows();
   
   //["First Name","Last Name","Grade Level","Advisor","Gender","Course Title","Course Code","Course Length","Course ID","Section Identifier","Faculty First Name","Faculty Last Name","Block","Date of Birth","Table Head","Lunch Day","Lunch Time","Lunch Table","House"]
 
   var firstNameCol = parseInt(properties["Student First Name"]);
   var lastNameCol = parseInt(properties["Student Last Name"]);
   var gradeLevelCol = parseInt(properties["Student Grade Level"]);
   var advisorCol = parseInt(properties["Student Advisor"]);
   var genderCol = parseInt(properties["Student Gender"]);
   var courseTitleCol = parseInt(properties["Student Course Title"]);
   var courseCodeCol = parseInt(properties["Student Course Code"]);
   var courseLengthCol = parseInt(properties["Student Course Length"]);
   var courseIDCol = parseInt(properties["Student Course ID"]);
   var sectionIdentifierCol = parseInt(properties["Student Section Identifier"]);
   var facultyFirstNameCol = parseInt(properties["Student Faculty First Name"]);
   var facultyLastNameCol = parseInt(properties["Student Faculty Last Name"]);
   var blockCol = parseInt(properties["Student Block"]);
   var dobCol = parseInt(properties["Student Date of Birth"]);
   var tableHeadCol = parseInt(properties["Student Table Head"]);
   var lunchDayCol = parseInt(properties["Student Lunch Day"]);
   var lunchTimeCol = parseInt(properties["Student Lunch Time"]);  
   var lunchTableCol = parseInt(properties["Student Lunch Table"]);
   var houseCol = parseInt(properties["Student House"]);
  
   var updatedRow = [];
   var i; 
   for(i = 0; i < pNumRows; i++){
     var firstName = pValues[i][firstNameCol];
     var lastName = pValues[i][lastNameCol];
     var gradeLevel = pValues[i][gradeLevelCol];
     var advisor = pValues[i][advisorCol];
     var gender = pValues[i][genderCol];
     var courseTitle = pValues[i][courseTitleCol];
     var courseCode = pValues[i][courseCodeCol];
     var courseLength = pValues[i][courseLengthCol];
     var courseID = pValues[i][courseIDCol];
     var sectionIdentifier = pValues[i][sectionIdentifierCol];
     var facultyFirstName = pValues[i][facultyFirstNameCol];
     var facultyLastName = pValues[i][facultyLastNameCol];
     var block = pValues[i][blockCol];
     var dob = pValues[i][dobCol];
     var tableHead = pValues[i][tableHeadCol];
     var lunchDay = pValues[i][lunchDayCol];
     var lunchTime = pValues[i][lunchTimeCol]; 
     var lunchTable = pValues[i][lunchTableCol];
     var house = pValues[i][houseCol];
     
     if((facultyFirstName === "" || facultyFirstName === undefined) && (facultyLastName === "" || facultyLastName === undefined) && (courseTitle.indexOf('z') !== 0)) {
       var facultyName = findFacultyName(courseTitle, lunchDay, properties);
       facultyFirstName = facultyName.firstName;
       facultyLastName = facultyName.lastName; 
       updatedRow = [[firstName, lastName, gradeLevel, advisor, gender, courseTitle, courseCode, courseLength, courseID, sectionIdentifier, facultyFirstName, facultyLastName, block, dob, tableHead, lunchDay, lunchTime, lunchTable, house]];
       var sheetRange = primarySheet.getRange(i+1, 1, 1, 19);
       sheetRange.setValues(updatedRow);
     }
   }
   return true;
 }
 

/**
 * @desc Uses the students and changes arrays to change student schedules
 * @params - listOfChanges - the list of changes to be made
 * @return - changesToBeReturned - the list of changes made
 * @funtional - updated
 * @author - dicksontc
 */
function parseStudentChanges(listOfChanges){
  var docProps = PropertiesService.getDocumentProperties();
  var properties = docProps.getProperties();
  var studentDataProp = properties.studentData;
  var teacherChoicesProp = properties.teacherChoices;
  var primarySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(studentDataProp);
  var teacher = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(teacherChoicesProp);
  var lunchDays = JSON.parse(properties.lunchDays);
  
  var primaryData = primarySheet.getDataRange();
  var teacherData = teacher.getDataRange();
  
  var pValues = primaryData.getValues();
  var tValues = teacherData.getValues();
  
  var pNumRows = primaryData.getNumRows();
  var tNumRows = teacherData.getNumRows();
  
  var students = [];
  var changes = listOfChanges;
  var teachers = [];
  var changesToBeReturned = [];
  
  var i,j,k,p,x;
  var newTable;
  var oldtime;
  var newtime;
  var assignedLunches = [];
  var nonAssignedLunches = [];
  var lunchTimes = [];
  var lunchDaysList = [];
  for(i = 0; i < lunchDays.length; i++){
    lunchDaysList.push(lunchDays[i].letter);
  }
  
  var times = lunchDays[0].times;
  for(i = 0; i < times.length; i++){
    lunchTimes.push(times[i]);
    if(times[i].assignedBy == "table"){
      assignedLunches.push(times[i]);
    }else if(times[i].assignedBy == "none" || times[i].assignedBy == "house"){
      nonAssignedLunches.push(times[i]);
    }
  }
  
  teachers = getTeachers(tValues, tNumRows, properties);
  students = getStudents(pValues, pNumRows, teachers, assignedLunches, nonAssignedLunches, properties);
  
  for(i = 0; i < students.length; i++){
    assignZScore(students[i], properties, lunchTimes);
  }
  if(changes.length > 0){
    for(i = 0; i < changes.length; i++){
      var change = changes[i];
      oldtime = change.oldTime;
      newtime = change.newTime;
      for(j = 0; j < students.length; j++){
        var stu = students[j];
        if(change.fName.toString().toLowerCase() === stu.fName.toString().toLowerCase() && change.lName.toString().toLowerCase() === stu.lName.toString().toLowerCase()){
          for(k = 0; k < stu.lunches.length; k++){
            var lunch = stu.lunches[k];
            if(lunch.day === change.oldDay){
              if(oldtime !== newtime){
                var oldAssigned = true;
                var newAssigned = true;
                var oldNum = -1;
                var newNum = -1;
                var oldTimeObj;
                var newTimeObj;
                for(p = 0; p < nonAssignedLunches.length; p++){
                  if(oldtime === nonAssignedLunches[p].name){
                    oldAssigned = false;
                    oldNum = p;
                    oldTimeObj = nonAssignedLunches[p];
                  }
                  if(newtime === nonAssignedLunches[p].name){
                    newAssigned = false;
                    newNum = p;
                    newTimeObj = nonAssignedLunches[p];
                  }
                }
                if(!oldAssigned && !newAssigned){
                  students[j].lunches[k].time = newtime;
                  if(nonAssignedLunches[newNum].by === "none"){
                    students[j].lunches[k].table = "";
                    newTable = "";
                  }else if(nonAssignedLunches[newNum].by === "house"){
                    students[j].lunches[k].table = stu.house;
                    newTable = stu.house;
                  }
                  students[j].lunches[k].teacherFName = change.facultyFName;
                  students[j].lunches[k].teacherLName = change.facultyLName;
                  students[j].lunches[k].title = change.newCourseName;
                  changesToBeReturned.push([change.fName, change.lName, lunch.day, change.newCourseName, change.oldCourseName, oldtime, newtime, change.oldTable, newTable]);
                }else{
                  var affectedStu;
                  var affectedLunch;
                  var day = change.oldDay;
                  for(x = 0; x < assignedLunches.length; x++){
                    if(newtime === assignedLunches[x].name){
                      newTimeObj = assignedLunches[x];
                      x = assignedLunches.length;
                    }
                  }
                  var zScoreStudents = getzScoreStudents(students, day, newTimeObj.name, false);
                  
                  if(zScoreStudents.length === 0){
                    return;
                  }
                  affectedLunch = zScoreStudents[0].lunchIndex;
                  affectedStu = zScoreStudents[0].stuIndex;
                  
                  var affectedTableOld;
                  var affectedTableNew;
                  if(oldAssigned){
                    students[j].lunches[k].time = newtime;
                    if(newTimeObj.assignedBy === "none"){
                      students[j].lunches[k].table = "";
                      newTable = "";
                    }else if(newTimeObj.assignedBy === "table"){
                      students[j].lunches[k].table = students[j].house;
                      newTable = students[j].house;
                    }
                    students[affectedStu].lunches[affectedLunch].time = oldtime;
                    affectedTableOld = students[affectedStu].lunches[affectedLunch].table;
                    affectedTableNew = change.oldTable;
                    students[affectedStu].lunches[affectedLunch].table = change.oldTable;
                    
                  }else if(newAssigned){
                    students[j].lunches[k].time = newtime;
                    newTable = students[affectedStu].lunches[affectedLunch].table;
                    students[j].lunches[k].table = newTable;
                    students[affectedStu].lunches[affectedLunch].time = oldtime;
                    affectedTableOld = students[affectedStu].lunches[affectedLunch].table;
                    if(oldTimeObj.assignedBy === "none"){
                      students[affectedStu].lunches[affectedLunch].table = "";
                      affectedTableNew = "";
                    }else if(oldTimeObj.assignedBy === "house"){
                      students[affectedStu].lunches[affectedLunch].table = students[affectedStu].house;
                      affectedTableNew = students[affectedStu].house;
                    }
                  }
                  students[j].lunches[k].teacherFName = change.facultyFName;
                  students[j].lunches[k].teacherLName = change.facultyLName;
                  students[j].lunches[k].title = change.newCourseName;
                  assignZScore(students[affectedStu], properties, lunchTimes);
                  changesToBeReturned.push([change.fName, change.lName, lunch.day, change.newCourseName, change.oldCourseName, oldtime, newtime, change.oldTable, newTable]);
                  changesToBeReturned.push([students[affectedStu].fName, students[affectedStu].lName, lunch.day, "", "", newtime, oldtime, affectedTableOld, affectedTableNew]);
                }
                assignZScore(students[j], properties, lunchTimes);
              }else{
                students[j].lunches[k].teacherFName = change.facultyFName;
                students[j].lunches[k].teacherLName = change.facultyLName;
                students[j].lunches[k].title = change.newCourseName;
                changesToBeReturned.push([change.fName, change.lName, lunch.day, change.newCourseName, change.oldCourseName, oldtime, newtime, change.oldTable, change.oldTable]);
              }
              if(students[j].lunches[k].isItzScore === true){
                students[j].lunches[k].isItzScore = false;
              }
              if(students[j].lunches[k].isItzScore === true){
                students[j].lunches[k].isItzScore = false;
              }
              k = stu.lunches.length;
            }
          }
          j = students.length;
        }
      }
    }
    printStudentsToSheet(students, primarySheet, properties);
  }
  return changesToBeReturned;
}

/**
 * @desc Changes the students with the lowest zScores' lunch times to the assigned lunch
 *         with fewer than the required amount of students for a specific day
 * @params - day - the day of the assigned lunch that needs more students
 *           students - the list of all the students at USM
 *           dayStudents - the list of students in the assigned lunch for that day
 *           lunchTime - the assigned lunch time that needs students
 *           properties - the list of document properties
 * @return - dayStudents - the list of students in the assigned lunch for that day
 * @funtional - updated
 * @author - dicksontc
 */
function moveFromNonToAssigned(lunchTime, students, dayStudents, assignedLunches, nonAssignedLunches, needed, properties){
  var day = lunchTime.day;
  var lunchPriority = lunchTime.priority;
  var zScoreStudents = getzScoreStudents(students, day, lunchTime, true);
  var i;
  var oldPriority;
  
  while(needed > 0){
    if(zScoreStudents.length > 0){
      var student = zScoreStudents[0].stu;
      var lunchIndex = zScoreStudents[0].lunchIndex;
      var oldTime = student.lunches[lunchIndex].time;
      var lunchCheck = true;
      for(i = 0; i < assignedLunches.length; i++){
        if(oldTime === assignedLunches[i].name){
          lunchCheck = false;
          i = assignedLunches.length;
        }
      }
      if(lunchCheck){
        for(i = 0; i < nonAssignedLunches.length; i++){
          if(oldTime === nonAssignedLunches[i].name){
            oldPriority = nonAssignedLunches[i].priority;
            i = nonAssignedLunches.length;
          }
        }
        var numTimes = assignedLunches.length + nonAssignedLunches.length;
        var newZScore =  student.zScore + (Math.pow(10, numTimes - lunchPriority)) - (Math.pow(10, numTimes - oldPriority));
        student.lunches[lunchIndex].time = lunchTime.time;
        student.zScore = newZScore;
        dayStudents.push({"stuAssigned": student, "lunchIndex": lunchIndex});
        needed--;
      }
      zScoreStudents = zScoreStudents.slice(1, zScoreStudents.length);
    }else{
      needed = 0;
    }
  }
  return dayStudents;
}

/**
 * @desc Randomly assigns a lunch table to the students who have assigned lunches
 * @params - pAssignedLunch - the lunch and list of students that is assigned
 *           properties - the list of document properties
 * @funtional - updated
 * @author - dicksontc
 */
function doRandomAssignment(assignedLunches, lunchTime, properties){  
  var gLess = [];
  var gNine = [];
  var gTen = [];
  var gEleven = [];
  var gTwelve = [];
  var nums;
  var numIndex = -1;
  var students = lunchTime.studentsInLunch;
  var numStudents = students.length;
  var stuPerTable = lunchTime.timeInfo.numStuPerTable;
  var i;
  
  for(i = 0; i < numStudents; i++){
    var student = students[i].stuAssigned;
    var grade = student.grade;
    if(grade === 9){
      gNine.push(students[i]);
    }else if(grade === 10){
      gTen.push(students[i]);
    }else if(grade === 11){
      gEleven.push(students[i]);
    }else if(grade === 12){
      gTwelve.push(students[i]);
    }else{
      gLess.push(students[i]);
    }
  }
  
  nums = populateTablesArray(numStudents, stuPerTable, properties);

  shuffleArray(gLess);
  shuffleArray(gNine);
  shuffleArray(gTen);
  shuffleArray(gEleven);
  shuffleArray(gTwelve);
  numIndex = randomlyAssign(gLess, numIndex, nums);
  numIndex = randomlyAssign(gNine, numIndex, nums);
  numIndex = randomlyAssign(gTen, numIndex, nums);
  numIndex = randomlyAssign(gEleven, numIndex, nums);
  numIndex = randomlyAssign(gTwelve, numIndex, nums);
  return true;
}

/**
 * @desc Randomly assigns a lunch table to the students in a particular lunch
 * @params - gradeArray - the students to be assigned lunch on a particular day
 *           indexNum - the current index of the numbers array
 *           numberArray - the array holding the available table numbers
 * @return - indexNum - the current index of the numbers array
 * @funtional - updated
 * @author - dicksontc
 */
function randomlyAssign(gradeArray, indexNum, numberArray){
  var student;
  var lunch;
  var i;
  for(i = 0; i < gradeArray.length; i++){
    indexNum++;
    student = gradeArray[i].stuAssigned;
    lunch = gradeArray[i].lunchIndex;
    student.lunches[lunch].table = numberArray[indexNum];
  }
  return indexNum;
}

/**
 * @desc Creates teacher array filled with teacher information.
 * @params - tValues - the array of the teachers rows and columns
 *           tNumRows - the number of rows in the faculty choices list
 *           properties - the list of document properties
 * @return - teachers - the list of teachers that was generated
 * @funtional - updated
 * @author - dicksontc
 */
function getTeachers(tValues, tNumRows, properties){
  var teachers = [];
  var fNameCol = parseInt(properties["Teacher First Name"]);
  var lNameCol = parseInt(properties["Teacher Last Name"]);
  var lunchTimeCol = parseInt(properties["Teacher Lunch Assignment"]);
  var lunchDayCol = parseInt(properties["Teacher Lunch Day"]);
  var houseCol = parseInt(properties["Teacher House"]);
  var i, j;
  
  for(i = 0; i < tNumRows; i++){
    var fname = tValues[i][fNameCol];
    var lname = tValues[i][lNameCol];
    var time = tValues[i][lunchTimeCol];
    var day = tValues[i][lunchDayCol];
    var house = tValues[i][houseCol];
    if(teachers.length === 0){
      teachers.push({"fName": fname, "lName": lname, "lunches": [{"day": day, "time": time}], "house": house});
    }else{
      for(j = 0; j < teachers.length; j++){
        if(teachers[j].fName === fname && teachers[j].lName === lname){
          teachers[j].lunches.push({"day": day, "time": time});
          j = teachers.length;
        }
        if(j === teachers.length - 1){
          teachers.push({"fName": fname, "lName": lname, "lunches": [{"day": day, "time": time}], "house": house});
          j = teachers.length;
        }
      }
    }
  }
  return teachers;
}

/**
 * @desc Shuffles a given array
 * @params - array - the array to be shuffled
 * @funtional - updated
 * @author - dicksontc
 */
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--){
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return true;
}

/**
 * @desc Creates an array of all the students who have a free period
 * @params - students - the array of students
 *           day - the day of the lunch that has the needed students
 *           time - the lunch time that the students cannot be from
 * @return - zScoreStudents - the list of students who have a free period on a
 *             certain day and at any time other than the listed one
 * @funtional - updated
 * @author - dicksontc
*/
function getzScoreStudents(students, day, time, bool){
  var zScoreStudents = [];
  var lunchBool;
  for(var i = 0; i < students.length; i++){
    var student = students[i];
    for(var j = 0; j < student.lunches.length; j++){
      if(bool){
        lunchBool = student.lunches[j].time !== time;
      }else{
        lunchBool = student.lunches[j].time === time;
      }
      if(student.lunches[j].day === day && lunchBool){
        if(student.lunches[j].isItzScore){
          zScoreStudents.push({"stu": student, "lunchIndex": j, "stuIndex": i});
        }
        j = student.lunches.length;
      }
    }
  }
  zScoreStudents.sort(function(a, b) {
    return parseFloat(a.stu.zScore) - parseFloat(b.stu.zScore);
  });
  
  return zScoreStudents;
}

/**
 * @desc Uses the students array to print all student information to primary sheet
 * @params - students - the array of students
 *           primary - the sheet the students are being printed to
 *           properties - the list of document properties
 * @funtional - updated
 * @author - dicksontc
 */
function printStudentsToSheet(students, primary, properties){
  var pushArray;
  var finalArray = [];
  var count = 0;
  
  var sFNameCol = parseInt(properties["Student First Name"]);
  var sLNameCol = parseInt(properties["Student Last Name"]);
  var gradeCol = parseInt(properties["Student Grade Level"]);
  var houseCol = parseInt(properties["Student House"]);
  var lunchDayCol = parseInt(properties["Student Lunch Day"]);
  var lunchTableCol = parseInt(properties["Student Lunch Table"]);
  var tFNameCol = parseInt(properties["Student Faculty First Name"]);
  var tLNameCol = parseInt(properties["Student Faculty Last Name"]);
  
  var advisorCol = parseInt(properties["Student Advisor"]);
  var cCodeCol = parseInt(properties["Student Course Code"]);
  var cLengthCol = parseInt(properties["Student Course Length"]);
  var cIDCol = parseInt(properties["Student Course ID"]);
  var sIDCol = parseInt(properties["Student Section Identifier"]);
  var blockCol = parseInt(properties["Student Block"]);
  var dobCol = parseInt(properties["Student Date of Birth"]);
  var tableHeadCol = parseInt(properties["Student Table Head"]);
  var cTitleCol = parseInt(properties["Student Course Title"]);
  var lunchTimeCol = parseInt(properties["Student Lunch Time"]);
  var genderCol = parseInt(properties["Student Gender"]);
  var numRows = primary.getDataRange().getNumColumns();
  
  for(var post = 0; post < students.length; post++){
    var fin = students[post];
    var gender = fin.gender;
    var advisor = fin.advisor;
    var zScore = "z" + fin.zScore;
    var dob = fin.dob;
    if(dob instanceof Date){
      dob = "" + dob.getMonth() + "/" + dob.getDay() + "/" + dob.getFullYear();
    }
    for(var lun = 0; lun < fin.lunches.length; lun++) {
      count++;
      var lunch = fin.lunches[lun];
      var title = lunch.title;
      
      pushArray = new Array(numRows);
      
      pushArray[sFNameCol] = fin.fName;
      pushArray[sLNameCol] = fin.lName;
      pushArray[gradeCol] = fin.grade;
      pushArray[houseCol] = fin.house;
      pushArray[lunchDayCol] = lunch.day;
      pushArray[lunchTimeCol] = lunch.time;
      pushArray[lunchTableCol] = lunch.table;
      pushArray[genderCol] = gender;
      pushArray[advisorCol] =  advisor;
      pushArray[dobCol] = dob;
      if(title === undefined || title === "" || (title.length === 4 && title.indexOf("z") === 0)){
        pushArray[cTitleCol] =  zScore;
        pushArray[cCodeCol] =  "";
        pushArray[cLengthCol] = "";
        pushArray[cIDCol] =  "";
        pushArray[sIDCol] = "";
        pushArray[tFNameCol] = "";
        pushArray[tLNameCol] = "";
        pushArray[blockCol] = "";
        pushArray[tableHeadCol] = "";
      }else{
        pushArray[cTitleCol] =  title;
        pushArray[cCodeCol] =  lunch.code;
        pushArray[cLengthCol] = lunch.length;
        pushArray[cIDCol] =  lunch.cID;
        pushArray[sIDCol] = lunch.sID;
        pushArray[tFNameCol] = lunch.teacherFName;
        pushArray[tLNameCol] = lunch.teacherLName;
        pushArray[blockCol] = lunch.block;
        pushArray[tableHeadCol] = lunch.tableHead;
      }
      for(var i = 0; i < pushArray.length; i++){
        if(pushArray[i] === null || pushArray[i] === undefined){
          pushArray[i] = "";
        }
      }
      finalArray.push(pushArray);
    }
  }
  primary.clear();
  var sheetRange = primary.getRange(1, 1, count, numRows);
  sheetRange.setValues(finalArray);
  colorBackgrounds(lunchTimeCol, properties);
  colorBackgrounds(lunchTableCol, properties);
  return true;
}

/**
 * @desc Creates student array filled with student information.
 * @params - studentValues - the array of the students rows and columns
 *           numRows - the number of rows in the final student data list
 *           teachersList - the list of teachers
 *           properties - the list of document properties
 * @return - newStudentsList - the list of students that was generated
 * @funtional - updated
 * @author - dicksontc
 */
function getStudents(studentValues, numRows, teachersList, assignedLunches, nonAssignedLunches, properties){
  var newStudentsList = [];
  
  var sFNameCol = parseInt(properties["Student First Name"]);
  var sLNameCol = parseInt(properties["Student Last Name"]);
  var gradeCol = parseInt(properties["Student Grade Level"]);
  var houseCol = parseInt(properties["Student House"]);
  var lunchDayCol = parseInt(properties["Student Lunch Day"]);
  var lunchTableCol = parseInt(properties["Student Lunch Table"]);
  var tFNameCol = parseInt(properties["Student Faculty First Name"]);
  var tLNameCol = parseInt(properties["Student Faculty Last Name"]);
  
  var advisorCol = parseInt(properties["Student Advisor"]);
  var cCodeCol = parseInt(properties["Student Course Code"]);
  var cLengthCol = parseInt(properties["Student Course Length"]);
  var cIDCol = parseInt(properties["Student Course ID"]);
  var sIDCol = parseInt(properties["Student Section Identifier"]);
  var blockCol = parseInt(properties["Student Block"]);
  var dobCol = parseInt(properties["Student Date of Birth"]);
  var tableHeadCol = parseInt(properties["Student Table Head"]);
  var cTitleCol = parseInt(properties["Student Course Title"]);
  var lunchTimeCol = parseInt(properties["Student Lunch Time"]);
  var genderCol = parseInt(properties["Student Gender"]);
  
  var i, j;
  
  for(i = 0; i < numRows; i++){
    var day = studentValues[i][lunchDayCol];
    var fname = studentValues[i][sFNameCol];
    var lname = studentValues[i][sLNameCol];
    var grad = studentValues[i][gradeCol];
    var house = studentValues[i][houseCol];
    var table = studentValues[i][lunchTableCol];
    var teacherFName = studentValues[i][tFNameCol];
    var teacherLName = studentValues[i][tLNameCol];
    var advisor = studentValues[i][advisorCol].replace(/\s\s+/g, " ").trim();
    if(advisor.indexOf(",") > -1){
      var advisorArray = advisor.split(",");
      if(advisorArray.length === 2){
        advisor = "" + advisorArray[1].trim() + " " + advisorArray[0].trim();
      }
    }
    var code = studentValues[i][cCodeCol];
    var length = studentValues[i][cLengthCol];
    var cID = studentValues[i][cIDCol];
    var sID = studentValues[i][sIDCol];
    var block = studentValues[i][blockCol];
    var dob = studentValues[i][dobCol];
    var tableHead = studentValues[i][tableHeadCol];
    var gender = studentValues[i][genderCol];
    var title = studentValues[i][cTitleCol];
    var time = studentValues[i][lunchTimeCol];
    
    var zScoreCheckAndTime = getLunchTimeAndZCheckBasedOnTeacher(teacherFName, teacherLName, time, day, teachersList, assignedLunches, nonAssignedLunches, properties);
    time = zScoreCheckAndTime.time;
    var zCheck = zScoreCheckAndTime.zCheck;
    if(grad !== ""){
      
      if(fname != "First Name" && lname != "Last Name"){
        house = getHouseForStudent(advisor, teachersList);
      }
      
      var lunchObj = {"day": day, "time": time, "isItzScore": zCheck, "table": table, "code": code,
                      "length": length, "cID": cID, "sID": sID, "block": block, "tableHead": tableHead, "title": title,
                      "teacherFName": teacherFName, "teacherLName": teacherLName};
      
      if(newStudentsList.length === 0){
        newStudentsList.push({"fName": fname, "lName": lname, "grade": grad, "lunches": [lunchObj], "zScore": 0, "house": house,
                              "advisor": advisor, "dob": dob, "gender": gender});
      }else{
        for(j = 0; j < newStudentsList.length; j++){
          if(newStudentsList[j].fName === fname && newStudentsList[j].lName === lname){
            newStudentsList[j].lunches.push(lunchObj);
            j = newStudentsList.length;
          }
          if(j === newStudentsList.length - 1){
            newStudentsList.push({"fName": fname, "lName": lname, "grade": grad, "lunches": [lunchObj], "zScore": 0, "house": house,
                                  "advisor": advisor, "dob": dob, "gender": gender});
            j = newStudentsList.length;
          }
        }
      }
    }
  }
  return newStudentsList;
}

/**
 * @desc Finds the lunch time of the teacher that the student has for a specific lunch period
 * @params - advisor - the name of the student's advisor,
 *           teachersList - the list of teachers
 * @return - house - the house of the student
 * @funtional - updated
 * @author - dicksontc
 */
function getHouseForStudent(advisor, teachersList){
  var house;
  var i;
  var teacher;
  
  for(i = 0; i < teachersList.length; i++){
    teacher = teachersList[i];
    if(advisor === (teacher.fName + " " + teacher.lName)){
      house = teacher.house;
    }
  }
  return house;
}

/**
 * @desc Finds the lunch time of the teacher that the student has for a specific lunch period
 * @params - firstName - the first name of the teacher,
 *           lastName - the last name of the teacher,
 *           time - the time associated with the students lunch
 *           day - the letter of the day the student has the specific lunch
 *           teachersList - the list of teachers
 *           properties - the list of document properties
 * @return - zCheckAndTime - an object that contains a boolean to check whether or not the student's lunch
 *             is a free period and the lunch time of the student's lunch
 * @funtional - updated
 * @author - dicksontc
 */
function getLunchTimeAndZCheckBasedOnTeacher(firstName, lastName, time, day, teachersList, assignedLunches, nonAssignedLunches, properties){
  var zCheck = false;
  var i, j;
  var zCheckAndTime;
  
  for(i = 0; i < teachersList.length; i++){
    var teacher = teachersList[i];
    
    if(firstName === "" && lastName === ""){
      zCheck = true;
      i = teachersList.length;
      var bool = true;
      for(j = 0; j < assignedLunches.length; j++){
        if(time === assignedLunches[j].name){
          bool = false;
          j = assignedLunches.length;
        }
      }
      if(bool){
        time = nonAssignedLunches[0].name;
      }
    }else if(teacher.fName === firstName && teacher.lName === lastName){
      for(j = 0; j < teacher.lunches.length; j++){
        if(teacher.lunches[j].day === day){
          time = teacher.lunches[j].time;
          j = teacher.lunches.length;
          i = teachersList.length;
        }
      }
    }
  }
  zCheckAndTime = {"zCheck": zCheck, "time": time};
  return zCheckAndTime;
}

/**
 * @desc Assigns students with lunches assigned by house to the table of their house
 * @params - student - the student whose lunch is being assigned
 *           nonAssignedLunches - the list of nonAssigned lunches
 *           properties - the list of document properties
 * @funtional - updated
 * @author - dicksontc
 */
function doAssignmentByHouse(student, nonAssignedLunches, properties){
  var houseLunches = [];
  var i, j;
  for(i = 0; i < nonAssignedLunches.length; i++){
    if(nonAssignedLunches[i].assignedBy === "house"){
      houseLunches.push(nonAssignedLunches[i].name);
    }
  }
  for(i = 0; i < student.lunches.length; i++){
    for(j = 0; j < houseLunches.length; j++){
      if(student.lunches[i].time === houseLunches[j]){
        student.lunches[i].table = student.house;
        j = houseLunches.length;
      }
    }
  }
  return true;
}

/**
 * @desc Calculates and assigns the students zScore number where zScore means
 *         "z", # lunch with priority 1, # lunch with priority 2, etc.
 * @params - stu - the student whose zScore is being calculated
 *           properties - the list of document properties
 *           lunchTimes - the list of lunch times
 * @funtional - updated
 * @author - dicksontc
 */
function assignZScore(stu, properties, lunchTimes){
  stu.zScore = 0;
  var i, j;
  
  for(i = 0; i < stu.lunches.length; i++){
    for(j = 0; j < lunchTimes.length; j++){
      if(stu.lunches[i].time === lunchTimes[j].name){
        stu.zScore += Math.pow(10,lunchTimes.length - lunchTimes[j].priority);
        j = lunchTimes.length;
      }
    }
  }
  return true;
}

/**
 * @desc For each lunch assigned by table, this method populates an array
 *         with numbers representing each student at each table
 * @params - assignedLunches - the list of assigned lunches
 *           properties - the list of document properties
 * @return - tableNumbersForEachLunch - the array with all of the necessary table numbers
 * @funtional - updated
 * @author - dicksontc
 */
function populateTablesArray(numStudents, stuPerTable, properties){
  var i;
  var numArray = [];
  var numTables = numStudents / stuPerTable;
  
  for(i = 0; i < numStudents; i++){
    numArray.push(i%numTables+1);
  }
  return numArray;
}

/**
 * @desc Checks to see if each student has a lunch for each day, adds students with an assigned lunch
 *         to an array, and does the table assignments for house assigned lunches
 * @params - studentsList - the entire list of students
 *           lunchDaysList - the list of lunch days
 *           properties - the list of document properties
 * @return - JSON object holding two arrays:
 *           studentsOver - the array for holding the students with more than the correct number of lunches
 *           tableAssignedTimes - the array for holding early students
 * @funtional - updated
 * @author - dicksontc
 */
function addLunches(studentsList, lunchDaysList, lunchTimes, assignedLunches, nonAssignedLunches, properties){
  var stuLunchCheck = [];
  var i, j, k;
  var student;
  var temp = [];
  var studentsOver = [];
  var tableAssignedTimesWithStudents = [];
  
  for(i = 0; i < assignedLunches.length; i++){
    tableAssignedTimesWithStudents.push({"time": assignedLunches[i].name, "studentsTables": temp});
  }
  
  for(i = 0; i < studentsList.length; i++){
    student = studentsList[i];
    if(student.fName !== "First Name") {
      for(j = 0; j < lunchDaysList.length; j++){
        stuLunchCheck[j] = false;
      }
      for(j = 0; j < student.lunches.length; j++){
        for(k = 0; k < lunchDaysList.length; k++){
          if(student.lunches[j].day === lunchDaysList[k].letter){
            stuLunchCheck[k] = true;
          }
        }
        for(k = 0; k < tableAssignedTimesWithStudents.length; k++){
          if(student.lunches[j].time === tableAssignedTimesWithStudents[k].time){
            tableAssignedTimesWithStudents[k].studentsTables.push({"stuAssigned": student, "lunchIndex": j});
          }
        }    
      }
      
      if(student.grade >=9){
        
        //If a student does not have a lunch for any day, add a lunch for that day
        for(j = 0; j < stuLunchCheck.length; j++){
          if(!stuLunchCheck[j]){
            var lunchObj = {"day": lunchDaysList[j].letter, "time": nonAssignedLunches[0].name, "isItzScore": true, "table": "", "code": "",
                            "length": "", "cID": "", "sID": "", "block": "", "tableHead": "", "title": "",
                            "teacherFName": "", "teacherLName": ""};
            student.lunches.push(lunchObj);
            stuLunchCheck[j] = true;
          }
        }
        
        if(student.lunches.length === lunchDaysList.length){
          assignZScore(student, properties, lunchTimes);
          doAssignmentByHouse(student, nonAssignedLunches, properties);
        }else{
          studentsOver.push(student);
        }
      }
      else {
        doAssignmentByHouse(student, nonAssignedLunches, properties);
      }
    }
  }
  return {"studentsOver": studentsOver, "tableAssignedTimes": tableAssignedTimesWithStudents};
}

/**
 * @desc Changes the background colors and/or fonts of certain cells in a given column
 * @params - column - the column in which the cells need to be colored
 *           properties - the list of document properties
 * @funtional - updated
 * @author - dicksontc
 */
function colorBackgrounds(column, properties){
  var stuData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(properties.studentData);
  var range = stuData.getRange(1, column + 1, stuData.getDataRange().getNumRows());
  var rangeValues = range.getValues();
  var ro = range.getNumRows();
  var rowColors = [];
  var fonts = [];
  var values = [];
  var i, j;
  var check;
  var lunchDays = JSON.parse(properties.lunchDays);
  
  for(i = 0; i < rangeValues.length; i++){
    if(rangeValues[i][0] === "Lunch Time"){
      for(j = 0; j < lunchDays[0].times.length; j++){
        values.push(lunchDays[0].times[j]);
      }
      i = rangeValues.length;
    }else if (rangeValues[i][0] === "Lunch Table"){
      values = JSON.parse(properties.houses);
      i = rangeValues.length;
    }
  }
  for(i = 0; i < ro; i++){
    rowColors[i] = [];
    fonts[i] = [];
    check = false;
    for(j = 0; j < values.length; j++){
      if(rangeValues[i][0] === values[j].name){
        rowColors[i].push(values[j].background);
        fonts[i].push(values[j].font);
        check = true;
        j = values.length;
      }
    }
    if(!check){
      rowColors[i].push("WHITE");
      fonts[i].push("BLACK");
    }
  }
  range.setFontColors(fonts);
  range.setBackgrounds(rowColors);
  return true;
}