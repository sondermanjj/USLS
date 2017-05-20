//JSHint verified 5/15/2017 sondermanjj

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
  
  var primaryData = primary.getDataRange();
  var teacherData = teacher.getDataRange();
  
  var pValues = primaryData.getValues();
  var tValues = teacherData.getValues();
  var stu;
  
  var pNumRows = primaryData.getNumRows();
  var tNumRows = teacherData.getNumRows();
  
  var students = [];  
  var teachers = [];
  
  teachers = getTeachers(tValues, tNumRows);
  students = getStudents(pValues, pNumRows, teachers);
  
  var pEarlyStudents = [];
  var students8Plus = [];
  
  //Checks to see if each student has a lunch for each day, adds students with an early lunch
  //to an array, and do the table assignments for late lunches
  for(var i = 0; i < students.length; i++){
    stu = students[i];
    if(stu.fName !== "First Name") {
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
          stu.lunches.push({day: 'A', time: 'mid', zelm: true, table: ""});
          a = true;
        }
        if(!b){
          stu.lunches.push({day: 'B', time: 'mid', zelm: true, table: ""});
          b = true;
        }
        if(!c){
          stu.lunches.push({day: 'C', time: 'mid', zelm: true, table: ""});
          c = true;
        }
        if(!d){
          stu.lunches.push({day: 'D', time: 'mid', zelm: true, table: ""});
          d = true;
        }
        if(!e){
          stu.lunches.push({day: 'E', time: 'mid', zelm: true, table: ""});
          e = true;
        }
        if(!f){
          stu.lunches.push({day: 'F', time: 'mid', zelm: true, table: ""});
          f = true;
        }
        if(!g){
          stu.lunches.push({day: 'G', time: 'mid', zelm: true, table: ""});
          g = true;
        }
        if(!h){
          stu.lunches.push({day: 'H', time: 'mid', zelm: true, table: ""});
          h = true;
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
    for(i = 0; i < students8Plus.length; i++){
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
  
  for(i = 0; i < pEarlyStudents.length; i++){
    stu = pEarlyStudents[i].stuEarly;
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
  
  var documentProperties = PropertiesService.getDocumentProperties();
  printStudentsToSheet(students, primary); 
  
  colorBackgrounds(documentProperties.getProperty("pLunchTimeColumn"));
  colorBackgrounds(documentProperties.getProperty("pTableColumn"));
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
                if((oldtime == "mid" || oldtime == "late") && (newtime == "mid" || newtime == "late")){
                  students[j].lunches[h].time = newtime;
                  if(newtime == "mid")
                    students[j].lunches[h].table = "";
                  else
                    students[j].lunches[h].table = stu.house;
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
                  
                  if(change.oldTime == "early"){
                    students[j].lunches[h].time = newtime;
                    if(newtime == "mid")
                      students[j].lunches[h].table = "";
                    else
                      students[j].lunches[h].table = students[j].house;
                    students[affectedStu].lunches[affectedLunch].time = oldtime;
                    students[affectedStu].lunches[affectedLunch].table = change.oldTable;
                  }else if(newtime == "early"){
                    students[j].lunches[h].time = newtime;
                    students[j].lunches[h].table = students[affectedStu].lunches[affectedLunch].table;
                    students[affectedStu].lunches[affectedLunch].time = oldtime;
                    if(oldtime == "mid")
                      students[affectedStu].lunches[affectedLunch].table = "";
                    else
                      students[affectedStu].lunches[affectedLunch].table = students[affectedStu].house;
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
    var documentProperties = PropertiesService.getDocumentProperties();
    colorBackgrounds(documentProperties.getProperty("pLunchTimeColumn"));
    colorBackgrounds(documentProperties.getProperty("pTableColumn"));
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
    var change = {fName: cVals[i][fNameCol], lName: cVals[i][lNameCol], oldTime: cVals[i][timeCol], oldDay: cVals[i][dayCol],
                  oldTable: cVals[i][tableCol], newTime: cVals[i+1][timeCol], newDay: cVals[i+1][dayCol], newTable: cVals[i+1][tableCol]};
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
          zelmStudents.push({stu: student, j: j, stuNum: i});
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
  
  var sFNameCol = parseInt(documentProperties.getProperty("pSFNameColumn"));
  var sLNameCol = parseInt(documentProperties.getProperty("pSLNameColumn"));
  var gradeCol = parseInt(documentProperties.getProperty("pGradeColumn"));
  var houseCol = parseInt(documentProperties.getProperty("pHouseColumn"));
  var lunchDayCol = parseInt(documentProperties.getProperty("pLunchDayColumn"));
  var lunchTableCol = parseInt(documentProperties.getProperty("pTableColumn"));
  var tFNameCol = parseInt(documentProperties.getProperty("pTFNameColumn"));
  var tLNameCol = parseInt(documentProperties.getProperty("pTLNameColumn"));
  
  var advisorCol = parseInt(documentProperties.getProperty("pAdvisorColumn"));
  var cCodeCol = parseInt(documentProperties.getProperty("pCourseCodeColumn"));
  var cLengthCol = parseInt(documentProperties.getProperty("pCourseLengthColumn"));
  var cIDCol = parseInt(documentProperties.getProperty("pCourseIDColumn"));
  var sIDCol = parseInt(documentProperties.getProperty("pSectionIDColumn"));
  var blockCol = parseInt(documentProperties.getProperty("pBlockColumn"));
  var dobCol = parseInt(documentProperties.getProperty("pDOBColumn"));
  var tableHeadCol = parseInt(documentProperties.getProperty("pTableHeadColumn"));
  var cTitleCol = parseInt(documentProperties.getProperty("pCourseTitleColumn"));
  var lunchTimeCol = parseInt(documentProperties.getProperty("pLunchTimeColumn"));
  var genderCol = parseInt(documentProperties.getProperty("pGenderColumn"));
  
  for(var post = 0; post < students.length; post++){
    var fin = students[post];
    var gender = fin.gender;
    var dob = fin.dob;
    if(dob instanceof Date)
      dob = "" + dob.getMonth() + "/" + dob.getDay() + "/" + dob.getFullYear();
    var advisor = fin.advisor;
    var zelm = "z" + fin.zelm;
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
  
  var sFNameCol = parseInt(documentProperties.getProperty("pSFNameColumn"));
  var sLNameCol = parseInt(documentProperties.getProperty("pSLNameColumn"));
  var gradeCol = parseInt(documentProperties.getProperty("pGradeColumn"));
  var houseCol = parseInt(documentProperties.getProperty("pHouseColumn"));
  var lunchDayCol = parseInt(documentProperties.getProperty("pLunchDayColumn"));
  var lunchTableCol = parseInt(documentProperties.getProperty("pTableColumn"));
  var tFNameCol = parseInt(documentProperties.getProperty("pTFNameColumn"));
  var tLNameCol = parseInt(documentProperties.getProperty("pTLNameColumn"));
  var advisorCol = parseInt(documentProperties.getProperty("pAdvisorColumn"));
  var codeCol = parseInt(documentProperties.getProperty("pCourseCodeColumn"));
  var lengthCol = parseInt(documentProperties.getProperty("pCourseLengthColumn"));
  var cIDCol = parseInt(documentProperties.getProperty("pCourseIDColumn"));
  var sIDCol = parseInt(documentProperties.getProperty("pSectionIDColumn"));
  var blockCol = parseInt(documentProperties.getProperty("pBlockColumn"));
  var dobCol = parseInt(documentProperties.getProperty("pDOBColumn"));
  var tableHeadCol = parseInt(documentProperties.getProperty("pTableHeadColumn"));
  var titleCol = parseInt(documentProperties.getProperty("pCourseTitleColumn"));
  var lunchTimeCol = parseInt(documentProperties.getProperty("pLunchTimeColumn"));
  var genderCol = parseInt(documentProperties.getProperty("pGenderColumn"));

  for(var i = 0; i < pNumRows; i++){
    var day = pValues[i][lunchDayCol];
    var fname = pValues[i][sFNameCol];
    var lname = pValues[i][sLNameCol];
    var grad = pValues[i][gradeCol];
    var house = pValues[i][houseCol];
    var table = pValues[i][lunchTableCol];
    
    var teacherFName = pValues[i][tFNameCol];
    var teacherLName = pValues[i][tLNameCol];
    
    var advisor = pValues[i][advisorCol];
    var code = pValues[i][codeCol];
    var length = pValues[i][lengthCol];
    var cID = pValues[i][cIDCol];
    var sID = pValues[i][sIDCol];
    var block = pValues[i][blockCol];
    var dob = pValues[i][dobCol];
    var tableHead = pValues[i][tableHeadCol];
    var gender = pValues[i][genderCol];
    var title = pValues[i][titleCol];
    var time = pValues[i][lunchTimeCol];
    
    var zCheck = false;
    
    var checkName = false;
    var checkAdvisor = false;
    for(var j = 0; j < teachers.length; j++){
      var teach = teachers[j];
      if(!checkName){
        if(teacherFName === '' && teacherLName === ''){
          if(time != "late" && time != "early"){
            time = 'mid';
          }
          checkName = true;
          zCheck = true;
        }else if(teach.fName == teacherFName && teach.lName == teacherLName){
          for(var k = 0; k < teach.lunches.length; k++){
            if(teach.lunches[k].day == day){
              time = teach.lunches[k].time;
              k = teach.lunches.length;
              checkName = true;
            }
          }
        }
      }
      if(!checkAdvisor){
        var adv = teach.fName + " " + teach.lName;
        if(adv === advisor){
          house = teach.house;
          checkAdvisor = true;
        }
      }
      if(checkAdvisor && checkName){
        j = teachers.length;
      }
    }
    
    var lunchObj = {day: day, time: time, zelm: zCheck, table: table, code: code,
                    length: length, cID: cID, sID: sID, block: block, tableHead: tableHead, title: title,
                    teacherFName: teacherFName, teacherLName: teacherLName};
    
    var lunches;
    
    if(temp.length === 0){      
      lunches = [];
      lunches.push(lunchObj);
      temp.push({fName: fname, lName: lname, grade: grad, lunches: lunches, zelm: 0, house: house,
                 advisor: advisor, dob: dob, gender: gender});
    }else{
      for(j = 0; j < temp.length; j++){
        if(temp[j].fName == fname && temp[j].lName == lname){
          temp[j].lunches.push(lunchObj);
          j = temp.length;
        }
        if(j == temp.length - 1){
          lunches = [];
          lunches.push(lunchObj);
          temp.push({fName: fname, lName: lname, grade: grad, lunches: lunches, zelm: 0, house: house,
                     advisor: advisor, dob: dob, gender: gender});
          j = temp.length;
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
  var stuData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PropertiesService.getDocumentProperties().getProperty("studentData"));
  var ran = stuData.getRange(1, parseInt(column) + 1, stuData.getDataRange().getNumRows());
  var vals = ran.getValues();
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
    for(var k = 0; k < ro; k++){
      rowColors[k] = [];
      fonts[k] = [];
      if(vals[k] == "Ledger"){
        rowColors[k].push("#660066");
        fonts[k].push("YELLOW");
      }else{
        if(vals[k] == "Academy")
          fonts[k].push("#3366ff");
        else if(vals[k] == "Arrow")
          fonts[k].push("#008000");
        else if(vals[k] == "Crest")
          fonts[k].push("#ff0000");
        else
          fonts[k].push("BLACK");
        rowColors[k].push("WHITE");
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
  stu.zelm = 0;
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
  var documentProperties = PropertiesService.getDocumentProperties();
  var fNameCol = parseInt(documentProperties.getProperty("tFNameColumn"));
  var lNameCol = parseInt(documentProperties.getProperty("tLNameColumn"));
  var lunchTimeCol = parseInt(documentProperties.getProperty("tLunchTimeColumn"));
  var lunchDayCol = parseInt(documentProperties.getProperty("tLunchDayColumn"));
  var houseCol = parseInt(documentProperties.getProperty("tHouseColumn"));
  var lunches;
  for(var i = 0; i < tNumRows; i++){
    var fname = tValues[i][fNameCol];
    var lname = tValues[i][lNameCol];
    var val = tValues[i][lunchTimeCol];
    var day = tValues[i][lunchDayCol];
    var house = tValues[i][houseCol];
    if(teachers.length === 0){
      lunches = [];
      lunches.push({day: day, time: val});
      teachers.push({fName: fname, lName: lname, house: house, lunches: lunches});
    }else{
      for(var j = 0; j < teachers.length; j++){
        if(teachers[j].fName == fname && teachers[j].lName == lname){
          teachers[j].lunches.push({day: day, time: val});
          j = teachers.length;
        }
        if(j == teachers.length - 1){
          lunches = [];
          lunches.push({day: day, time: val});
          teachers.push({fName: fname, lName: lname, house: house, lunches: lunches});
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
  var zelmStudents = getZelmStudents(students, day);
  
  while(needed > 0){
    if(zelmStudents.length > 0){      
      var student = zelmStudents[0].stu;
      var x = zelmStudents[0].j;
      student.lunches[x].time = 'early';
      //student.lunches[x].zelm = false;
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
  var student;
  var lunch;
  
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
  for(i = 0; i < 133; i++){
    nums.push(i%19+1);
  }
  var numIndex = -1;
  
  shuffleArray(gNine);
  shuffleArray(gTen);
  shuffleArray(gEleven);
  shuffleArray(gTwelve);
  
  for(i = 0; i < gNine.length; i++){
    numIndex++;
    student = gNine[i].stuEarly;
    lunch = gNine[i].lunch;
    student.lunches[lunch].table = nums[numIndex];
  }
  for(i = 0; i < gTen.length; i++){
    numIndex++;
    student = gTen[i].stuEarly;
    lunch = gTen[i].lunch;
    student.lunches[lunch].table = nums[numIndex];
  }
  for(i = 0; i < gEleven.length; i++){
    numIndex++;
    student = gEleven[i].stuEarly;
    lunch = gEleven[i].lunch;
    student.lunches[lunch].table = nums[numIndex];
  }
  for(i = 0; i < gTwelve.length; i++){
    numIndex++;
    student = gTwelve[i].stuEarly;
    lunch = gTwelve[i].lunch;
    student.lunches[lunch].table = nums[numIndex];
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
  if(rows >= 3){
    if(/\S/.test(changesSheet.getDataRange().getValues()[2][0])){
      var response = Browser.msgBox("Auto-Reassign", "Do you want to automatically re-assign the students?", Browser.Buttons.YES_NO);
      // Process the user's response.
      if (response == "yes") {
        parseStudentChanges();
      } else {
        //Nothing will happen.
      }
    }
  }
}