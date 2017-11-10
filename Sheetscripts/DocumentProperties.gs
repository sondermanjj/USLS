function testting() {
  var properties = PropertiesService.getDocumentProperties().getProperties();
  Logger.log(properties);

}

/*****************************************************************************************************************
 * Properties:
 *   Sheets:
 *     studentData - Final Student Data
 *     teacherChoices - Faculty Choices List
 *     teacherTables - Faculty Table List
 *     dodList - DOD List
 *     courseSheet - Course Title and Day List
 *    
 *   Column Indices for Student Data Sheet:
 *     "Student " + column name
 *
 *   Column Indices for Teachers Choices Sheet:
 *     "Teacher " + column name
 *
 *   Others:
 *     lunchDays - A list of the letter days for the school
 *     houses - A list of the houses for the school
 *     courses - A list of the courses with course name, the day it runs, and the lunch time
 *****************************************************************************************************************/
 
 /**
 * @desc - Sets the document properties for the letter days, lunch times, number of tables, and school days
 * @author - hendersonam
 */
function setLunchProperties() {
  var early = {"name": "early", "numStuPerTable": 7, "priority": 1, "font": "BLACK", "background": "YELLOW", "assignedBy": "table", "minTables": 19, "maxTables": 19};
  var mid = {"name": "mid", "numStuPerTable": null, "priority": 3, "font": "BLACK", "background": "WHITE", "assignedBy": "none", "minTables": null, "maxTables": null};
  var late = {"name": "late", "numStuPerTable": null, "priority": 2, "font": "BLACK", "background": "#8db4e2", "assignedBy": "house", "minTables": null, "maxTables": null};
  
  var lunchDays = [{"letter": "A", "block": 3, "times": [early, mid, late ]},
  {"letter": "B", "block": 7, "times": [early, mid, late ]},
  {"letter": "C", "block": 4, "times": [early, mid, late ]},
  {"letter": "D", "block": 8, "times": [early, mid, late ]},
  {"letter": "E", "block": 1, "times": [early, mid, late ]},
  {"letter": "F", "block": 5, "times": [early, mid, late ]},
  {"letter": "G", "block": 2, "times": [early, mid, late ]},
  {"letter": "H", "block": 6, "times": [early, mid, late ]}];
  
   // New day assignments for fall 2017 :
   // 5:A, 6:B, 7:C, 8:D, 1:E, 2:F, 3:G, 4:H
  
  var houses = [{"name": "Monkey", "font": "BLUE", "background": "BLUE"},
  {"name": "Squirrel", "font": "BLUE", "background": "BLUE"},
  {"name": "Lion", "font": "#BLUE", "background": "#LIT"},
  {"name": "Cat", "font": "Meow", "background": "#woof"}];
  
  setLunchDays(lunchDays);
  setHouses(houses);
}

/**
* @ desc - re-sets column indices and column name properties
*/
function setColumnProperties(){
  var docProperties = PropertiesService.getDocumentProperties();
  var properties = docProperties.getProperties();
   //Needs to run after setting sheets
  var studentHeaders = getListOfColumns(
                          SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
                          properties.studentData).getDataRange().getValues());
  var teacherHeaders = getListOfColumns(
                          SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
                          properties.teacherChoices).getDataRange().getValues());
  setStudentColumnIndices(studentHeaders);
  setHeaderColumnNames(studentHeaders);
  setTeacherColumnIndices(teacherHeaders);
}

/**
 * @desc - Sets the document properties for the sheets that will be used throughout the program inlcuding column indices
 * @author - hendersonam
 */

function setSheetProperties(studentSheet, teacherSheetName, dodSheetName, choicesSheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var properties = PropertiesService.getDocumentProperties();

  var teacherChoicesSheet = ss.getSheetByName(choicesSheetName);
  var dodSheet = ss.getSheetByName(dodSheetName);
  var teacherTableSheet = ss.getSheetByName(teacherSheetName);
  
  if(teacherChoicesSheet == null) {
    SpreadsheetApp.getUi().alert("The Faculty Preferences Sheet cannot be a newly made sheet. It must contain the preferred lunch times for the faculty.");
    return;
  }
  if(dodSheet == null) {
    SpreadsheetApp.getUi().alert("The DOD List Sheet cannot be a newly made sheet. It must contain the list of DODs for the lunches.");
    return;
  }
  if(teacherTableSheet == null) {
    ss.insertSheet(teacherSheetName);
    teacherTableSheet = ss.getSheetByName(teacherSheetName);
  }
  
  setStudentSheet(studentSheet);
  setTeacherChoicesSheet(teacherChoicesSheet);
  setTeacherTableSheet(teacherTableSheet);
  setDODSheet(dodSheet);
  
  var docProperties = PropertiesService.getDocumentProperties();
  var properties = docProperties.getProperties();
  
  //Needs to run after setting sheets
  var studentHeaders = getListOfColumns(
                          SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
                          properties.studentData).getDataRange().getValues());
  var teacherHeaders = getListOfColumns(
                          SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
                          properties.teacherChoices).getDataRange().getValues());
  setStudentColumnIndices(studentHeaders);
  setHeaderColumnNames(studentHeaders);
  setTeacherColumnIndices(teacherHeaders);
}

