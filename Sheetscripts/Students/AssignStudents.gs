/**
@desc Main application for assigning students to their lunch tables each day.
@funtional - yes
@author - dicksontc
*/
function assignStudentLunchDays() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var primary = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Final Student Data");
  var teacher = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Faculty Choices");
  
  var primaryData = primary.getDataRange();
  var teacherData = teacher.getDataRange();
  
  var pValues = primaryData.getValues();
  var tValues = teacherData.getValues();
  
  var pNumRows = primaryData.getNumRows();
  var pNumColumns = primaryData.getNumColumns();
  var tNumRows = teacherData.getNumRows();
  var tNumColumns = teacherData.getNumColumns();
  
  var students = [];
  setProperties(pNumColumns, pValues, tNumColumns, tValues);
  //Set needed variables in Primary List
  
  var teachers = [];
  teachers = getTeachers(tValues, tNumRows);
  
  students = getStudents(pValues, pNumRows, teachers);
  
  var nextRow = primaryData.getNumRows() + 1;
  var pEarlyStudents = [];
  var students8Plus = [];
  
  //Checks to see if each student has a lunch for each day, adds students with an early lunch
  //to an array, and do the table assignments for late lunches
  for(var i = 0; i < students.length; i++){
    var stu = students[i];
    if(stu.fName == "First Name") {
      //Do Nothing
    } else {
      if(stu.grade >= 9){
        var a = false;
        var b = false;
        var c = false;
        var d = false;
        var e = false;
        var f = false;
        var g = false;
        var h = false;
        for(var j = 0; j < stu.lunches.length; j++){
          if(stu.lunches[j].day == 'A')
            a = true;
          else if(stu.lunches[j].day == 'B')
            b = true;
          else if(stu.lunches[j].day == 'C')
            c = true;
          else if(stu.lunches[j].day == 'D')
            d = true;
          else if(stu.lunches[j].day == 'E')
            e = true;
          else if(stu.lunches[j].day == 'F')
            f = true;
          else if(stu.lunches[j].day == 'G')
            g = true;
          else if(stu.lunches[j].day == 'H')
            h = true;
          if(stu.lunches[j].time == 'early'){
            pEarlyStudents.push({stuEarly: stu, lunch: j});
          }
        }
        
        //If a student does not have a lunch for any day, add a lunch for that day
        if(!a){
          stu.lunches.push({day: 'A', time: 'mid', zelm: true, row: nextRow, table: 0});
          a = true;
          nextRow++;
        }
        if(!b){
          stu.lunches.push({day: 'B', time: 'mid', zelm: true, row: nextRow, table: 0});
          b = true;
          nextRow++;
        }
        if(!c){
          stu.lunches.push({day: 'C', time: 'mid', zelm: true, row: nextRow, table: 0});
          c = true;
          nextRow++;
        }
        if(!d){
          stu.lunches.push({day: 'D', time: 'mid', zelm: true, row: nextRow, table: 0});
          d = true;
          nextRow++;
        }
        if(!e){
          stu.lunches.push({day: 'E', time: 'mid', zelm: true, row: nextRow, table: 0});
          e = true;
          nextRow++;
        }
        if(!f){
          stu.lunches.push({day: 'F', time: 'mid', zelm: true, row: nextRow, table: 0});
          f = true;
          nextRow++;
        }
        if(!g){
          stu.lunches.push({day: 'G', time: 'mid', zelm: true, row: nextRow, table: 0});
          g = true;
          nextRow++;
        }
        if(!h){
          stu.lunches.push({day: 'H', time: 'mid', zelm: true, row: nextRow, table: 0});
          h = true;
          nextRow++;
        }
        if(stu.lunches.length == 8){
          assignZelm(stu);
          doLateAssignment(stu);
        }else{
          students8Plus.push(stu);
        }
      }
    }
  }

  if(students8Plus.length > 0){
    var message = "These Students have conflicting lunches:\n";
    for(var i = 0; i < students8Plus.length; i++){
      var bad = students8Plus[i];
      message += "" + bad.fName + " " + bad.lName + ": " + bad.lunches.length + " lunches\n";
    }
    SpreadsheetApp.getUi().alert(message);
    return;
  }
  var A = [];
  var B = [];
  var C = [];
  var D = [];
  var E = [];
  var F = [];
  var G = [];
  var H = [];
  
  for(var i = 0; i < pEarlyStudents.length; i++){
    var stu = pEarlyStudents[i].stuEarly;
    var time = stu.lunches[pEarlyStudents[i].lunch].day;
    if(time == "A")
      A.push(pEarlyStudents[i]);
    else if(time == "B")
      B.push(pEarlyStudents[i]);
    else if(time == "C")
      C.push(pEarlyStudents[i]);
    else if(time == "D")
      D.push(pEarlyStudents[i]);
    else if(time == "E")
      E.push(pEarlyStudents[i]);
    else if(time == "F")
      F.push(pEarlyStudents[i]);
    else if(time == "G")
      G.push(pEarlyStudents[i]);
    else if(time == "H")
      H.push(pEarlyStudents[i]);
  }
  
  //Checks to see if there are too many students in any lunch
  var badLunches = 0;
  var errorMessage = "Early Lunch ";
  if(A.length > 133){
    errorMessage += "A ";
    badLunches++;
  }
  if(B.length > 133){
    errorMessage += "B ";
    badLunches++;
  }
  if(C.length > 133){
    errorMessage += "C ";
    badLunches++;
  }
  if(D.length > 133){
    errorMessage += "D ";
    badLunches++;
  }
  if(E.length > 133){
    errorMessage += "E ";
    badLunches++;
  }
  if(F.length > 133){
    errorMessage += "F ";
    badLunches++;
  }
  if(G.length > 133){
    errorMessage += "G ";
    badLunches++;
  }
  if(H.length > 133){
    errorMessage += "H ";
    badLunches++;
  }
  //If there are too many students in a lunch, alert the user to change a teacher's lunch time
  if(badLunches > 1){
    errorMessage += "have too many students. Please change 1 or more teacher lunch times.";
    SpreadsheetApp.getUi().alert(errorMessage);
    return;
  }else if(badLunches == 1){
    errorMessage += "has too many students. Please change 1 or more teacher lunch times.";
    SpreadsheetApp.getUi().alert(errorMessage);
    return;
  }
  
  //Checks to see if there are too few students in each early lunch. If there are, assign students
  //with the lowest zelm number in mid lunch to that lunch
  if(A.length < 133.0){
    moveFromMidToEarly(A.length, 'A', students, A);
  }
  if(B.length < 133){
    moveFromMidToEarly(B.length, 'B', students, B);
  }
  if(C.length < 133){
    moveFromMidToEarly(C.length, 'C', students, C);
  }
  if(D.length < 133){
    moveFromMidToEarly(D.length, 'D', students, D);
  }
  if(E.length < 133){
    moveFromMidToEarly(E.length, 'E', students, E);
  }
  if(F.length < 133){
    moveFromMidToEarly(F.length, 'F', students, F);
  }
  if(G.length < 133){
    moveFromMidToEarly(G.length, 'G', students, G);
  }
  if(H.length < 133){
    moveFromMidToEarly(H.length, 'H', students, H);
  }
  
  //If there all early lunches are full and none are overpopulated, randomly assign students to tables
  if(A.length == 133 && B.length == 133 && C.length == 133 && D.length == 133 && E.length == 133 && F.length == 133 && G.length == 133 && H.length == 133){
    doRandomAssignment(A);
    doRandomAssignment(B);
    doRandomAssignment(C);
    doRandomAssignment(D);
    doRandomAssignment(E);
    doRandomAssignment(F);
    doRandomAssignment(G);
    doRandomAssignment(H);
  }else{
    Logger.log("Too many or too few students in a lunch (shouldn't happen)");
  }
  
  var userProperties = PropertiesService.getUserProperties();
  printStudentsToSheet(students, primary); 
  
  colorBackgrounds(userProperties.getProperty("pLunchTimeColumn"));
  colorBackgrounds(userProperties.getProperty("pTableColumn"));
}

