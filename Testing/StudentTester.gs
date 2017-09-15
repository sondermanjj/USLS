//JSHint verified 4/3/2017 sondermanjj

/**
@desc This function sets up the necessary information for the tests as well
as runs the tests.
@funtional - yes
@author - dicksontc
*/
function studentTester(){
  
  assignStudentLunchDays();

  var properties = PropertiesService.getDocumentProperties();
  var sheet = SpreadsheetApp.getActiveSheet();
  var primary = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(properties.getProperty("studentData"));
  var teacher = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(properties.getProperty("teacherChoices"));

  
  var primaryData = primary.getDataRange();
  var teacherData = teacher.getDataRange();
  
  var pValues = primaryData.getValues();
  var tValues = teacherData.getValues();
  
  var pNumRows = primaryData.getNumRows();
  var pNumColumns = primaryData.getNumColumns();
  var tNumColumns = teacherData.getNumColumns();
  
  var pLunchTimeColumn = parseInt(properties.getProperty("pLunchTimeColumn"));
  var pLunchDayColumn = parseInt(properties.getProperty("pLunchDayColumn"));
  var pSFNameColumn = parseInt(properties.getProperty("pSFNameColumn"));
  var pSLNameColumn = parseInt(properties.getProperty("pSLNameColumn"));
  var pTFNameColumn = parseInt(properties.getProperty("pTFNameColumn"));
  var pTLNameColumn = parseInt(properties.getProperty("pTLNameColumn"));
  var pTableColumn = parseInt(properties.getProperty("pTableColumn"));
  var pGradeColumn = parseInt(properties.getProperty("pGradeColumn"));
  var pHouseColumn = parseInt(properties.getProperty("pHouseColumn"));
  var tFNameColumn = parseInt(properties.getProperty("tFNameColumn"));
  var tLNameColumn = parseInt(properties.getProperty("pLNameColumn"));
  var tLunchDayColumn = parseInt(properties.getProperty("tLunchDayColumn"));
  var tLunchTimeColumn = parseInt(properties.getProperty("tLunchTimeColumn"));
  
  var students = [];
  
  var students = [];
  for(var i = 1; i < pNumRows; i++){
    var day = pValues[i][pLunchDayColumn];
    var fname = pValues[i][pSFNameColumn];
    var lname = pValues[i][pSLNameColumn];
    var grad = pValues[i][pGradeColumn];
    var house = pValues[i][pHouseColumn];
    var time = pValues[i][pLunchTimeColumn];
    
    if(students.length === 0){
      lunches = [];
      lunches.push({day: day, time: time, zelm: false, row: i, table: 0});
      students.push({fName: fname, lName: lname, grade: grad, lunches: lunches, zelm: 0, house: house});
    }else{
      for(var j = 0; j < students.length; j++){
        if(students[j].fName == fname && students[j].lName == lname){
          students[j].lunches.push({day: day, time: time, zelm: false, row: i, table: 0});
          j = students.length;
        }
        if(j == students.length - 1){
          lunches = [];
          lunches.push({day: day, time: time, zelm: false, row: i, table: 0});
          students.push({fName: fname, lName: lname, grade: grad, lunches: lunches, zelm: 0, house: house});
          j = students.length;
        }
      }
    }
  }
  
  var messages = [];  
  messages[0] = "TestForFilledEarlyLunches: " + testForFilledEarlyLunches(students);
  messages[1] = "TestAllStudentsHaveLunchForEachDay: " + testAllStudentsHaveALunchForEachDay(students);
  messages[2] = "TestColorByTime: " +testColorByTime(pLunchTimeColumn);
  //messages[3] = "TestColorByTable: " +testColorByTable(pTableColumn);
  
  Logger.log(messages[2]);
  
  return messages;
}

/**
@desc This function tests to see if the backgrounds for the lunch time column
      are of the correct color
Passes - All background colors are correct
Fails - Any background colors are incorrect
@params - column - the column of which the lunch times are in
@funtional - yes
@author - dicksontc
*/
function testColorByTime(column){
  return allTests(function(t) {
    var properties = PropertiesService.getDocumentProperties();
    var sheet = SpreadsheetApp.getActiveSheet();
    var primary = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(properties.getProperty("studentData"));
    var range = primary.getRange(1, column + 1, primary.getDataRange().getNumRows());
    var vals = range.getValues();
    
    var check = 0;
    var backgrounds = range.getBackgrounds();
    if(vals[0] == "Lunch Time"){
      for(var i = 1; i < vals.length; i++){
        if(vals[i][0] == "early"){
          if(backgrounds[i] != "#ffff00"){
            t.errorSpot("Early Colors are not correct!", false);
            check++;
          } else {
           t.errorSpot("Color is good", true); 
          }
        }else if(vals[i][0] == "late"){
          if(backgrounds[i] != "#8db4e2"){
            t.errorSpot("Late Colors are not correct!", false);
            check++;
          } else {
           t.errorSpot("Color is good", true); 
          }
        }else{          
          if(backgrounds[i] != "#ffffff"){
            t.errorSpot("Blank Colors are not correct!", false);
            check++;
          } else {
           t.errorSpot("Color is good", true); 
          }
        }
      }
    }else{
      t.errorSpot("Wrong Column", false);
      check++;
    }
    if(check === 0){
      t.errorSpot("testColorByTime has passed!", true);
    }else{
      t.errorSpot("testColorByTime has failed!", false);
    }
  });
}

