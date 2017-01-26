function assignStudentLunchDays() {
  var s2 = new Date().getTime();
  var sheet = SpreadsheetApp.getActiveSheet();
  var primary = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Primary List");
  var teacher = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Faculty Choices");
  
  var primaryData = primary.getDataRange();
  var teacherData = teacher.getDataRange();
  
  var pValues = primaryData.getValues();
  var tValues = teacherData.getValues();
  
  var pNumRows = primaryData.getNumRows();
  var pNumColumns = primaryData.getNumColumns();
  var tNumRows = teacherData.getNumRows();
  var tNumColumns = teacherData.getNumColumns();
  
  var pLunchTimeColumn;
  var pLunchDayColumn;
  var pSFNameColumn;
  var pSLNameColumn;
  var pTFNameColumn;
  var pTLNameColumn;
  var pTableColumn;
  var pGradeColumn;
  var pHouseColumn;
  var tFNameColumn;
  var tLNameColumn;
  var tLunchDayColumn;
  var tLunchTimeColumn;
  
  var students = [];
  
  //Set needed variables in Primary List
  for(var i = 0; i < pNumColumns; i++){
    var column = pValues[0][i];
    if(column == 'Lunch Day') {
      pLunchDayColumn = i ;
    }else if(column == 'Lunch Time'){
      pLunchTimeColumn = i;
    }else if(column == 'Faculty First Name'){
      pTFNameColumn = i;
    }else if(column == 'Faculty Last Name'){
      pTLNameColumn = i;
    }else if(column == 'First Name'){
      pSFNameColumn = i;
    }else if(column == 'Last Name'){
      pSLNameColumn = i;
    }else if(column == 'Lunch Table'){
      pTableColumn = i;
    }else if(column == 'House'){
      pHouseColumn = i;
    }else if(column == 'Grade Level'){
      pGradeColumn = i;
    }
  }
  
  //Set needed variables in Faculty Choices
  for(var i = 0; i < tNumColumns; i++){
    var column = tValues[0][i];
    if(column == 'Lunch Day') {
      tLunchDayColumn = i ;
    }else if(column == 'First Name'){
      tFNameColumn = i;
    }else if(column == 'Last Name'){
      tLNameColumn = i;
    }else if(column == 'Lunch Assignment'){
      tLunchTimeColumn = i;
    }
  }
  
  
  
  var teachers = [];
  teachers = getTeachers(tValues, tFNameColumn, tLNameColumn, tLunchTimeColumn, tLunchDayColumn, tNumRows);
  //For every column in primary list assign student a lunch time based on the teacher
  //they have
  
  for(var i = 1; i < pNumRows; i++){
    var day = pValues[i][pLunchDayColumn];
    var fname = pValues[i][pSFNameColumn];
    var lname = pValues[i][pSLNameColumn];
    var grad = pValues[i][pGradeColumn];
    var house = pValues[i][pHouseColumn];
    
    var teacherFName = pValues[i][pTFNameColumn];
    var teacherLName = pValues[i][pTLNameColumn];
    
    var val;
    
    for(var j = 0; j < teachers.length; j++){
      var teach = teachers[j];
      if(teacherFName == '' && teacherLName == ''){
        val = 'mid';
        j = teachers.length;
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
    ///////
    
    if(students.length == 0){
      var lunches = [];
      lunches.push({day: day, time: val, zelm: false, row: i, table: 0});
      students.push({fName: fname, lName: lname, grade: grad, lunches: lunches, zelm: 0, house: house});
    }else{
      for(var j = 0; j < students.length; j++){
        if(students[j].fName == fname && students[j].lName == lname){
          students[j].lunches.push({day: day, time: val, zelm: false, row: i, table: 0});
          j = students.length;
        }
        if(j == students.length - 1){
          var lunches = [];
          lunches.push({day: day, time: val, zelm: false, row: i, table: 0});
          students.push({fName: fname, lName: lname, grade: grad, lunches: lunches, zelm: 0, house: house});
          j = students.length;
        }
      }
    }
  }
  
  
  var nextRow = primaryData.getNumRows();
  
  
  for(var i = 0; i < students.length; i++){
    var stu = students[i];
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
      }
      
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
      
      assignZelm(stu);
      
    }
  }
  
  
  var pEarlyStudents = [];
  for(var i = 0; i < students.length; i++){
    var student = students[i];
    for(var j = 0; j < student.lunches.length; j++){
      if(student.lunches[j].time == 'early'){
        pEarlyStudents.push({stuEarly: student, lunch: j});
      }
    }
    doLateAssignment(student);
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
  
  var cont = false;
  //While is for when I get picking new teachers down
  //while(!cont){
  if(A.length > 133 || B.length > 133 || C.length > 133 || D.length > 133 || E.length > 133 || F.length > 133 || G.length > 133 || H.length > 133){
    //Make teacher(s) pick new lunch times
  }else{
    cont = true;
  }
  //}
  
  if(A.length < 133.0){
    moveFromMidToEarly(A.length, 'A', students);
  }
  if(B.length < 133){
    moveFromMidToEarly(B.length, 'B', students);
  }
  if(C.length < 133){
    moveFromMidToEarly(C.length, 'C', students);
  }
  if(D.length < 133){
    moveFromMidToEarly(D.length, 'D', students);
  }
  if(E.length < 133){
    moveFromMidToEarly(E.length, 'E', students);
  }
  if(F.length < 133){
    moveFromMidToEarly(F.length, 'F', students);
  }
  if(G.length < 133){
    moveFromMidToEarly(G.length, 'G', students);
  }
  if(H.length < 133){
    moveFromMidToEarly(H.length, 'H', students);
  }
  
  var e2 = new Date().getTime();
  Logger.log("Time taken for assigning student lunches based on teachers: " + (e2 - s2));
  var hi = Logger.getLog();
  
  //For Testing
  doRandomAssignment(A);
  doRandomAssignment(B);
  doRandomAssignment(C);
  doRandomAssignment(D);
  doRandomAssignment(E);
  doRandomAssignment(F);
  doRandomAssignment(G);
  doRandomAssignment(H);
  //
  
  if(A.length == 133 && B.length == 133 && C.length == 133 && D.length == 133 && E.length == 133 && F.length == 133 && G.length == 133 && H.length == 133){
    doRandomAssignment(A, pTableColumn);
    doRandomAssignment(B, pTableColumn);
    doRandomAssignment(C, pTableColumn);
    doRandomAssignment(D, pTableColumn);
    doRandomAssignment(E, pTableColumn);
    doRandomAssignment(F, pTableColumn);
    doRandomAssignment(G, pTableColumn);
    doRandomAssignment(H, pTableColumn);
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
function getTeachers(tValues, tFNameColumn, tLNameColumn, tLunchTimeColumn, tLunchDayColumn, tNumRows){
  var teachers = [];
  for(var i = 1; i < tNumRows; i++){
    var fname = tValues[i][tFNameColumn];
    var lname = tValues[i][tLNameColumn];
    var val = tValues[i][tLunchTimeColumn];
    var day = tValues[i][tLunchDayColumn];
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
function moveFromMidToEarly(numStudents, day, students){
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
    var time = student.lunches[gNine[i].lunch].day;
    student.lunches[time].table = nums[numIndex];
  }
  for(var i = 0; i < gTen.length; i++){
    numIndex++;
    var student = gTen[i].stuEarly;
    var time = student.lunches[gTen[i].lunch].day;
    student.lunches[time].table = nums[numIndex];
  }
  for(var i = 0; i < gEleven.length; i++){
    numIndex++;
    var student = gEleven[i].stuEarly;
    var time = student.lunches[gEleven[i].lunch].day;
    student.lunches[time].table = nums[numIndex];
  }
  for(var i = 0; i < gTwelve.length; i++){
    numIndex++;
    var student = gTwelve[i].stuEarly;
    var time = student.lunches[gTwelve[i].lunch].day;
    student.lunches[time].table = nums[numIndex];
  } 
}