/**
@desc Uses the students array to print all student information to primary sheet
@params - students - the array of students
primary - the sheet the students are being printed to
@funtional - yes
@author - dicksontc
*/
function printStudentsToSheet(students, primary){
  var userProperties = PropertiesService.getUserProperties();
  var primaryData = primary.getDataRange();
  var pValues = primaryData.getValues();
  var pfsf = primaryData.getNumRows();
  var pushArray;
  var finalArray = [];
  var count = 0;
  var sFNameCol = parseInt(userProperties.getProperty("pSFNameColumn"));
  var sLNameCol = parseInt(userProperties.getProperty("pSLNameColumn"));
  var gradeCol = parseInt(userProperties.getProperty("pGradeColumn"));
  var houseCol = parseInt(userProperties.getProperty("pHouseColumn"));
  var lunchDayCol = parseInt(userProperties.getProperty("pLunchDayColumn"));
  var lunchTimeCol = parseInt(userProperties.getProperty("pLunchTimeColumn"));
  var tableCol = parseInt(userProperties.getProperty("pTableColumn"));
  
  var genderCol = parseInt(userProperties.getProperty("pGenderColumn"));
  var cTitleCol = parseInt(userProperties.getProperty("pCourseTitleColumn"));
  var advisorCol = parseInt(userProperties.getProperty("pAdvisorColumn"));
  var cCodeCol = parseInt(userProperties.getProperty("pCourseCodeColumn"));
  var cLengthCol = parseInt(userProperties.getProperty("pCourseLengthColumn"));
  var cIDCol = parseInt(userProperties.getProperty("pCourseIDColumn"));
  var sIDCol = parseInt(userProperties.getProperty("pSectionIDColumn"));
  var tFNameCol = parseInt(userProperties.getProperty("pTFNameColumn"));
  var tLNameCol = parseInt(userProperties.getProperty("pTLNameColumn"));
  var blockCol = parseInt(userProperties.getProperty("pBlockColumn"));
  var dobCol = parseInt(userProperties.getProperty("pDOBColumn"));
  var tableHeadCol = parseInt(userProperties.getProperty("pTableHeadColumn"));
  
  for(var post = 0; post < students.length; post++){
    var fin = students[post];
    for(var lun = 0; lun < fin.lunches.length; lun++){
      count++;
      var lunch = fin.lunches[lun];
      var table = lunch.table;
      var row = lunch.row;
      var zelm = "z" + fin.zelm;
      if(lunch.time == 'mid')
        table = '';
      if(row > pfsf){
        finalArray.push([fin.fName, fin.lName, fin.grade, "", "", zelm, "", "", "", "", "", "", "", "", "", lunch.day, lunch.time, table, fin.house]);
      }else{        
        pushArray = new Array(19);
        pushArray[sFNameCol] = fin.fName;
        pushArray[sLNameCol] = fin.lName;
        pushArray[gradeCol] = fin.grade;
        pushArray[houseCol] = fin.house;
        pushArray[lunchDayCol] = lunch.day;
        pushArray[lunchTimeCol] = lunch.time;
        pushArray[tableCol] = table;
        
        pushArray[genderCol] = pValues[row][genderCol];
        pushArray[cTitleCol] =  pValues[row][cTitleCol];
        pushArray[advisorCol] =  pValues[row][advisorCol];
        pushArray[cCodeCol] =  pValues[row][cCodeCol];
        pushArray[cLengthCol] =  pValues[row][cLengthCol];
        pushArray[cIDCol] =  pValues[row][cIDCol];
        pushArray[sIDCol] = pValues[row][sIDCol];
        pushArray[tFNameCol] = pValues[row][tFNameCol];
        pushArray[tLNameCol] = pValues[row][tLNameCol];
        pushArray[blockCol] = pValues[row][blockCol];
        pushArray[dobCol] = pValues[row][dobCol];
        pushArray[tableHeadCol] = pValues[row][tableHeadCol];
        finalArray.push(pushArray);
      }
    }
  }
  var sheetRange = primary.getRange(2, 1, count, 19);
  sheetRange.setValues(finalArray);
  
}

