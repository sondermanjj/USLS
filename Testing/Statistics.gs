//JSHint verified 4/3/2017 sondermanjj

/**
 * @desc - Checks the correct number of teachers and students are in the sheets.
 * @author dicksontc
 */
function runStatisticsTests() {
  var time = ["Early", "Mid", "Late"];
  var day = ["A", "B", "C", "D", "E", "F", "G", "H"];
  
  var fakeSheetData = [["Lunch Time", "Lunch Day", "Grade"],
                       ["early", "B", "9"],
                       ["mid", "C", "9"],
                       ["mid", "D", "10"],
                       ["mid", "E", "9"],
                       ["mid", "A", "10"],
                       ["early", "A", "10"],
                       ["early", "A", "10"],
                       ["early", "A", "9"],
                       ["early", "F", "9"],
                       ["early", "B", "9"],
                       ["early", "C", "12"],
                       ["late", "A", "12"],
                       ["late", "G", "12"],
                       ["early", "H", ""],
                       ["early", "C", ""],
                       ["mid", "C", ""],
                       ["late", "E", ""],
                       ["mid", "B", ""],
                       ["early", "H", ""],
                       ["early", "A", ""]];
  
  var actualTeacherData = [[1,0,0],
                           [0,1,0],
                           [1,1,0],
                           [0,0,0],
                           [0,0,1],
                           [0,0,0],
                           [0,0,0],
                           [2,0,0]];
  
  var actualStudentData = [[3,1,1],
                           [2,0,0],
                           [1,1,0],
                           [0,1,0],
                           [0,1,0],
                           [1,0,0],
                           [0,0,1],
                           [0,0,0]];
                    
  
  var teacherValues = statistics(time, day, fakeSheetData, false);
  var studentValues = statistics(time, day, fakeSheetData, true);
  
  testCorrectNumberOfTeachers(actualTeacherData, teacherValues);
  testCorrectNumberOfStudents(actualStudentData, studentValues);
  
}

/**
 * @desc - Checks the correct number of teachers are in the sheets.
 * @param actualData - The real data you are checking is true
          data - The data that is the baseline
 * @author dicksontc
 */
function testCorrectNumberOfTeachers(actualData, data) {
  var time = "";
  var day = "";
  var failed = false;
  
  for(var i = 0; i < actualData.length ; i++) {
    for(var j = 0; j < actualData[0].length ; j++) {
      failed = false;
      
      if(actualData[i][j] != data[i][j]) {
        failed = true;
      }
      if(failed) {
         
        if(i===0) {
          day = "A";
        } else if (i==1) {
          day = "B";
        }else if (i==2) {
          day = "C";
        }else if (i==3) {
          day = "D";
        }else if (i==4) {
          day = "E";
        }else if (i==5) {
          day = "F";
        }else if (i==6) {
          day = "G";
        }else if (i==7) {
          day = "H";
        }
        
        if (j === 0) {
          time = "early";
        }else if (j == 1) {
          time = "mid";
        } else if(j == 2) {
          time = "late";
        }
        Logger.log("Test for " + time + " teacher count on " + day + " days failed");
      }
    }
  }
}

/**
 * @desc - Checks the correct number of students are in the sheets.
 * @author dicksontc
 */
function testCorrectNumberOfStudents(actualData, data) {
  var time = "";
  var day = "";
  var failed = false;
  
  for(var i = 0; i < actualData.length ; i++) {
    for(var j = 0; j < actualData[0].length ; j++) {
      failed = false;
      if(actualData[i][j] != data[i][j]) {
        failed = true;
      }
      if(failed) {
        
        if(i===0) {
          day = "A";
        } else if (i==1) {
          day = "B";
        }else if (i==2) {
          day = "C";
        }else if (i==3) {
          day = "D";
        }else if (i==4) {
          day = "E";
        }else if (i==5) {
          day = "F";
        }else if (i==6) {
          day = "G";
        }else if (i==7) {
          day = "H";
        }
        
        if (j === 0) {
          time = "early";
        }else if (j == 1) {
          time = "mid";
        } else if(j == 2) {
          time = "late";
        }
        Logger.log("Test for " + time + " student count on " + day + " days failed");
      }
    }
  }
}