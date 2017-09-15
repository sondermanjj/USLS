//JSHint verified 5/7/2017 dicksontc

/**
@desc Main application for assigning students to their lunch tables each day.
@funtional - yes
@author - dicksontc
*/
function assignStudentLunchDays() {
  var properties = PropertiesService.getDocumentProperties();
  var primarySheetName =properties.getProperty("studentData");
  var primary = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(primarySheetName);
  var teacherSheetName = properties.getProperty("teacherChoices");
  var teacher = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(teacherSheetName);
  
  var assignedLunches= JSON.parse(properties.getProperty("assignedLunches"));
  
  var primaryData = primary.getDataRange();
  var teacherData = teacher.getDataRange();
  
  var pValues = primaryData.getValues();
  var tValues = teacherData.getValues();
  
  var pNumRows = primaryData.getNumRows();
  var tNumRows = teacherData.getNumRows();
  
  var stu;
  var fullStudentsArray = [];
  var fullTeachersArray = [];
  
  fullTeachersArray = getTeachers(tValues, tNumRows);
  fullStudentsArray = getStudents(pValues, pNumRows, fullTeachersArray);
  
  var pTableStudents = [];
  var studentsWithTooManyLunches = [];
  var stuLunchCheck = [];
  var lunchDaysList = JSON.parse(properties.getProperty("letterDays"));
  
  addLunches(fullStudentsArray, lunchDaysList, pTableStudents, studentsWithTooManyLunches);

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
    for(var u = 0; u < assignedLunches.length; u++){
      if(assignedLunches[u].assigned === "table"){
        pAssignedEachDay[i].push({"day": lunchDaysList[i], "time": assignedLunches[u].time, "arr": []});
      }   
    }
  }
  for(var b = 0; b < pTableStudents.length; b++){
    var studentsTables = pTableStudents[b].studentsTables;
    for(var c = 0; c < studentsTables.length; c++){
      stu = studentsTables[c].stu;
      var day = stu.lunches[studentsTables[c].lunch].day;
      for(var u = 0; u < lunchDaysList.length; u++){
        if(day == lunchDaysList[u]){
          for(var k = 0; k < pAssignedEachDay[u].length; k++){
            if(pAssignedEachDay[u][k].time === stu.lunches[studentsTables[c].lunch].time){
              pAssignedEachDay[u][k].arr.push(studentsTables[c]);
            }
          }
        }
    }
    }
  }
  
  //Checks to see if there are too many students in any lunch
  var badLunches = [];
  var errorMessage;
  for(b = 0; b < pAssignedEachDay.length; b++){
    for(var q = 0; q < pAssignedEachDay[b].length; q++){
      badLunches[b] = {"time": pAssignedEachDay[b][q].time, "numLunches": 0};
      var numStudents;
      for(var a = 0; a < assignedLunches.length; a++){
        if(pAssignedEachDay[b][q].time === assignedLunches[a].time){
          numStudents = assignedLunches[a].numberOfStudents;
        }
      }
      if(pAssignedEachDay[b][q].arr.length > numStudents){
        errorMessage += "" + lunchDaysList[b];
        badLunches[b].numLunches = badLunches[b].numLunches+1;
      }
    }
  }
  
  for(b = 0; b < badLunches.length; b++){
    if(badLunches[b] > 1){
      errorMessage += "days have too many students. Please change 1 or more teacher lunch times.";
      SpreadsheetApp.getUi().alert(errorMessage);
      return;
    }else if(badLunches[b] == 1){
      errorMessage += "day has too many students. Please change 1 or more teacher lunch times.";
    SpreadsheetApp.getUi().alert(errorMessage);
    return;
    }
  }
  
  var lengthCheck = true;
  //Checks to see if there are too few students in each early lunch. If there are, assign students
  //with the lowest zelm number in mid lunch to that lunch
  for(var z = 0; z < pAssignedEachDay.length; z++){
    for(var x = 0;x < pAssignedEachDay[z].length; x++){
      var lunchTime;
      for(var a = 0; a < assignedLunches.length; a++){
        if(pAssignedEachDay[z][x].time === assignedLunches[a].time){
          numStudents = assignedLunches[a].numberOfStudents;
          lunchTime = assignedLunches[a].time;
        }
      }
      if(pAssignedEachDay[z][x].arr.length < numStudents){
        moveFromNonToAssigned(pAssignedEachDay[z][x].arr.length, lunchDaysList[x], fullStudentsArray, pAssignedEachDay[z][x].arr, lunchTime);
      }
    }
  }
  
  //If there all early lunches are full and none are overpopulated, randomly assign students to tables
  if(lengthCheck){
    for(b = 0; b < pAssignedEachDay.length; b++){
      for(var c = 0; c < pAssignedEachDay[b].length; c++){
        doRandomAssignment(pAssignedEachDay[b][c]);
      }
    }
  }else{
    Logger.log("Too many or too few students in a lunch (shouldn't happen)");
  }
  
  var documentProperties = PropertiesService.getDocumentProperties();
  printStudentsToSheet(fullStudentsArray, primary);
}