/**
@desc Sets the user properies to make use of global variables
@params - pNumColumns - the number of columns in Final Student Data
pValues - the array of the Final Student Data
tNumColumns - the number of columns in Faculty Choices
tValues - the array of Faculty Choices
@funtional - yes
@author - dicksontc
*/
function setProperties(pNumColumns, pValues, tNumColumns, tValues){
  var properties = {pLunchTimeColumn: 0, pLunchDayColumn: 0, pSFNameColumn: 0,
                    pSLNameColumn: 0, pTFNameColumn: 0, pTLNameColumn: 0,
                    pAdvisorColumn: 0, pGenderColumn: 0,
                    pCourseTitleColumn: 0, pCourseCodeColumn: 0, pCourseLengthColumn: 0,
                    pCourseIDColumn: 0, pSectionIDColumn: 0, pBlockColumn: 0, pDOBColumn: 0,
                    pTableHeadColumn: 0,pTableColumn: 0, pGradeColumn: 0,
                    pHouseColumn: 0, tFNameColumn: 0, tLNameColumn: 0,
                    tLunchDayColumn: 0, tLunchTimeColumn: 0};
  
  var pHeaders = getListOfColumns(pValues);
  var tHeaders = getListOfColumns(tValues);
  
  properties.pLunchTimeColumn = getColumnIndex(pHeaders, "Lunch Time");
  properties.pLunchDayColumn = getColumnIndex(pHeaders, "Lunch Day");
  properties.pSFNameColumn = getColumnIndex(pHeaders, "First Name");
  properties.pSLNameColumn = getColumnIndex(pHeaders, "Last Name");
  properties.pTFNameColumn = getColumnIndex(pHeaders, "Faculty First Name");
  properties.pTLNameColumn = getColumnIndex(pHeaders, "Faculty Last Name");
  properties.pAdvisorColumn = getColumnIndex(pHeaders, "Advisor");
  properties.pGenderColumn = getColumnIndex(pHeaders, "Gender");
  properties.pCourseTitleColumn = getColumnIndex(pHeaders, "Course Title");
  properties.pCourseCodeColumn = getColumnIndex(pHeaders, "Course Code");
  properties.pCourseLengthColumn = getColumnIndex(pHeaders, "Course Length");
  properties.pCourseIDColumn = getColumnIndex(pHeaders, "Course ID");
  properties.pSectionIDColumn = getColumnIndex(pHeaders, "Section Identifier");
  properties.pBlockColumn = getColumnIndex(pHeaders, "Block");
  properties.pDOBColumn = getColumnIndex(pHeaders, "Date of Birth");
  properties.pHouseColumn = getColumnIndex(pHeaders, "House");
  properties.pTableHeadColumn = getColumnIndex(pHeaders, "Table Head");
  properties.pTableColumn = getColumnIndex(pHeaders, "Lunch Table");
  properties.pGradeColumn = getColumnIndex(pHeaders, "Grade Level");
  
  properties.tFNameColumn = getColumnIndex(tHeaders, "First Name");
  properties.tLNameColumn = getColumnIndex(tHeaders, "Last Name");
  properties.tLunchDayColumn = getColumnIndex(tHeaders, "Lunch Day");
  properties.tLunchTimeColumn = getColumnIndex(tHeaders, "Lunch Assignment");

  
  var userProperties = PropertiesService.getUserProperties();
  userProperties.setProperties(properties);
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
  var userProperties = PropertiesService.getUserProperties();
  var sFNameCol = parseInt(userProperties.getProperty("pSFNameColumn"));
  var sLNameCol = parseInt(userProperties.getProperty("pSLNameColumn"));
  var gradeCol = parseInt(userProperties.getProperty("pGradeColumn"));
  var houseCol = parseInt(userProperties.getProperty("pHouseColumn"));
  var lunchDayCol = parseInt(userProperties.getProperty("pLunchDayColumn"));
  var tFNameCol = parseInt(userProperties.getProperty("pTFNameColumn"));
  var tLNameCol = parseInt(userProperties.getProperty("pTLNameColumn"));
  
  for(var i = 0; i < pNumRows; i++){
    var day = pValues[i][lunchDayCol];
    var fname = pValues[i][sFNameCol];
    var lname = pValues[i][sLNameCol];
    var grad = pValues[i][gradeCol];
    var house = pValues[i][houseCol];
    
    var teacherFName = pValues[i][tFNameCol];
    var teacherLName = pValues[i][tLNameCol];
    
    var val;
    var zCheck = false;
    
    for(var j = 0; j < teachers.length; j++){
      var teach = teachers[j];
      if(teacherFName == '' && teacherLName == ''){
        val = 'mid';
        j = teachers.length;
        zCheck = true;
      }else if(teach.fName == teacherFName && teach.lName == teacherLName){
        for(var k = 0; k < teach.lunches.length; k++){
          if(teach.lunches[k].day == day){
            val = teach.lunches[k].time;
            k = teach.lunches.length;
            j = teachers.length;
          }
        }
      }
    }
    
    if(temp.length == 0){
      
      if(fname == "First Name") {
        var lunches = [];
        lunches.push({day: day, time: "Lunch Time", zelm: zCheck, row: i, table: "Lunch Table"});
        temp.push({fName: fname, lName: lname, grade: grad, lunches: lunches, zelm: 0, house: house});
      } else {
        var lunches = [];
        lunches.push({day: day, time: val, zelm: zCheck, row: i, table: 0});
        temp.push({fName: fname, lName: lname, grade: grad, lunches: lunches, zelm: 0, house: house});
      }
    }else{
      for(var j = 0; j < temp.length; j++){
        if(temp[j].fName == fname && temp[j].lName == lname){
          if(fname == "First Name") {
            temp[j].lunches.push({day: day, time: "Lunch Time", zelm: zCheck, row: i, table: "Lunch Table"});
            j = temp.length;
          } else {
            temp[j].lunches.push({day: day, time: val, zelm: zCheck, row: i, table: 0});
            j = temp.length;
          }
        }
        if(j == temp.length - 1){
          if(fname == "First Name") {
            var lunches = [];
            lunches.push({day: day, time: "Lunch Time", zelm: zCheck, row: i, table: "Lunch Table"});
            temp.push({fName: fname, lName: lname, grade: grad, lunches: lunches, zelm: 0, house: house});
            j = temp.length;
          } else {
            var lunches = [];
            lunches.push({day: day, time: val, zelm: zCheck, row: i, table: 0});
            temp.push({fName: fname, lName: lname, grade: grad, lunches: lunches, zelm: 0, house: house});
            j = temp.length;
          }
        }
      }
    }
  }
  return temp;
}

