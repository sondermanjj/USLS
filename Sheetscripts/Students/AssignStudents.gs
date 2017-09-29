//JSHint verified 9/29/2017 dicksontc

/**
@desc Main application for assigning students to their lunch tables each day.
@funtional - yes
@author - dicksontc
*/
function assignStudentLunchDays() {
  var docProps = PropertiesService.getDocumentProperties();
  var properties = docProps.getProperties();
  var primarySheetName = properties.studentData;
  var primary = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(primarySheetName);
  var teacherSheetName = properties.teacherChoices;
  var teacher = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(teacherSheetName);
  
  var assignedLunches= JSON.parse(properties.assignedLunches);
  
  var primaryData = primary.getDataRange();
  var teacherData = teacher.getDataRange();
  
  var pValues = primaryData.getValues();
  var tValues = teacherData.getValues();
  
  var pNumRows = primaryData.getNumRows();
  var tNumRows = teacherData.getNumRows();
  
  var stu;
  var i,j,k,p;
  var numStudents;
  
  var fullStudentsArray = [];
  var fullTeachersArray = [];
  
  fullTeachersArray = getTeachers(tValues, tNumRows, properties);
  fullStudentsArray = getStudents(pValues, pNumRows, fullTeachersArray, properties);
  
  var tableAssignedTimesWithStudents = [];
  var studentsWithTooManyLunches = [];
  var lunchDaysList = JSON.parse(properties.letterDays);
  
  addLunches(fullStudentsArray, lunchDaysList, tableAssignedTimesWithStudents, studentsWithTooManyLunches, properties);
  
  if(studentsWithTooManyLunches.length > 0){
    var message = "These Students have conflicting lunches:\n";
    for(i = 0; i < studentsWithTooManyLunches.length; i++){
      var bad = studentsWithTooManyLunches[i];
      message += "" + bad.fName + " " + bad.lName + ": " + bad.lunches.length + " lunches\n";
    }
    SpreadsheetApp.getUi().alert(message);
    return;
  }
  
  var pAssignedEachDay = [];
  for(i = 0; i < lunchDaysList.length; i++){
    pAssignedEachDay[i] = [];
    for(j = 0; j < assignedLunches.length; j++){
      if(assignedLunches[j].by === "table"){
        pAssignedEachDay[i].push({"day": lunchDaysList[i], "time": assignedLunches[j].time, "arr": []});
      }   
    }
  }
  for(i = 0; i < tableAssignedTimesWithStudents.length; i++){
    var studentsTables = tableAssignedTimesWithStudents[i].studentsTables;
    for(j = 0; j < studentsTables.length; j++){
      stu = studentsTables[j].stuAssigned;
      var day = stu.lunches[studentsTables[j].lunchIndex].day;
      for(k = 0; k < lunchDaysList.length; k++){
        if(day === lunchDaysList[k]){
          for(p = 0; p < pAssignedEachDay[k].length; p++){
            if(pAssignedEachDay[k][p].time === stu.lunches[studentsTables[j].lunchIndex].time){
              pAssignedEachDay[k][p].arr.push(studentsTables[j]);
            }
          }
        }
      }
    }
  }
  
  //Checks to see if there are too many students in any lunch
  var badLunches = [];
  var errorMessage;
  for(i = 0; i < pAssignedEachDay.length; i++){
    for(j = 0; j < pAssignedEachDay[i].length; j++){
      badLunches[i] = {"time": pAssignedEachDay[i][j].time, "numLunches": 0};
      for(k = 0; k < assignedLunches.length; k++){
        if(pAssignedEachDay[i][j].time === assignedLunches[k].time){
          numStudents = assignedLunches[k].numberOfStudents;
        }
      }
      if(pAssignedEachDay[i][j].arr.length > numStudents){
        errorMessage += "" + lunchDaysList[i];
        badLunches[i].numLunches = badLunches[i].numLunches+1;
      }
    }
  }
  
  for(i = 0; i < badLunches.length; i++){
    if(badLunches[i] > 1){
      errorMessage += "days have too many students. Please change 1 or more teacher lunch times.";
      SpreadsheetApp.getUi().alert(errorMessage);
      return;
    }else if(badLunches[i] === 1){
      errorMessage += "day has too many students. Please change 1 or more teacher lunch times.";
      SpreadsheetApp.getUi().alert(errorMessage);
      return;
    }
  }
  
  var lengthCheck = true;
  //Checks to see if there are too few students in each assigned lunch. If there are, assign students
  //with the lowest zScore number in mid lunch to that lunch
  for(i = 0; i < pAssignedEachDay.length; i++){
    for(j = 0; j < pAssignedEachDay[i].length; j++){
      var lunchTime;
      for(k = 0; k < assignedLunches.length; k++){
        if(pAssignedEachDay[i][j].time === assignedLunches[k].time){
          numStudents = assignedLunches[k].numStudents;
          lunchTime = assignedLunches[k];
          k = assignedLunches.length;
        }
      }
      if(pAssignedEachDay[i][j].arr.length < numStudents){
        pAssignedEachDay[i][j].arr = moveFromNonToAssigned(pAssignedEachDay[i][j].day, fullStudentsArray, pAssignedEachDay[i][j].arr, lunchTime, properties);
      }
      if(pAssignedEachDay[i][j].arr.length < numStudents){
        lengthCheck = false;
      }
    }
  }
  
  //If there all early lunches are full and none are overpopulated, randomly assign students to tables
  if(lengthCheck){
    for(i = 0; i < pAssignedEachDay.length; i++){
      for(j = 0; j < pAssignedEachDay[i].length; j++){
        doRandomAssignment(pAssignedEachDay[i][j], properties);
      }
    }
    printStudentsToSheet(fullStudentsArray, primary, properties);
  }else{
    Logger.log("Too many or too few students in a lunch (shouldn't happen)");
    SpreadsheetApp.getUi().alert("Not enough students in assigned lunches");
  }
}