/**
@desc This function tests to see if the backgrounds and font colors
      for the lunch tables column are of the correct colors
Passes - All background and font colors are correct
Fails - Any background or font colors are incorrect
@params - column - the column of which the lunch tables are in
@funtional - yes
@author - dicksontc
*/
function testColorByTable(column){
  return allTests(function(t) {
     var properties = PropertiesService.getDocumentProperties();
    var sheet = SpreadsheetApp.getActiveSheet();
    var primary = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(properties.getProperty("studentData"));
    var range = primary.getRange(1, column + 1, primary.getDataRange().getNumRows());
    var vals = range.getValues();
    var check = 0;
    var backgrounds = range.getBackgrounds();
    var fonts = range.getFontColors();
    if(vals[0] == "Lunch Table"){
      for(var i = 1; i < vals.length; i++){
        if(vals[i] == "Ledger"){
          if(backgrounds[i] != "#660066" || fonts[i] != "YELLOW"){
            t.errorSpot("Colors are not correct!", false);
            check++;
          }
        }else if(backgrounds[i] != "WHITE"){
          if(vals[i] == "Crest"){
            if(fonts[i] != "#ff0000"){
              t.errorSpot("Colors are not correct!", false);
            check++;
            }
          }else if(vals[i] == "Arrow"){
            if(fonts[i] != "#008000"){
              t.errorSpot("Colors are not correct!", false);
            check++;
            }
          }else if(vals[i] == "Academy"){
            if(fonts[i] != "#3366ff"){
              t.errorSpot("Colors are not correct!", false);
              check++;
            }
          }else{
            if(fonts[i] != "BLACK"){
              t.errorSpot("Colors are not correct!", false);
              check++;
            }
          }
        }else{
          t.errorSpot("Colors are not correct!", false);
          check++;
        }
      }
    }else{
      t.errorSpot("Wrong Column", false);
      check++;
    }
    if(check === 0){
      t.errorSpot("testColorByTable has passed!", true);
    }else{
      t.errorSpot("testColorByTable has failed!", false);
    }
  });
}

/**
@desc This function tests to see if every early lunch has 133 students
      Passes - 133 students per early lunch
      Fails - Less or more than 133 students in any early lunch
@params - students - the students at USM and their relevant information
@funtional - yes
@author - dicksontc
*/
function testForFilledEarlyLunches(students) {
  
  return allTests(function(t) {
    
    var A = [];
    var B = [];
    var C = [];
    var D = [];
    var E = [];
    var F = [];
    var G = [];
    var H = [];
    for(var x = 1; x < students.length; x++){
      var stu = students[x];
      for(var j = 0; j < stu.lunches.length; j++){
        if(stu.lunches[j].time == 'early'){
          if(stu.lunches[j].day == 'A')
            A.push(stu);
          else if(stu.lunches[j].day == 'B')
            B.push(stu);
          else if(stu.lunches[j].day == 'C')
            C.push(stu);
          else if(stu.lunches[j].day == 'D')
            D.push(stu);
          else if(stu.lunches[j].day == 'E')
            E.push(stu);
          else if(stu.lunches[j].day == 'F')
            F.push(stu);
          else if(stu.lunches[j].day == 'G')
            G.push(stu);
          else if(stu.lunches[j].day == 'H')
            H.push(stu);
        }
      }
    }
    if (A.length==133) {
      t.errorSpot("A Lunch numbers OK", true);
    }else{
      t.errorSpot("A Lunch numbers incorrect, is "+A.length+", should be 133", false);
    }
    if (B.length==133) {
      t.errorSpot("B Lunch numbers OK", true);
    }else{
      t.errorSpot("B Lunch numbers incorrect, is "+B.length+", should be 133", false);
    }    
    if (C.length==133) {
      t.errorSpot("C Lunch numbers OK", true);
    }else{
      t.errorSpot("C Lunch numbers incorrect, is "+C.length+", should be 133", false);
    }
    if (D.length==133) {
      t.errorSpot("D Lunch numbers OK", true);
    }else{
      t.errorSpot("D Lunch numbers incorrect, is "+D.length+", should be 133", false);
    }
    if (E.length==133) {
      t.errorSpot("E Lunch numbers OK", true);
    }else{
      t.errorSpot("E Lunch numbers incorrect, is "+E.length+", should be 133", false);
    }
    if (F.length==133) {
      t.errorSpot("F Lunch numbers OK", true);
    }else{
      t.errorSpot("F Lunch numbers incorrect, is "+F.length+", should be 133", false);
    }
    if (G.length==133) {
      t.errorSpot("G Lunch numbers OK", true);
    }else{
      t.errorSpot("G Lunch numbers incorrect, is "+G.length+", should be 133", false);
    }
    if (H.length==133) {
      t.errorSpot("H Lunch numbers OK", true);
    }else{
      t.errorSpot("H Lunch numbers incorrect, is "+H.length+", should be 133", false);
    }    
  });
}

/**
@desc This function tests to see if every student has 1 lunch per day
Passes - All students have 1 lunch per day
Fails - One or more students have 0 or more than 1 lunches per day
@params - students - the students at USM and their relevant information
@funtional - yes
@author - dicksontc
*/
function testAllStudentsHaveALunchForEachDay(students){
  
  return allTests(function(t) {
    
    var count = 0;
    for(var n = 0; n < students.length; n++){
      var stu = students[n];
      if(stu.lunches.length == 8){
        t.errorSpot("Student " + stu.fName + " " + stu.lName + " has 8 lunches, as they should!", true);
 
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
        if(!(a && b && c && d && e && f && g && h)){
          t.errorSpot("Student " + stu.fName + " " + stu.lName + " has 8 lunches, but does not have a lunch for every day!", false);
          count++;
        }else{
          t.errorSpot("Student " + stu.fname + " " + stu.lName + "has the correct number of lunches!", true);
        }
      }else{
        t.errorSpot("Student " + stu.fName + " " + stu.lName + " has " + stu.lunches.length + " lunches!", false);
        count++;
      }
    }
  });
}