/**
@desc Changes the background colors and/or fonts of certain cells in a given column
@params - column - the column in which the cells need to be colored
@funtional - yes
@author - dicksontc
*/
function colorBackgrounds(column){
  var sheet = SpreadsheetApp.getActiveSheet();
  var stuData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Final Student Data");
  var ran = stuData.getRange(1, column + 1, stuData.getDataRange().getNumRows());
  var vals = ran.getValues();
  var col = ran.getNumColumns();
  var ro = ran.getNumRows();
  var rowColors = [];
  var time = false;
  var table = false;
  
  for(var c = 0; c < vals.length; c++) {
    if( vals[c] == "Lunch Time") {
      time = true;
    } else if ( vals[c] == "Lunch Table") {
      table = true;
    }
  }
  
  if(time){

    for(var i = 0; i < ro; i++){
      rowColors[i] = [];
      if(vals[i] == "early")
        rowColors[i].push("YELLOW");
      else if(vals[i] == "late")
        rowColors[i].push("#8db4e2");
      else
        rowColors[i].push("WHITE");
    }
    ran.setBackgrounds(rowColors);
  }else if(table){

    var fonts = [];
    for(var i = 0; i < ro; i++){
      rowColors[i] = [];
      fonts[i] = [];
      if(vals[i] == "Ledger"){
        rowColors[i].push("#660066");
        fonts[i].push("YELLOW");
      }else{
        if(vals[i] == "Academy")
          fonts[i].push("#3366ff");
        else if(vals[i] == "Arrow")
          fonts[i].push("#008000");
        else if(vals[i] == "Crest")
          fonts[i].push("#ff0000");
        else
          fonts[i].push("BLACK");
        rowColors[i].push("WHITE");
      }
    }
    ran.setFontColors(fonts);
    ran.setBackgrounds(rowColors);
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
  for(var m = 0; m < stu.lunches.length; m++){
    if(stu.lunches[m].time == 'early')
      stu.zelm += 100;
    else if(stu.lunches[m].time == 'mid')
      stu.zelm += 1;
    else if(stu.lunches[m].time == 'late')
      stu.zelm += 10;
  }
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
  var userProperties = PropertiesService.getUserProperties();
  var fNameCol = parseInt(userProperties.getProperty("tFNameColumn"));
  var lNameCol = parseInt(userProperties.getProperty("tLNameColumn"));
  var lunchTimeCol = parseInt(userProperties.getProperty("tLunchTimeColumn"));
  var lunchDayCol = parseInt(userProperties.getProperty("tLunchDayColumn"));

  for(var i = 0; i < tNumRows; i++){
    var fname = tValues[i][fNameCol];
    var lname = tValues[i][lNameCol];
    var val = tValues[i][lunchTimeCol];
    var day = tValues[i][lunchDayCol];
    if(teachers.length == 0){
      var lunches = [];
      lunches.push({day: day, time: val});
      teachers.push({fName: fname, lName: lname, lunches: lunches});
    }else{
      for(var j = 0; j < teachers.length; j++){
        if(teachers[j].fName == fname && teachers[j].lName == lname){
          teachers[j].lunches.push({day: day, time: val});
          j = teachers.length;
        }
        if(j == teachers.length - 1){
          var lunches = [];
          lunches.push({day: day, time: val});
          teachers.push({fName: fname, lName: lname, lunches: lunches});
          j = teachers.length;
        }
      }
    }
  }
  return teachers;
}

/**
@desc Changes the students with the lowest zelms' lunch times to early
for a specific day with fewer than 133 students
@params - numStudents - the number of students currently in that lunch
day - the day of the early lunch with fewer than 133 students
students - the list of students
@funtional - yes
@author - dicksontc
*/
function moveFromMidToEarly(numStudents, day, students, dayStudents){
  var needed = 133 - numStudents;
  var zelmStudents = [];
  for(var i = 0; i < students.length; i++){
    var student = students[i];
    for(var j = 0; j < student.lunches.length; j++){
      if(student.lunches[j].day == day){
        if(student.lunches[j].zelm){
          zelmStudents.push({stu: student, j: j});
        }
        j = student.lunches.length;
      }
    }
  } 
  zelmStudents.sort(function(a, b) {
    return parseFloat(a.stu.zelm) - parseFloat(b.stu.zelm);
  });
  while(needed > 0){
    if(zelmStudents.length > 0){      
      var student = zelmStudents[0].stu;
      var x = zelmStudents[0].j;
      student.lunches[x].time = 'early';
      student.lunches[x].zelm = false;
      student.zelm += 99; // minus 1 and plus 100 for mid to early
      dayStudents.push({stuEarly: student, lunch: x});
      zelmStudents = zelmStudents.slice(1, zelmStudents.length);
      needed--;
    }else{
      needed = 0;
    }
  }
}

/**
@desc Assigns students with late lunches to the table of their house
@params - student - the student whose lunch is being assigned
@funtional - yes
@author - dicksontc
*/
function doLateAssignment(student){
  for(var i = 0; i < student.lunches.length; i++){
    if(student.lunches[i].time == 'late')
      student.lunches[i].table = student.house;
  }
}

/**
@desc Shuffles a given array
@params - array - the array to be shuffled
@funtional - yes
@author - dicksontc
*/
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

/**
@desc Randomly assignes a lunch table to the students who have
early lunches
@params - students - the students in early lunch on a particular day
@funtional - yes
@author - dicksontc
*/
function doRandomAssignment(students){  
  var gNine = [];
  var gTen = [];
  var gEleven = [];
  var gTwelve = [];
  
  for(var i = 0; i < students.length; i++){
    var stu = students[i].stuEarly;
    if(stu.grade == 9)
      gNine.push(students[i]);
    else if(stu.grade == 10)
      gTen.push(students[i]);
    else if(stu.grade == 11)
      gEleven.push(students[i]);
    else if(stu.grade == 12)
      gTwelve.push(students[i]);
  }
  
  var nums = [];
  for(var i = 0; i < 133; i++){
    nums.push(i%19+1);
  }
  var numIndex = -1;
  
  shuffleArray(gNine);
  shuffleArray(gTen);
  shuffleArray(gEleven);
  shuffleArray(gTwelve);
  
  for(var i = 0; i < gNine.length; i++){
    numIndex++;
    var student = gNine[i].stuEarly;
    var lunch = gNine[i].lunch;
    student.lunches[lunch].table = nums[numIndex];
  }
  for(var i = 0; i < gTen.length; i++){
    numIndex++;
    var student = gTen[i].stuEarly;
    var lunch = gTen[i].lunch;
    student.lunches[lunch].table = nums[numIndex];
  }
  for(var i = 0; i < gEleven.length; i++){
    numIndex++;
    var student = gEleven[i].stuEarly;
    var lunch = gEleven[i].lunch;
    student.lunches[lunch].table = nums[numIndex];
  }
  for(var i = 0; i < gTwelve.length; i++){
    numIndex++;
    var student = gTwelve[i].stuEarly;
    var lunch = gTwelve[i].lunch;
    student.lunches[lunch].table = nums[numIndex];
  } 
}