/**
@desc Uses the students and changes arrays to change student schedules 
@funtional - yes
@author - dicksontc
*/
function parseStudentChanges(){
  var properties = PropertiesService.getDocumentProperties();
  var changesSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Student Schedule Changes");
  var scanSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Scanned Data");
  var primarySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(properties.getProperty("studentData"));
  var teacher = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(properties.getProperty("teacherChoices"));
  var nonAssignedLunches = JSON.parse(properties.getProperty("nonAssignedLunches"));
  
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
  
  teachers = getTeachers(tValues, tNumRows);
  students = getStudents(pValues, pNumRows, teachers);
  changes = getChanges(cValues, cNumRows, cNumColumns);
  
  for(var x = 0; x < students.length; x++){
    assignZelm(students[x]);
  }
  if(changes.length > 0){
    for(var i = 0; i < changes.length; i++){
      var change = changes[i];
      if(change.oldTime != change.newTime){
        for(var j = 0; j < students.length; j++){
          var stu = students[j];
          if(change.fName == stu.fName && change.lName == stu.lName){
            for(var h = 0; h < stu.lunches.length; h++){
              var lunch = stu.lunches[h];
              if(lunch.day == change.oldDay){
                var oldtime = change.oldTime;
                var newtime = change.newTime;
                var oldAssigned = true;
                var newAssigned = true;
                var oldNum = -1;
                var newNum = -1;
                for(var w = 0; w < nonAssignedLunches.length; w++){
                  if(oldtime == nonAssignedLunches[w].time){
                    oldAssigned = false;
                    oldNum = w;
                  }
                  if(newtime == nonAssignedLunches[w].time){
                    newAssigned = false;
                    newNum = w;
                  }
                }
                if(!oldAssigned && !newAssigned){
                  students[j].lunches[h].time = newtime;
                  if(nonAssignedLunches[newNum].by == "none"){
                    students[j].lunches[h].table = "";
                  }else if(nonAssignedLunches[newNum].by == "house"){
                    students[j].lunches[h].table = stu.house;
                  }
                  message += "" + change.fName + " " + change.lName + " moved from " + oldtime + " to " + newtime + ".\n";
                }else{
                  var affectedStu;
                  var affectedLunch;
                  var day = change.newDay;
                  
                  var zelmStudents = getZelmStudents(students, day);
                  for(var k = 0; k < zelmStudents.length; k++){
                    var zStu = zelmStudents[k].stu;
                    var lunchTime = zStu.lunches[zelmStudents[k].j].time;
                    if(lunchTime == newtime){
                      affectedStu = zelmStudents[k].stuNum;
                      affectedLunch = zelmStudents[k].j;
                      k = zelmStudents.length;
                    }
                  }
                  if(affectedStu === null){
                    SpreadsheetApp.getUi().alert("Not enough students to switch into/out of early lunch!");
                    return;
                  }
                  
                  if(oldtime == "early"){
                    students[j].lunches[h].time = newtime;
                    if(newtime == "mid"){
                      students[j].lunches[h].table = "";
                    }else{
                      students[j].lunches[h].table = students[j].house;
                    }
                    students[affectedStu].lunches[affectedLunch].time = oldtime;
                    students[affectedStu].lunches[affectedLunch].table = change.oldTable;
                  }else if(newtime == "early"){
                    students[j].lunches[h].time = newtime;
                    students[j].lunches[h].table = students[affectedStu].lunches[affectedLunch].table;
                    students[affectedStu].lunches[affectedLunch].time = oldtime;
                    if(oldtime == "mid"){
                      students[affectedStu].lunches[affectedLunch].table = "";
                    }else{
                      students[affectedStu].lunches[affectedLunch].table = students[affectedStu].house;
                    }
                  }
                  assignZelm(students[affectedStu]);
                  message += "" + change.fName + " " + change.lName + " switched spots with " + students[affectedStu].fName + " " + students[affectedStu].lName + " on " + day + " day.\n";
                }
                assignZelm(students[j]);
                h = stu.lunches.length;
              }
            }
            j = students.length;
          }
        }
      }else{
        message += "" + change.fName + " " + change.lName + " did not move.\n";
      }
    }
    printStudentsToSheet(students, primarySheet);
    if(changesSheet.getDataRange().getNumRows() > 1){
      changesSheet.deleteRows(2, changeData.getNumRows());
    }
    scanSheet.clear();
    sortSheetBy(primarySheet, ["Lunch Day", "Last Name", "First Name"]);
    var currentValues = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(properties.getProperty("studentData")).getDataRange().getValues();
    scanSheet.getRange(1, 1, currentValues.length, currentValues[0].length).setValues(currentValues);
  }else{
    message = "No changes have been made";
  }
  SpreadsheetApp.getUi().alert(message);
}

