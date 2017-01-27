function mainTester(){
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
  
  var students = [];
  for(var i = 1; i < pNumRows; i++){
    var day = pValues[i][pLunchDayColumn];
    var fname = pValues[i][pSFNameColumn];
    var lname = pValues[i][pSLNameColumn];
    var grad = pValues[i][pGradeColumn];
    var house = pValues[i][pHouseColumn];
    var time = pValues[i][pLunchTimeColumn]
    
    if(students.length == 0){
      var lunches = [];
      lunches.push({day: day, time: time, zelm: false, row: i, table: 0});
      students.push({fName: fname, lName: lname, grade: grad, lunches: lunches, zelm: 0, house: house});
    }else{
      for(var j = 0; j < students.length; j++){
        if(students[j].fName == fname && students[j].lName == lname){
          students[j].lunches.push({day: day, time: time, zelm: false, row: i, table: 0});
          j = students.length;
        }
        if(j == students.length - 1){
          var lunches = [];
          lunches.push({day: day, time: time, zelm: false, row: i, table: 0});
          students.push({fName: fname, lName: lname, grade: grad, lunches: lunches, zelm: 0, house: house});
          j = students.length;
        }
      }
    }
  }
    
    
  testForFilledEarlyLunches(students);
  testAllStudentsHaveALunchForEachDay(students);
  
}

function testForFilledEarlyLunches(students) {
  var A = [];
  var B = [];
  var C = [];
  var D = [];
  var E = [];
  var F = [];
  var G = [];
  var H = [];
  
  
}

function testAllStudentsHaveALunchForEachDay(students){
  var count = 0;
  for(var n = 0; n < students.length; n++){
    var stu = students[n];
    if(stu.lunches.length == 8){
      var a = false;
      var b = false;
      var c = false;
      var d = false;
      var e = false;
      var f = false;
      var g = false;
      var h = false;
      for(var y = 0; y < stu.lunches.length; y++){
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
      if(!(a && b && c && d && e && f && g && h)){
        Logger.log("Student " + stu.fName + " " + stu.lName + " has 8 lunches, but does not have a lunch for every day!");
        count++;
      }
    }else{
      Logger.log("Student " + stu.fName + " " + stu.lName + " has " + stu.lunches.length + " lunches!");
      count++;
    }
  }
  if(count > 0){
     Logger.log("testAllStudentsHaveALunchForEachDay failed!");
  }else
     Logger.log("testAllStudentsHaveALunchForEachDay passed!");
}