/**
 * @desc - Sets the document property for the list of header columns in the student data sheet. Saves it as
 *         a Json.stringify(array)
 * @author - hendersonam
 */
function setHeaderColumnNames(headers) {
  var properties = PropertiesService.getDocumentProperties();
  properties.setProperty("headers", JSON.stringify(headers));
}

/**
 * @desc - Return the list of header column names from the property service
 * @author - hendersonam
 */
function getHeaderColumnNames() {
  return PropertiesService.getDocumentProperties().getProperty("headers");
}

function getLunchDaysProperty() {
  Logger.log(PropertiesService.getDocumentProperties().getProperty("lunchDays"));
  return PropertiesService.getDocumentProperties().getProperty("lunchDays");
}

function getHousesProperty() {
  return PropertiesService.getDocumentProperties().getProperty("houses");
}

function getFinalSheetProperty() {
  Logger.log(PropertiesService.getDocumentProperties().getProperty("studentData"));
  return PropertiesService.getDocumentProperties().getProperty("studentData");
}

function getDODSheetProperty() {
  return PropertiesService.getDocumentProperties().getProperty("DODList");
}

function getFacultyChoicesProperty() {
  return PropertiesService.getDocumentProperties().getProperty("teacherChoices");
}


/**
 * @desc - Sets the document property for the letter days as a JSON.stringify value
 * @param - Array[] - the letters for each day
 * @author - hendersonam
 */
function setLunchDays(value) {
  PropertiesService.getDocumentProperties().setProperty("lunchDays", JSON.stringify(value));
}

/**
 * @desc - Sets the document property for the houses as a JSON.stringify value
 * @param - Array[] - the houses and their attributes
 * @author - dicksontc
 */
function setHouses(value) {
  PropertiesService.getDocumentProperties().setProperty("houses", JSON.stringify(value));
}

/**
  * @desc - Sets the document property for the raw data sheet as the sheet name
  * @param - sheetName - the raw data sheet name
  * @author - clemensam
  */
 function setRawSheetProperty(sheetName){
   PropertiesService.getDocumentProperties().setProperty("rawData", sheetName);
 }

 /*
 * @desc - Sets the document property for the course data sheet as the sheet name
 * @param - sheetName - the course data sheet name
 * author - clemensam
 */
 function setCoursesSheet(sheetName) {
   PropertiesService.getDocumentProperties().setProperty("courseSheet", sheetName);
 }
 
/**
 * @desc - Sets the document property for the student data sheet as the sheet name
 * @param - sheet - the student data sheet
 * @author - hendersonam
 */
function setStudentSheet(sheet) {
  if(typeof sheet === "string") {
    PropertiesService.getDocumentProperties().setProperty("studentData", sheet);
  }
  else {
    var value = sheet.getName();
    PropertiesService.getDocumentProperties().setProperty("studentData", value);
  }
}

/**
 * @desc - Sets the document property for the teacher lunch choices sheet as the sheet name
 * @param - sheet - the teacher choices sheet
 * @author - hendersonam
 */
function setTeacherChoicesSheet(sheet) {
  if( typeof sheet === "string") {
    PropertiesService.getDocumentProperties().setProperty("teacherChoices", sheet);
  }
  else {
    var value = sheet.getName();
    PropertiesService.getDocumentProperties().setProperty("teacherChoices", value);
  }
}

/**
 * @desc - Sets the document property for the taecher table sheet as the sheet name
 * @param - sheet - the teacher tables sheet
 * @author - hendersonam
 */
function setTeacherTableSheet(sheet) {
  if( typeof sheet === "string") {
    PropertiesService.getDocumentProperties().setProperty("teacherTables", sheet);
  }
  else {
    var value = sheet.getName();
    PropertiesService.getDocumentProperties().setProperty("teacherTables", value);
  }
}

/**
 * @desc - Sets the document property for the DOD list sheet as the sheet name
 * @param - sheet - the DOD list sheet
 * @author - hendersonam
 */
function setDODSheet(sheet) {
  if( typeof sheet === "string") {
    PropertiesService.getDocumentProperties().setProperty("DODList", sheet);
  }
  else {
    var value = sheet.getName();
    PropertiesService.getDocumentProperties().setProperty("DODList", value);
  }
}

/**
 *@desc Sets the documnet properties for the final student data column header indices to be used as global variables
 *@params - Object[][] - the array of the Final Student Data
 *@author - dicksontc, hendersonam
*/
function setStudentColumnIndices(pHeaders){
  
  var properties = PropertiesService.getDocumentProperties();
  
  for(var i = 0; i < pHeaders.length; i++) {
  if (pHeaders != "") {
      properties.setProperty("Student " + pHeaders[i], i);
    }
  }
}

/**
 *@desc Sets the documnet properties for the teacher choices column header indices to be used as global variables
 *@params - Object[][] - the array of the Faculty Choices dadta
 *@author - dicksontc, hendersonam
*/
function setTeacherColumnIndices(tHeaders) {
  var properties = PropertiesService.getDocumentProperties();
  //Start of hendersan airtight 
  for(var i = 0; i < tHeaders.length; i++) {
    if (tHeaders[i] != "") {
      properties.setProperty("Teacher " + tHeaders[i], i);
    }
  }
}