/**
@desc Changes the background colors and/or fonts of certain cells in a given column
@params - column - the column in which the cells need to be colored
@funtional - yes
@author - dicksontc
*/
function colorBackgrounds(column){
  var stuData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PropertiesService.getDocumentProperties().getProperty("studentData"));
  var ran = stuData.getRange(1, column + 1, stuData.getDataRange().getNumRows());
  var vals = ran.getValues();
  var ro = ran.getNumRows();
  var rowColors = [];
  var time = false;
  var table = false;
  
  for(var c = 0; c < vals.length; c++){
    if(vals[c] == "Lunch Time"){
      time = true;
    }else if (vals[c] == "Lunch Table"){
      table = true;
    }
  }
  
  if(time){
    for(var i = 0; i < ro; i++){
      rowColors[i] = [];
      if(vals[i] == "early"){
        rowColors[i].push("YELLOW");
      }else if(vals[i] == "late"){
        rowColors[i].push("#8db4e2");
      }else{
        rowColors[i].push("WHITE");
      }
    }
    ran.setBackgrounds(rowColors);
  }else if(table){
    var fonts = [];
    for(var k = 0; k < ro; k++){
      rowColors[k] = [];
      fonts[k] = [];
      if(vals[k] == "Ledger"){
        rowColors[k].push("#660066");
        fonts[k].push("YELLOW");
      }else{
        if(vals[k] == "Academy"){
          fonts[k].push("#3366ff");
        }else if(vals[k] == "Arrow"){
          fonts[k].push("#008000");
        }else if(vals[k] == "Crest"){
          fonts[k].push("#ff0000");
        }else{
          fonts[k].push("BLACK");
        }
        rowColors[k].push("WHITE");
      }
    }
    ran.setFontColors(fonts);
    ran.setBackgrounds(rowColors);
  }
}

