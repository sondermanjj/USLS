/*****************************************************************
      * @desc - Brings up the Schedule Change Prompt
      * @author - hendersonam
  *******************************************************************/
  function showCleanUpPrompt() {
    var html = HtmlService.createTemplateFromFile('Sheetscripts/CleanUp/HTML')
      .evaluate()
      .setHeight(100)
      .setWidth(400);
    SpreadsheetApp.getUi().showModalDialog(html, ' ');
  }

/**
 * @desc - Takes the relevant data from the RAW file and adds it to the "Final Student Data" sheet
 *         Also, creates the necessary columns that are not included in the RAW file
 * @param - sheet - Sheet - the RAW sheet file
 *          newSheet - Sheet - Sheet to save the new student data to
 * @functional - yes
 * @author - hendersonam
 */
function cleanUp(sheetName, newSheetName) {

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  setRawSheetProperty(sheetName);
  var newSheet = ss.getSheetByName(newSheetName);
  if(sheet == null) {
    SpreadsheetApp.getUi().alert("The Raw Data Sheet cannot be a newly made sheet. It must contain student records provided by administration.");
    return;
  }
  
  if(newSheet == null) {
    ss.insertSheet(newSheetName);
    newSheet = ss.getSheetByName(newSheetName);
  } else {
    newSheet.clear();
  }
  
  var properties = PropertiesService.getDocumentProperties().getProperties();

  
  var oldValues = sheet.getDataRange().getValues();

  //Remove irrelevant data
  var newValues = removeIrrelevantData(oldValues, properties);
  
  newValues = addColumnNames(newValues, ["Table Head", "Lunch Day", "Lunch Time", "Lunch Table", "House"]);

  //Populate the Lunch Day Table
  newValues = populateLunchDay(newValues, properties);
  
  newSheet.getRange(1, 1, newValues.length, newValues[0].length).setValues(newValues);
  
  return newSheet;
  
}

/*
*
* @author - clemensam
*/
function setFacultyCourses() {
  var studentDataSheetName = PropertiesService.getDocumentProperties().getProperty("studentData");
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(studentDataSheetName);
  var data = sheet.getDataRange();
  
  var values = data.getValues();
  var numRows = data.getNumRows();
  var headers = getListOfColumns(values);

  var courseTitleCol = getColumnIndex(headers, "Course Title");
  var facultyFirstNameCol = getColumnIndex(headers, "Faculty First Name");;
  var facultyLastNameCol = getColumnIndex(headers, "Faculty Last Name");
  var lunchDayCol = getColumnIndex(headers, "Lunch Day");
  
  var headerRow = ["Course Title", "Faculty First Name", "Faculty Last Name", "Lunch Day", "Lunch Time"];
  var newData = [];
  var courses = [];
  //newData.push(headerRow);
  var i; 
  for(var i = 0; i < numRows; i++){
    var courseTitle = values[i][courseTitleCol];
    var facultyFirstName = values[i][facultyFirstNameCol];
    var facultyLastName = values[i][facultyLastNameCol];
    var lunchDay = values[i][lunchDayCol];
    
    var newRow = [courseTitle, facultyFirstName, facultyLastName, lunchDay];
    
    var courseDayConcat = courseTitle + lunchDay;
    
    if(courses.indexOf(courseDayConcat) < 0) {
      courses.push(courseDayConcat);
      newData.push(newRow);
    }
  }
  
  newData = newData.slice(0, 1).concat(newData.slice(1, newData.length).sort());
  
  createNewSheet(newData, "Courses");
  console.log("Course Sheet Created");
  setCoursesSheet("Courses");
  
}

/**
 * @desc - Searches the data for the 'Block' column and deletes rows that have irrelevant 
 *         data (i.e they have something other than 1,2,3,4,5,6,7,8,E1,G2,A3,C4,F5,H6,B7,D8)
 * @params - Object[][] - 2d Array of values from a Sheet with the old data that needs cleaning
 *           Object[][] - 2d Arrayo of values from a Sheet that will contain the revised values
 * @funtional - yes
 * @author - hendersonam
 */
function removeIrrelevantData(oldValues, properties) {
  
  //Get necessary properties
  var schoolDays = JSON.parse(properties.schoolDays);
  
  //Create a new array for the cleaned data
  var revisedValues = [];
  
  //Add the column titles to the new data array
  var oldHeaders = getListOfColumns(oldValues);
  revisedValues.push(oldHeaders);
  
  //Get necessary column indices
  var blockColumn = getColumnIndex(oldHeaders, "Block");
  
  //Grab any relevant rows (courses that meet during lunch times)
  //and push them to the new data array
  for (var j = 0; j < oldValues.length; j++) {
    var row = oldValues[j][blockColumn];
    if(schoolDays[row] != null) {
      revisedValues.push(oldValues[j]);
    }
  }
  return revisedValues;
}


/**
 * @desc - Populates the Lunch Day column 
 * @param - Object[][] - 2d Array of values from a Google Sheet 
 * @functional - yes
 * @author - hendersonam
 */
function populateLunchDay(values, properties) {
  
  var schoolDays = JSON.parse(properties.schoolDays);
  var headers = getListOfColumns(values);
  var blockColumn = getColumnIndex(headers, "Block");
  var lunchDayColumn = getColumnIndex(headers, "Lunch Day");
  
  var badRows = [];

  //Fill in the 'Lunch Day' column according to the corresponding 'Block' data
  for (var j = 0; j < values.length; j++) {
    if(values[j][lunchDayColumn] != "Lunch Day") {
      var day = schoolDays[values[j][blockColumn]];
      if( day === null) {
        badRows.push(j+1);
      } else {
        values[j][lunchDayColumn] = schoolDays[values[j][blockColumn]];
      }
    }
  }
  
  if (badRows.length > 0) {
    SpreadsheetApp.getUi().alert("Error setting lunch days on rows: \n" + badRows);
  }
  
  return values;
}

/*
 *
 * @author - clemensam
 */
 function setFacultyCourses() {
   var studentDataSheetName = PropertiesService.getDocumentProperties().getProperty("studentData");
   var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(studentDataSheetName);
   var data = sheet.getDataRange();
   
   var values = data.getValues();
   var numRows = data.getNumRows();
   var headers = getListOfColumns(values);
 
   var courseTitleCol = getColumnIndex(headers, "Course Title");
   var facultyFirstNameCol = getColumnIndex(headers, "Faculty First Name");;
   var facultyLastNameCol = getColumnIndex(headers, "Faculty Last Name");
   var lunchDayCol = getColumnIndex(headers, "Lunch Day");
   
   var headerRow = ["Course Title", "Faculty First Name", "Faculty Last Name", "Lunch Day", "Lunch Time"];
   var newData = [];
   var courses = [];
   //newData.push(headerRow);
   var i; 
   for(var i = 0; i < numRows; i++){
     var courseTitle = values[i][courseTitleCol];
     var facultyFirstName = values[i][facultyFirstNameCol];
     var facultyLastName = values[i][facultyLastNameCol];
     var lunchDay = values[i][lunchDayCol];
     
     var newRow = [courseTitle, facultyFirstName, facultyLastName, lunchDay];
     
     var courseDayConcat = courseTitle + lunchDay;
     
     if((courses.indexOf(courseDayConcat) < 0) && (facultyFirstName !== '' && facultyLastName !== '')) {
       courses.push(courseDayConcat);
       newData.push(newRow);
     }
   }
   
   newData = newData.slice(0, 1).concat(newData.slice(1, newData.length).sort());
   
   createNewSheet(newData, "Courses");
   console.log("Course Sheet Created");
   setCoursesSheet("Courses");
   
 }
