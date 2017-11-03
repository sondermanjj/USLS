//JSHint verified 5/7/2017 by hendersonam

  var changeshtml = "";
  var updatedChanges = false;
  
  /*****************************************************************
      * @desc - Brings up the Schedule Change Prompt
      * @author - hendersonam
  *******************************************************************/
  function showScheduleChangesPrompt() {
    var html = HtmlService.createTemplateFromFile("Sheetscripts/ScheduleChanges/HTML")
      .evaluate();
    SpreadsheetApp.getUi().showModalDialog(html, " ");
  }

  /*****************************************************************
      * @desc - Checks for how many updates there were ? //TODO
      * @author - hendersonam
  *******************************************************************/
  function updateChanges(){            
    var list = scheduleChanges();            
    var numChanges = 0;            
    for(var j=0; j<list.length; j++){            
      numChanges += 1;            
    }            
  }
  
  /*****************************************************************
      * @desc - Returns a JSON object with a boolean and a schedule. If true,
      *         the shcedule is valid. If false, the student did now exist in the sheet
      *         and there is no schedule, thus invalid and undefined.
      * @param - data - Array - Contains the first and last name of a student
      *                         [FirstName, LastName]
      * @return - JSON Object - [ valid : Boolean, schedule : Array]
      * @author - hendersonam
  *******************************************************************/
  function getValidSchedule(data) {
    var schedule = [];
    
    var headers = ["First Name", "Last Name", "Course Ttile", "Lunch Day"];
    schedule.push(headers);
    
    var firstname = data[0].trim().toString().toLowerCase();
    var lastname = data[1].trim().toString().toLowerCase();
    schedule.push(getStudentSchedule(firstname, lastname));    
    
    var valid = false;
    if(schedule.length > 1) valid = true;
    
    return {
      valid : valid,
      schedule: schedule
    };
  }
  
  /*****************************************************************
      * @desc - Validates the schedule change
      * @param - firstname - String - First name of the student
      *          lastname - String - Last name of the student
      *          oldCourses - Array - Courses to be replace [TeacherFirstName, TeacherLastName, CourseName, LunchDay]
      *          newCourses - Array - New courses for the schedule [CourseName, LunchDay]
      * @author - hendersonam
  *******************************************************************/
  function validateCourses(firstname, lastname, oldCourses, newCourses) {
    return swapCourses(firstname, lastname, oldCourses, newCourses);
  }
  
  /*****************************************************************
      * @desc - Swaps old courses with new courses for a given student
      * @param - firstname - String - First name of the student
      *          lastname - String - Last name of the student
      *          oldCourses - Array - Courses to be replace [TeacherFirstName, TeacherLastName, CourseName, LunchDay]
      *          newCourses - Array - New courses for the schedule [CourseName, LunchDay]
      * @author - hendersonam
  *******************************************************************/
  function swapCourses(firstname, lastname, oldCourses, newCourses) {
    newCourses.shift();
    var properties = PropertiesService.getDocumentProperties().getProperties();
    
    var values = SpreadsheetApp
                  .getActiveSpreadsheet()
                  .getSheetByName(properties.studentData)
                  .getDataRange()
                  .getValues();
                  
    var firstNameColumn = parseInt(properties["Student First Name"]);
    var lastNameColumn = parseInt(properties["Student Last Name"]);
    var courseTitleColumn = parseInt(properties["Student Course Title"]);
    var lunchDayColumn = parseInt(properties["Student Lunch Day"]);
    var lunchTimeColumn = parseInt(properties["Student Lunch Time"]);
    var lunchTableColumn = parseInt(properties["Student Lunch Table"]);
    var facultyFirstNameColumn = parseInt(properties["Student Faculty First Name"]);
    var facultyLastNameColumn = parseInt(properties["Student Faculty Last Name"]);
    
    var courseTimes = getCourses(null).courses;
    values.sort(compareByColumnIndex(lunchDayColumn));
    
    oldCourses.sort(compareByColumnIndex(3));
    newCourses.sort(compareByColumnIndex(1));
    var numOfChangesToBeMade = newCourses.length;
    var numOfChangesMade = 0;
    var studentChanges = [];
    var changes = [];

    for(var i = 0; i < values.length; i++) {
      
      if(firstname.toLowerCase() == values[i][firstNameColumn].toString().toLowerCase()) {
        if(lastname.toLowerCase() == values[i][lastNameColumn].toString().toLowerCase()) {
          if(oldCourses[numOfChangesMade][3].toString() == values[i][lunchDayColumn].toString()) {
            //Save the old row and the old time, and old course
            var oldRow = values[i];
            var oldTimee = values[i][lunchTimeColumn];
            var oldCourse = values[i][courseTitleColumn];
            
            //Make the course title change in the data
            var newCourseTitle = newCourses[numOfChangesMade][0];
            
            //Get the course title and lunch day concat
            var course = newCourses[numOfChangesMade][0];
            var lunchDay = values[i][lunchDayColumn];
            //Course title and lunch day concat
            var courseAndDay = course + lunchDay;
            courseAndDay = courseAndDay.toString().replace(/\s/g,"");
            //Get the lunch time for that particular course and day pair
            var newTime = courseTimes[courseAndDay];
            //Only if not null do we count this as a change
            if(newTime != null) {
              //Create the change object
              
              var teacherFound = false;
              for(var k = 0; k < values.length; k++) {
                if(newCourseTitle.toString().toLowerCase() == values[k][courseTitleColumn].toString().toLowerCase()) {
                  if(lunchDay.toString().toLowerCase() == values[k][lunchDayColumn].toString().toLowerCase()) {
                    var teacherFirstName = values[k][facultyFirstNameColumn]; 
                    var teacherLastName = values[k][facultyLastNameColumn];
                    teacherFound = true;
                  }
                }
                
                if(teacherFound) {
                  k = values.length;
                }
              }
              
             
              var change = {fName: oldRow[firstNameColumn], lName: oldRow[lastNameColumn], oldTime: oldTimee, oldDay: oldRow[lunchDayColumn],
                            oldTable: oldRow[lunchTableColumn], newTime: newTime, oldCourseName: oldCourse, newCourseName: newCourseTitle, 
                            facultyFName: teacherFirstName, facultyLName: teacherLastName};
              changes.push(change);
              numOfChangesMade++;
            }
            
            if(numOfChangesMade == numOfChangesToBeMade) {
              i = values.length;
            }
          }
        }
      }
    }
    
    var newChanges = parseStudentChanges(changes);
    pushToScheduleChangesSheet(newChanges);
    return newChanges;
    
  }
  
  /*****************************************************************
      * @desc - Saves all student schedule to a hidden sheet in the spreadsheet
      * @param - changes - Array - Course Title
      * @author - hendersonam
  *******************************************************************/
  function pushToScheduleChangesSheet(changes) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Schedule Changes");
    
    
    if( sheet == null ) {
      ss.insertSheet("Schedule Changes");
      sheet = ss.getSheetByName("Schedule Changes");
      sheet.appendRow(["First Name", "Last Name", "Lunch Day", "Old Course", "New Course",
                        "Old Time", "New Time", "Table", "Timestamp"]);
      sheet.hideSheet();
    }
    var values = sheet.getDataRange().getValues();
    
    // Check if changes are able to be made; if not, display message
    if(changes.badChanges !== null && changes.badChanges !== undefined) {
      //display error pop up
      Logger.log("schedule change not made");
    }   
    
    //TODO
    //cleanTimedOutScheduleChanges(sheet);
    
    else {
      var date = Date.now();
      Logger.log(date);
      for(var i = 0; i < changes.length; i++) {
        for(var j = 0; j < values.length; j++) {
          if( changes[i][0] == values[j][0] && changes[i][1] == values[j][1]) {
            if(changes[i][2] == values[j][2]) {
              sheet.deleteRow(j+1)
            }
          }
        }
        var values = [changes[i][0], changes[i][1], changes[i][2], changes[i][4],
                      changes[i][3], changes[i][5], changes[i][6], changes[i][8], date];
        sheet.appendRow(values);
      }
    }
    
      
  }
  
  /*****************************************************************
      * @desc - Deletes any schedule changes that are a month old
      * @param - sheet - Sheet - Sheet with schedule changes on it
      * @author - hendersonam
  *******************************************************************/
  function cleanTimedOutScheduleChanges(sheet) {
    var values = sheet.getDataRange().getValues();
    var columnIndex = getColumnIndex(values, "Timestamp");
    
    var date = new Date();
    var unixTime = date.now().getUnixTime();
    
    for(var i = 0; i < values.length; i++) {
      if(howLong(date, values[i][columnIndex]) > 30) {
        sheet.deleteRow(i);
      }
    }
  }
  
  /*****************************************************************
      * @desc - Returns the schedule for the given student as an array
      * @param - firstname - String - First name of the student
      *          lastname - String - Last name of the student
      * @return - schedule - Array - Student Schedule [TeacherFirstName, TeacherLastName, CoursTitle, LunchDay]
      * @author - hendersonam
  *******************************************************************/
  function getStudentSchedule(firstname, lastname) {             
    var properties = PropertiesService.getDocumentProperties();
    
    var values = SpreadsheetApp
                  .getActiveSpreadsheet()
                  .getSheetByName(properties.getProperty("studentData"))
                  .getDataRange()
                  .getValues();
                  
    var firstNameColumn = parseInt(properties.getProperty("Student First Name"));
    var lastNameColumn = parseInt(properties.getProperty("Student Last Name"));
    var courseTitleColumn = parseInt(properties.getProperty("Student Course Title"));
    var lunchDayColumn = parseInt(properties.getProperty("Student Lunch Day"));
    var teacherFirstNameColumn = parseInt(properties.getProperty("Student Faculty First Name"));
    var teacherLastNameColumn = parseInt(properties.getProperty("Student Faculty Last Name"));
    
    var schedule = [];
    for(var i = 0; i < values.length; i++) {
      if(firstname.toString().toLowerCase() == values[i][firstNameColumn].toString().toLowerCase()) {
        if(lastname.toString().toLowerCase() == values[i][lastNameColumn].toString().toLowerCase()) {
          
          var newDay = [];
          newDay.push(values[i][teacherFirstNameColumn]);
          newDay.push(values[i][teacherLastNameColumn]);
          newDay.push(values[i][courseTitleColumn]);
          newDay.push(values[i][lunchDayColumn]);
          
          schedule.push(newDay);
        }
      }
    }
    
    return schedule;
  }
  
  /*****************************************************************
      * @desc - Gets the html for a student schedule
      * @param - data - Array - 
      * @author - hendersonam
  *******************************************************************/
  function getStudentScheduleHTML(data) {
    var html = getStudentSchedule(data);
    return html;
  }

function getChangesHTML() {
  return changeshtml;
}