/**
@desc Changes the students with the lowest zelms' lunch times to assigned lunch
for a specific day with fewer than numTables*studentsPerTable students
@params - numStudents - the number of students currently in that lunch
day - the day of the early lunch with fewer than numTables*studentsPerTable students
students - the list of students
@funtional - yes
@author - dicksontc
*/
function moveFromNonToAssigned(numStudents, day, students, dayStudents, time){
  var docProps = PropertiesService.getDocumentProperties();
  var numTables = docProps.getProperty("numberOfTables");
  var studentsPerTable = docProps.getProperty("numberStudentsPerTable");
  
  var needed = numTables * studentsPerTable - numStudents;
  var zelmStudents = getZelmStudents(students, day);
  
  while(needed > 0){
    if(zelmStudents.length > 0){
      var student = zelmStudents[0].stu;
      var x = zelmStudents[0].j;
      var oldTime = student.lunches[x].time;
      student.lunches[x].time = time;
      student.zelm += 99; // minus 1 and plus 100 for mid to early
      dayStudents.push({"stuEarly": student, "lunch": x});
      zelmStudents = zelmStudents.slice(1, zelmStudents.length);
      needed--;
    }else{
      needed = 0;
    }
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
@desc Randomly assignes a lunch table to the students who have
assigned lunches
@params - students - the students in a particular assigned lunch on a particular day
@funtional - yes
@author - dicksontc
*/
function doRandomAssignment(pAssignedLunch){  
  var gNine = [];
  var gTen = [];
  var gEleven = [];
  var gTwelve = [];
  var nums = [];
  var numIndex = -1;
  var students = pAssignedLunch.arr;
  for(var i = 0; i < students.length; i++){
    var grade = students[i].stu.grade;
    if(grade == 9){
      gNine.push(students[i]);
    }else if(grade == 10){
      gTen.push(students[i]);
    }else if(grade == 11){
      gEleven.push(students[i]);
    }else if(grade == 12){
      gTwelve.push(students[i]);
    }
  }
  
  nums = populateTablesArray();
  
  shuffleArray(gNine);
  shuffleArray(gTen);
  shuffleArray(gEleven);
  shuffleArray(gTwelve);
  
  numIndex = randomlyAssign(gNine, numIndex, nums);
  numIndex = randomlyAssign(gTen, numIndex, nums);
  numIndex = randomlyAssign(gEleven, numIndex, nums);
  numIndex = randomlyAssign(gTwelve, numIndex, nums);
}

/**
@desc Randomly assigns a lunch table to the students in a particular lunch
@params - gradeArray - the students to be assigned lunch on a particular day
indexNum - the current index of the numbers array
numberArray - the array holding the available table numbers
@funtional - yes
@author - dicksontc
*/
function randomlyAssign(gradeArray, indexNum, numberArray){
  var student;
  var lunch;
  for(i = 0; i < gradeArray.length; i++){
    indexNum++;
    student = gradeArray[i].stu;
    lunch = gradeArray[i].lunch;
    student.lunches[lunch].table = numberArray[indexNum];
  }
  return indexNum;
}

/**
@desc Creates teacher array filled with teacher information.
@params - tValues - the array of the teachers rows and columns
tFNameColumn - the column index of the faculty first name
tLNameColumn - the column index of the faculty last name
tLunchTimeColumn - the column index of the lunch time
tLunchDayIndex - the column index of the lunch day
tNumRows - the number of rows in the faculty choices list
@funtional - yes
@author - dicksontc
*/
function getTeachers(tValues, tNumRows){
  var teachers = [];
  var documentProperties = PropertiesService.getDocumentProperties();
  var fNameCol = parseInt(documentProperties.getProperty("tFNameColumn"));
  var lNameCol = parseInt(documentProperties.getProperty("tLNameColumn"));
  var lunchTimeCol = parseInt(documentProperties.getProperty("tLunchTimeColumn"));
  var lunchDayCol = parseInt(documentProperties.getProperty("tLunchDayColumn"));
  var lunches;
  for(var i = 0; i < tNumRows; i++){
    var fname = tValues[i][fNameCol];
    var lname = tValues[i][lNameCol];
    var val = tValues[i][lunchTimeCol];
    var day = tValues[i][lunchDayCol];
    if(teachers.length === 0){
      teachers.push({"fName": fname, "lName": lname, "lunches": [{"day": day, "time": val}]});
    }else{
      for(var j = 0; j < teachers.length; j++){
        if(teachers[j].fName == fname && teachers[j].lName == lname){
          teachers[j].lunches.push({"day": day, "time": val});
          j = teachers.length;
        }
        if(j == teachers.length - 1){
          teachers.push({"fName": fname, "lName": lname, "lunches": [{"day": day, "time": val}]});
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
  return array;
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
    if (response == "yes"){
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
    if(cVals[0][i] == "First Name"){
      fNameCol = i;
    }else if(cVals[0][i] == "Last Name"){
      lNameCol = i;
    }else if(cVals[0][i] == "Lunch Time"){
      timeCol = i;
    }else if(cVals[0][i] == "Lunch Day"){
      dayCol = i;
    }else if(cVals[0][i] == "Lunch Table"){
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
@funtional - yes
@author - dicksontc
*/
function getZelmStudents(students, day){
  var zelmStudents = [];
  for(var i = 0; i < students.length; i++){
    var student = students[i];
    for(var j = 0; j < student.lunches.length; j++){
      if(student.lunches[j].day == day){
        if(student.lunches[j].zelm){
          zelmStudents.push({"stu": student, "j": j, "stuNum": i});
        }
        j = student.lunches.length;
      }
    }
  }
  zelmStudents.sort(function(a, b) {
    return parseFloat(a.stu.zelm) - parseFloat(b.stu.zelm);
  });
  
  return zelmStudents;
}

/**
@desc Uses the students array to print all student information to primary sheet
@params - students - the array of students
primary - the sheet the students are being printed to
@funtional - yes
@author - dicksontc
*/
function printStudentsToSheet(students, primary){
  var documentProperties = PropertiesService.getDocumentProperties();
  var pushArray;
  var finalArray = [];
  var count = 0;
  
  var sFNameCol = parseInt(documentProperties.getProperty("Student First Name"));
  var sLNameCol = parseInt(documentProperties.getProperty("Student Last Name"));
  var gradeCol = parseInt(documentProperties.getProperty("Student Grade Level"));
  var houseCol = parseInt(documentProperties.getProperty("Student House"));
  var lunchDayCol = parseInt(documentProperties.getProperty("Student Lunch Day"));
  var lunchTableCol = parseInt(documentProperties.getProperty("Student Lunch Table"));
  var tFNameCol = parseInt(documentProperties.getProperty("Student Faculty First Name"));
  var tLNameCol = parseInt(documentProperties.getProperty("Student Faculty Last Name"));
  
  var advisorCol = parseInt(documentProperties.getProperty("Student Advisor"));
  var cCodeCol = parseInt(documentProperties.getProperty("Student Course Code"));
  var cLengthCol = parseInt(documentProperties.getProperty("Student Course Lenght"));
  var cIDCol = parseInt(documentProperties.getProperty("Student Course ID"));
  var sIDCol = parseInt(documentProperties.getProperty("Student Section Identifier"));
  var blockCol = parseInt(documentProperties.getProperty("Student Block"));
  var dobCol = parseInt(documentProperties.getProperty("Student Date of Birth"));
  var tableHeadCol = parseInt(documentProperties.getProperty("Student Table Head"));
  var cTitleCol = parseInt(documentProperties.getProperty("Student Course Title"));
  var lunchTimeCol = parseInt(documentProperties.getProperty("Student Lunch Time"));
  var genderCol = parseInt(documentProperties.getProperty("Student Gender"));
  
  for(var post = 0; post < students.length; post++){
    var fin = students[post];
    var gender = fin.gender;
    var advisor = fin.advisor;
    var zelm = "z" + fin.zelm;
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
      if(title === undefined || (title.length == 4 && title.indexOf("z") != -1)){
        pushArray[cTitleCol] =  zelm;
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
  colorBackgrounds(lunchTimeCol);
  colorBackgrounds(lunchTableCol);
}

/**
@desc Creates student array filled with student information.
@params - pValues - the array of the students rows and columns
pNumRows - the number of rows in the final student data list
teachers - the list of teachers
@funtional - yes
@author - dicksontc
*/
function getStudents(pValues, pNumRows, teachers){
  var temp = [];
  var documentProperties = PropertiesService.getDocumentProperties();
  
  var sFNameCol = parseInt(documentProperties.getProperty("Student First Name"));
  var sLNameCol = parseInt(documentProperties.getProperty("Student Last Name"));
  var gradeCol = parseInt(documentProperties.getProperty("Student Grade Level"));
  var houseCol = parseInt(documentProperties.getProperty("Student House"));
  var lunchDayCol = parseInt(documentProperties.getProperty("Student Lunch Day"));
  var lunchTableCol = parseInt(documentProperties.getProperty("Student Lunch Table"));
  var tFNameCol = parseInt(documentProperties.getProperty("Student Faculty First Name"));
  var tLNameCol = parseInt(documentProperties.getProperty("Student Faculty Last Name"));
  
  var advisorCol = parseInt(documentProperties.getProperty("Student Advisor"));
  var cCodeCol = parseInt(documentProperties.getProperty("Student Course Code"));
  var cLengthCol = parseInt(documentProperties.getProperty("Student Course Length"));
  var cIDCol = parseInt(documentProperties.getProperty("Student Course ID"));
  var sIDCol = parseInt(documentProperties.getProperty("Student Section Identifier"));
  var blockCol = parseInt(documentProperties.getProperty("Student Block"));
  var dobCol = parseInt(documentProperties.getProperty("Student Date of Birth"));
  var tableHeadCol = parseInt(documentProperties.getProperty("Student Table Head"));
  var cTitleCol = parseInt(documentProperties.getProperty("Student Course Title"));
  var lunchTimeCol = parseInt(documentProperties.getProperty("Student Lunch Time"));
  var genderCol = parseInt(documentProperties.getProperty("Student Gender"));
    
  var assignedLunchTimes = JSON.parse(documentProperties.getProperty("assignedLunches"));
  var nonAssignedLunchTimes = JSON.parse(documentProperties.getProperty("nonAssignedLunches"));
  var i;
  var j;
  var k;
  
  for(i = 0; i < pNumRows; i++){
    var day = pValues[i][lunchDayCol];
    var fname = pValues[i][sFNameCol];
    var lname = pValues[i][sLNameCol];
    var grad = pValues[i][gradeCol];
    var house = pValues[i][houseCol];
    var table = pValues[i][lunchTableCol];
    var teacherFName = pValues[i][tFNameCol];
    var teacherLName = pValues[i][tLNameCol];
    var advisor = pValues[i][advisorCol];
    var code = pValues[i][cCodeCol];
    var length = pValues[i][cLengthCol];
    var cID = pValues[i][cIDCol];
    var sID = pValues[i][sIDCol];
    var block = pValues[i][blockCol];
    var dob = pValues[i][dobCol];
    var tableHead = pValues[i][tableHeadCol];
    var gender = pValues[i][genderCol];
    var title = pValues[i][cTitleCol];
    var time = pValues[i][lunchTimeCol];
    
    var zCheck = false;
    
    for(j = 0; j < teachers.length; j++){
      var teach = teachers[j];
      if(teacherFName === '' && teacherLName === ''){
        zCheck = true;
        j = teachers.length;
        var bool = true;
        for(k = 0; k < assignedLunchTimes.length; k++){
          if(time === assignedLunchTimes[0].time){
            bool = false;
            k = assignedLunchTimes.length;
          }
        }
        if(bool){
          time = nonAssignedLunchTimes[0].time;
        }
      }else if(teach.fName == teacherFName && teach.lName == teacherLName){
        for(k = 0; k < teach.lunches.length; k++){
          if(teach.lunches[k].day == day){
            time = teach.lunches[k].time;
            k = teach.lunches.length;
            j = teachers.length;
          }
        }
      }
    }
    
    var lunchObj = {"day": day, "time": time, "zelm": zCheck, "table": table, "code": code,
                    "length": length, "cID": cID, "sID": sID, "block": block, "tableHead": tableHead, "title": title,
                    "teacherFName": teacherFName, "teacherLName": teacherLName};
    
    if(temp.length === 0){
      temp.push({"fName": fname, "lName": lname, "grade": grad, "lunches": [lunchObj], "zelm": 0, "house": house,
                 "advisor": advisor, "dob": dob, "gender": gender});
    }else{
      for(j = 0; j < temp.length; j++){
        if(temp[j].fName == fname && temp[j].lName == lname){
          temp[j].lunches.push(lunchObj);
          j = temp.length;
        }
        if(j == temp.length - 1){
          temp.push({"fName": fname, "lName": lname, "grade": grad, "lunches": [lunchObj], "zelm": 0, "house": house,
                 "advisor": advisor, "dob": dob, "gender": gender});
          j = temp.length;
        }
      }
    }
  }
  return temp;
}

/**
@desc Assigns students with lunches assigned by house to the table of their house
@params - student - the student whose lunch is being assigned
@funtional - yes
@author - dicksontc
*/
function doAssignmentByHouse(student){
  var properties = PropertiesService.getDocumentProperties();
  var lunchTimes = JSON.parse(properties.getProperty("assignedLunches"));
  var houseLunch;
  var i;
  for(i = 0; i < lunchTimes.length; i++){
    if(lunchTimes[i].assigned === "house"){
      houseLunch = lunchTimes[i].time;
      i = lunchTimes.length;
    }
  }
  for(i = 0; i < student.lunches.length; i++){
    if(student.lunches[i].time == houseLunch){
      student.lunches[i].table = student.house;
    }
  }
}

/**
@desc Calculates and assigns the students zelm number where zelm means
z, # early lunches, # late lunches, # mid lunches
@params - stu - the student whose zelm is being calculated
@funtional - yes
@author - dicksontc
*/
function assignZelm(stu){
  stu.zelm = 0;
  var properties = PropertiesService.getDocumentProperties();
  var lunchTimes = JSON.parse(properties.getProperty("lunchTimes"));
  var i;
  var j;
  for(i = 0; i < stu.lunches.length; i++){
    for(j = 0; j < lunchTimes.length; j++){
      if(stu.lunches[i].time == lunchTimes[j].time){
        stu.zelm += Math.pow(10,lunchTimes.length - lunchTimes[j].priority);
      }
    }
  }
}

/**
@desc For each lunch assigned by table, this method populates an array
with numbers representing each student at each table
@funtional - yes
@author - dicksontc
*/
function populateTablesArray(){
  var docProps = PropertiesService.getDocumentProperties();
  var assignedLunches = JSON.parse(docProps.getProperty("assignedLunches"));
  var i;
  var j;
  var tableNumbersForEachLunch = [];
  for(i = 0; i < assignedLunches.length; i++){
	if(assignedLunches[i].assigned === "table"){
		var numArray = [];
		var numTables = assignedLunches.numberOfTables;
		var studentsPerTable = assignedLunches.numberOfStudents;
		for(j = 0; j < numTables*studentsPerTable; j++){
			numArray.push(i%numTables+1);
		}
		tableNumbersForEachLunch.push({"time": assignedLunches[i].time, "arr": numArray});
	}
  }
  
  return tableNumbersForEachLunch;
}

/**
@desc Checks to see if each student has a lunch for each day, adds students with an early lunch
  to an array, and do the table assignments for house assigned lunches
@params students - the entire list of students
lunchDaysList - the list of lunch days
pTableStudents - the array for holding early students
studentsOver - the array for holding the students with more than the correct number
  of lunches
@funtional - yes
@author - dicksontc
*/
function addLunches(studentsList,lunchDaysList, tableAssignedTimesWithStudents, studentsOver){
  var properties = PropertiesService.getDocumentProperties();
  var stuLunchCheck = [];
  var assignedLunches = JSON.parse(properties.getProperty("assignedLunches"));
  var nonAssignedLunches = JSON.parse(properties.getProperty("nonAssignedLunches"));
  var i;
  var j;
  var k;
  var student;
  var temp = [];
  
  for(i = 0; i < assignedLunches.length; i++){
    if(assignedLunches[i].by === "table"){
      tableAssignedTimesWithStudents.push({"time": assignedLunches[i].time, "studentsTables": temp});
    }
  }
  
  for(i = 0; i < studentsList.length; i++){
    student = studentsList[i];
    if(student.fName != "First Name" && student.grade >= 9) {
      for(j = 0; j < lunchDaysList.length; j++){
        stuLunchCheck[j] = false;
      }
      for(j = 0; j < student.lunches.length; j++){
        for(k = 0; k < lunchDaysList.length; k++){
          if(student.lunches[j].day == lunchDaysList[k]){
            stuLunchCheck[k] = true;
            k = lunchDaysList.length;
          }
        }
		for(k = 0; k < tableAssignedTimesWithStudents.length; k++){
          if(student.lunches[j].time == tableAssignedTimesWithStudents[k].time){
            tableAssignedTimesWithStudents[k].studentsTables.push({"stu": student, "lunch": j});
          }
        }    
      }
      
      //If a student does not have a lunch for any day, add a lunch for that day
      for(j = 0; j < stuLunchCheck.length; j++){
        if(!stuLunchCheck[j]){
          student.lunches.push({"day": lunchDaysList[j], "time": nonAssignedLunches[0].time, "zelm": true, "table": ""});
          stuLunchCheck[j] = true;
        }
      }
      
      if(student.lunches.length == lunchDaysList.length){
        assignZelm(student);
        doAssignmentByHouse(student);
      }else{
        studentsOver.push(student);
      }
    }
  }
}