/**
@desc Uses the students and changes arrays to change student schedules 
@funtional - yes
@author - dicksontc
*/
function parseStudentChanges(){
  var docProps = PropertiesService.getDocumentProperties();
  var properties = docProps.getProperties();
  var studentDataProp = properties.studentData;
  var teacherChoicesProp = properties.teacherChoices;
  var changesSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Student Schedule Changes");
  var scanSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Scanned Data");
  var primarySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(studentDataProp);
  var teacher = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(teacherChoicesProp);
  var nonAssignedLunches = JSON.parse(properties.nonAssignedLunches);
  
  var changeData = changesSheet.getDataRange();
  var primaryData = primarySheet.getDataRange();
  var teacherData = teacher.getDataRange();
  
  var pValues = primaryData.getValues();
  var cValues = changeData.getValues();
  var tValues = teacherData.getValues();
  
  var pNumRows = primaryData.getNumRows();
  var cNumRows = changeData.getNumRows();
  var cNumColumns = changeData.getNumColumns();
  var tNumRows = teacherData.getNumRows();
  
  var students = [];
  var changes = [];
  var teachers = [];
  
  var message = "";
  var i,j,k,p;
  teachers = getTeachers(tValues, tNumRows, properties);
  students = getStudents(pValues, pNumRows, teachers, properties);
  changes = getChanges(cValues, cNumRows, cNumColumns);
  
  for(var x = 0; x < students.length; x++){
    assignZScore(students[x], properties);
  }
  if(changes.length > 0){
    for(i = 0; i < changes.length; i++){
      var change = changes[i];
      if(change.oldTime !== change.newTime){
        for(j = 0; j < students.length; j++){
          var stu = students[j];
          if(change.fName === stu.fName && change.lName === stu.lName){
            for(k = 0; k < stu.lunches.length; k++){
              var lunch = stu.lunches[k];
              if(lunch.day === change.oldDay){
                var oldtime = change.oldTime;
                var newtime = change.newTime;
                var oldAssigned = true;
                var newAssigned = true;
                var oldNum = -1;
                var newNum = -1;
                for(p = 0; p < nonAssignedLunches.length; p++){
                  if(oldtime === nonAssignedLunches[p].time){
                    oldAssigned = false;
                    oldNum = p;
                  }
                  if(newtime === nonAssignedLunches[p].time){
                    newAssigned = false;
                    newNum = p;
                  }
                }
                if(!oldAssigned && !newAssigned){
                  students[j].lunches[k].time = newtime;
                  if(nonAssignedLunches[newNum].by === "none"){
                    students[j].lunches[k].table = "";
                  }else if(nonAssignedLunches[newNum].by === "house"){
                    students[j].lunches[k].table = stu.house;
                  }
                  message += "" + change.fName + " " + change.lName + " moved from " + oldtime + " to " + newtime + ".\n";
                }else{
                  var affectedStu;
                  var affectedLunch;
                  var day = change.newDay;
                  
                  var zScoreStudents = getzScoreStudents(students, day); //NEEDS LUNCHTIME OBJ
                  for(p = 0; p < zScoreStudents.length; p++){
                    var zStu = zScoreStudents[p].stu;
                    var lunchTime = zStu.lunches[zScoreStudents[p].j].time;
                    if(lunchTime === newtime){
                      affectedStu = zScoreStudents[p].stuNum;
                      affectedLunch = zScoreStudents[p].j;
                      p = zScoreStudents.length;
                    }
                  }
                  if(affectedStu === null){
                    SpreadsheetApp.getUi().alert("Not enough students to switch into/out of early lunch!");
                    return;
                  }
                  
                  if(oldtime === "early"){
                    students[j].lunches[k].time = newtime;
                    if(newtime === "mid"){
                      students[j].lunches[k].table = "";
                    }else{
                      students[j].lunches[k].table = students[j].house;
                    }
                    students[affectedStu].lunches[affectedLunch].time = oldtime;
                    students[affectedStu].lunches[affectedLunch].table = change.oldTable;
                  }else if(newtime === "early"){
                    students[j].lunches[k].time = newtime;
                    students[j].lunches[k].table = students[affectedStu].lunches[affectedLunch].table;
                    students[affectedStu].lunches[affectedLunch].time = oldtime;
                    if(oldtime === "mid"){
                      students[affectedStu].lunches[affectedLunch].table = "";
                    }else{
                      students[affectedStu].lunches[affectedLunch].table = students[affectedStu].house;
                    }
                  }
                  assignZScore(students[affectedStu], properties);
                  message += "" + change.fName + " " + change.lName + " switched spots with " + students[affectedStu].fName + " " + students[affectedStu].lName + " on " + day + " day.\n";
                }
                assignZScore(students[j], properties);
                k = stu.lunches.length;
              }
            }
            j = students.length;
          }
        }
      }else{
        message += "" + change.fName + " " + change.lName + " did not move.\n";
      }
    }
    printStudentsToSheet(students, primarySheet, properties);
    if(changesSheet.getDataRange().getNumRows() > 1){
      changesSheet.deleteRows(2, changeData.getNumRows());
    }
    scanSheet.clear();
    sortSheetBy(primarySheet, ["Lunch Day", "Last Name", "First Name"]);
    var currentValues = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(studentDataProp).getDataRange().getValues();
    scanSheet.getRange(1, 1, currentValues.length, currentValues[0].length).setValues(currentValues);
  }else{
    message = "No changes have been made";
  }
  SpreadsheetApp.getUi().alert(message);
}

/**
@desc Changes the students with the lowest zScores' lunch times to the assigned lunch
  with fewer than the required amount of students for a specific day
@params - day - the day of the assigned lunch that needs more students
          students - the list of students at USM
          dayStudents - the list of students in the assigned lunch for that day
          lunchTime - the assigned lunch time that needs students
          properties - the list of document properties
@return - dayStudents - the list of students in the assigned lunch for that day
@funtional - yes
@author - dicksontc
*/
function moveFromNonToAssigned(day, students, dayStudents, lunchTime, properties){
  var numberOfStudents = parseInt(lunchTime.numStudents);
  var nonAssignedLunches = JSON.parse(properties.nonAssignedLunches);
  var assignedLunches = JSON.parse(properties.assignedLunches);
  var lunchTimes = JSON.parse(properties.lunchTimes);
  var needed = numberOfStudents - dayStudents.length;
  var zScoreStudents = getzScoreStudents(students, day, lunchTime);
  var i;
  var oldPriority;
  while(needed > 0){
    if(zScoreStudents.length > 0){
      var student = zScoreStudents[0].stu;
      var lunchIndex = zScoreStudents[0].lunchIndex;
      var stuIndex = zScoreStudents[0].stuIndex;
      var oldTime = student.lunches[lunchIndex].time;
      var lunchCheck = true;
      for(i = 0; i < assignedLunches.length; i++){
        if(oldTime === assignedLunches[i].time){
          lunchCheck = false;
        }
      }
      if(lunchCheck && oldTime != lunchTime.time){
        for(i = 0; i < lunchTimes.length; i++){
          if(oldTime === lunchTimes[i].name){
            oldPriority = lunchTimes[i].priority;
          }
        }
        var newZScore =  student.zScore + (Math.pow(10,lunchTimes.length - lunchTime.priority)) - (Math.pow(10,lunchTimes.length - oldPriority));
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
@desc Randomly assigns a lunch table to the students who have assigned lunches
@params - pAssignedLunch - the lunch and list of students that is assigned
          properties - the list of document properties
@funtional - yes
@author - dicksontc
*/
function doRandomAssignment(pAssignedLunch, properties){  
  var gNine = [];
  var gTen = [];
  var gEleven = [];
  var gTwelve = [];
  var nums;
  var numIndex = -1;
  var students = pAssignedLunch.arr;
  var i;
  
  for(i = 0; i < students.length; i++){
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
    }
  }
  
  nums = populateTablesArray(properties);
  var index;
  shuffleArray(gNine);
  shuffleArray(gTen);
  shuffleArray(gEleven);
  shuffleArray(gTwelve);
  for(i = 0; i < nums.length; i++){
    if(pAssignedLunch.time === nums[i].time){
      index = i;
    }
  }
  numIndex = randomlyAssign(gNine, numIndex, nums[index].arr);
  numIndex = randomlyAssign(gTen, numIndex, nums[index].arr);
  numIndex = randomlyAssign(gEleven, numIndex, nums[index].arr);
  numIndex = randomlyAssign(gTwelve, numIndex, nums[index].arr);
}

/**
@desc Randomly assigns a lunch table to the students in a particular lunch
@params - gradeArray - the students to be assigned lunch on a particular day
          indexNum - the current index of the numbers array
          numberArray - the array holding the available table numbers
@return - indexNum - the current index of the numbers array
@funtional - yes
@author - dicksontc
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
@desc Creates teacher array filled with teacher information.
@params - tValues - the array of the teachers rows and columns
          tNumRows - the number of rows in the faculty choices list
          properties - the list of document properties
@return - teachers - the list of teachers that was generated
@funtional - yes
@author - dicksontc
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
@desc Shuffles a given array
@params - array - the array to be shuffled
@funtional - yes
@author - dicksontc
*/
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--){
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

/**
@desc Asks the user if they want to automatically re-assign the students whose lunches changed.
@funtional - yes
@author - dicksontc
*/
function promptForChanges(){
  var changesSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Student Schedule Changes");
  var rows = changesSheet.getDataRange().getNumRows();
  if(rows >= 3 && /\S/.test(changesSheet.getDataRange().getValues()[2][0])){
    var response = Browser.msgBox("Auto-Reassign", "Do you want to automatically re-assign the students?", Browser.Buttons.YES_NO);
    if (response === "yes"){
      parseStudentChanges();
    }
  }
}

/**
@desc Uses the student schedule changes to format the changes into a more usable format
@params - cVals - the values in the Change array
cRow - the number of Change rows
cCol - the number of Change columns
students - the students and their lunches
@funtional - yes
@author - dicksontc
*/
function getChanges(cVals, cRow, cCol){
  var changes = [];
  var fNameCol;
  var lNameCol;
  var timeCol;
  var dayCol;
  var tableCol;
  for(var i = 0; i < cCol; i++){
    if(cVals[0][i] === "First Name"){
      fNameCol = i;
    }else if(cVals[0][i] === "Last Name"){
      lNameCol = i;
    }else if(cVals[0][i] === "Lunch Time"){
      timeCol = i;
    }else if(cVals[0][i] === "Lunch Day"){
      dayCol = i;
    }else if(cVals[0][i] === "Lunch Table"){
      tableCol = i;
    }
  }
  
  for(i = 1; i < cRow; i+= 3){
    var change = {"fName": cVals[i][fNameCol], "lName": cVals[i][lNameCol], "oldTime": cVals[i][timeCol], "oldDay": cVals[i][dayCol],
                  "oldTable": cVals[i][tableCol], "newTime": cVals[i+1][timeCol], "newDay": cVals[i+1][dayCol], "newTable": cVals[i+1][tableCol]};
    changes.push(change);
  }
  
  return changes;
}

/**
@desc Creates an array of all the students who have a free period
@params - students - the array of students
          day - the day of the lunch that has the needed students
          lunchTime - the lunch time that the students cannot be from
@return - zScoreStudents - the list of students who have a free period on a
  certain day and at any time other than the listed one
@funtional - yes
@author - dicksontc
*/
function getzScoreStudents(students, day, badLunchTime){
  var zScoreStudents = [];
  var time = badLunchTime.time;
  for(var i = 0; i < students.length; i++){
    var student = students[i];
    for(var j = 0; j < student.lunches.length; j++){
      if(student.lunches[j].day === day && student.lunches[j].time !== time){
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
@desc Uses the students array to print all student information to primary sheet
@params - students - the array of students
          primary - the sheet the students are being printed to
          properties - the list of document properties
@funtional - yes
@author - dicksontc
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
      
      pushArray = new Array(19);
      
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
      if(title === undefined || (title.length === 4 && title.indexOf("z") !== -1)){
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
      finalArray.push(pushArray);
    }
  }
  
  primary.clear();
  var sheetRange = primary.getRange(1, 1, count, 19);
  sheetRange.setValues(finalArray);
  colorBackgrounds(lunchTimeCol, properties);
  colorBackgrounds(lunchTableCol, properties);
}

/**
@desc Creates student array filled with student information.
@params - studentValues - the array of the students rows and columns
          numRows - the number of rows in the final student data list
          teachersList - the list of teachers
          properties - the list of document properties
@return - newStudentsList - the list of students that was generated
@funtional - yes
@author - dicksontc
*/
function getStudents(studentValues, numRows, teachersList, properties){
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
    var advisor = studentValues[i][advisorCol];
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
        
    var zScoreCheckAndTime = getLunchTimeAndZCheckBasedOnTeacher(teacherFName, teacherLName, time, day, teachersList, properties);
    time = zScoreCheckAndTime.time;
    var zCheck = zScoreCheckAndTime.zCheck;
    
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
  return newStudentsList;
}

/**
@desc Finds the lunch time of the teacher that the student has for a specific lunch period
@params - advisor - the name of the student's advisor,
          teachersList - the list of teachers
@return - house - the house of the student
@funtional - yes
@author - dicksontc
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
@desc Finds the lunch time of the teacher that the student has for a specific lunch period
@params - firstName - the first name of the teacher,
          lastName - the last name of the teacher,
          time - the time associated with the students lunch
          day - the letter of the day the student has the specific lunch
          teachersList - the list of teachers
          properties - the list of document properties
@return - zCheckAndTime - an object that contains a boolean to check whether or not the student's lunch
  is a free period and the lunch time of the student's lunch
@funtional - yes
@author - dicksontc
*/
function getLunchTimeAndZCheckBasedOnTeacher(firstName, lastName, time, day, teachersList, properties){
  var assignedLunchTimes = JSON.parse(properties.assignedLunches);
  var nonAssignedLunchTimes = JSON.parse(properties.nonAssignedLunches);
  var zCheck = false;
  var i, j;
  var zCheckAndTime;
  
  for(i = 0; i < teachersList.length; i++){
    var teacher = teachersList[i];
    
    if(firstName === '' && lastName === ''){
      zCheck = true;
      i = teachersList.length;
      var bool = true;
      for(j = 0; j < assignedLunchTimes.length; j++){
        if(time === assignedLunchTimes[0].time){
          bool = false;
          j = assignedLunchTimes.length;
        }
      }
      if(bool){
        time = nonAssignedLunchTimes[0].time;
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
  zCheckAndTime = {"zCheck": zCheck, "time": time}
  return zCheckAndTime;
}

/**
@desc Assigns students with lunches assigned by house to the table of their house
@params - student - the student whose lunch is being assigned
          properties - the list of document properties
@funtional - yes
@author - dicksontc
*/
function doAssignmentByHouse(student, properties){
  var lunchTimes = JSON.parse(properties.nonAssignedLunches);
  var houseLunch;
  var i;
  for(i = 0; i < lunchTimes.length; i++){
    if(lunchTimes[i].by === "house"){
      houseLunch = lunchTimes[i].time;
      i = lunchTimes.length;
    }
  }
  for(i = 0; i < student.lunches.length; i++){
    if(student.lunches[i].time === houseLunch){
      student.lunches[i].table = student.house;
    }
  }
}

/**
@desc Calculates and assigns the students zScore number where zScore means
  "z", # lunch with priority 1, # lunch with priority 2, etc.
@params - stu - the student whose zScore is being calculated
          properties - the list of document properties
@funtional - yes
@author - dicksontc
*/
function assignZScore(stu, properties){
  stu.zScore = 0;
  var lunchTimes = JSON.parse(properties.lunchTimes);
  var i, j;
  
  for(i = 0; i < stu.lunches.length; i++){
    for(j = 0; j < lunchTimes.length; j++){
      if(stu.lunches[i].time === lunchTimes[j].name){
        stu.zScore += Math.pow(10,lunchTimes.length - lunchTimes[j].priority);
        j = lunchTimes.length;
      }
    }
  }
}

/**
@desc For each lunch assigned by table, this method populates an array
  with numbers representing each student at each table
@params - properties - the list of document properties
@return - tableNumbersForEachLunch - the array with all of the necessary table numbers
@funtional - yes
@author - dicksontc
*/
function populateTablesArray(properties){
  var assignedLunches = JSON.parse(properties.assignedLunches);
  var i, j;
  var tableNumbersForEachLunch = [];
  
  for(i = 0; i < assignedLunches.length; i++){
	if(assignedLunches[i].by === "table"){
		var numArray = [];
		var numTables = assignedLunches[i].numTables;
		var numStudents = assignedLunches[i].numStudents;
		for(j = 0; j < numStudents; j++){
			numArray.push(j%numTables+1);
		}
		tableNumbersForEachLunch.push({"time": assignedLunches[i].time, "arr": numArray});
	}
  }
  
  return tableNumbersForEachLunch;
}

/**
@desc Checks to see if each student has a lunch for each day, adds students with an assigned lunch
  to an array, and does the table assignments for house assigned lunches
@params studentsList - the entire list of students
        lunchDaysList - the list of lunch days
        tableAssignedTimesWithStudents - the array for holding early students
        studentsOver - the array for holding the students with more than the correct number of lunches
        properties - the list of document properties
@funtional - yes
@author - dicksontc
*/
function addLunches(studentsList,lunchDaysList, tableAssignedTimesWithStudents, studentsOver, properties){
  var stuLunchCheck = [];
  var assignedLunches = JSON.parse(properties.assignedLunches);
  var nonAssignedLunches = JSON.parse(properties.nonAssignedLunches);
  var i, j, k;
  var student;
  var temp = [];
  
  for(i = 0; i < assignedLunches.length; i++){
    if(assignedLunches[i].by === "table"){
      tableAssignedTimesWithStudents.push({"time": assignedLunches[i].time, "studentsTables": temp});
    }
  }
  
  for(i = 0; i < studentsList.length; i++){
    student = studentsList[i];
    if(student.fName !== "First Name" && student.grade >= 9) {
      for(j = 0; j < lunchDaysList.length; j++){
        stuLunchCheck[j] = false;
      }
      for(j = 0; j < student.lunches.length; j++){
        for(k = 0; k < lunchDaysList.length; k++){
          if(student.lunches[j].day === lunchDaysList[k]){
            stuLunchCheck[k] = true;
            k = lunchDaysList.length;
          }
        }
		for(k = 0; k < tableAssignedTimesWithStudents.length; k++){
          if(student.lunches[j].time === tableAssignedTimesWithStudents[k].time){
            tableAssignedTimesWithStudents[k].studentsTables.push({"stuAssigned": student, "lunchIndex": j});
          }
        }    
      }
      
      //If a student does not have a lunch for any day, add a lunch for that day
      for(j = 0; j < stuLunchCheck.length; j++){
        if(!stuLunchCheck[j]){
        var lunchObj = {"day": lunchDaysList[j], "time": nonAssignedLunches[0].time, "isItzScore": true, "table": "", "code": "",
                    "length": "", "cID": "", "sID": "", "block": "", "tableHead": "", "title": "",
                    "teacherFName": "", "teacherLName": ""};
          student.lunches.push(lunchObj);
          stuLunchCheck[j] = true;
        }
      }
      
      if(student.lunches.length === lunchDaysList.length){
        assignZScore(student, properties);
        doAssignmentByHouse(student, properties);
      }else{
        studentsOver.push(student);
      }
    }
  }
}

/**
@desc Changes the background colors and/or fonts of certain cells in a given column
@params - column - the column in which the cells need to be colored
          properties - the list of document properties
@funtional - yes
@author - dicksontc
*/
function colorBackgrounds(column, properties){
  var stuData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(properties.studentData);
  var range = stuData.getRange(1, column + 1, stuData.getDataRange().getNumRows());
  var rangeValues = range.getValues();
  var ro = range.getNumRows();
  var rowColors = [];
  var fonts = [];
  var values;
  var i, j;
  var check;
  
  for(i = 0; i < rangeValues.length; i++){
    if(rangeValues[i][0] === "Lunch Time"){
      values = JSON.parse(properties.lunchTimes);
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
}