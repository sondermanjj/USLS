

function testting() {
  Logger.log(PropertiesService.getDocumentProperties().getProperties());
  
}

 /*****************************************************************************************************************
 * Properties:
 *   Sheets:
 *     studentData - Final Student Data
 *     teacherChoices - Faculty Choices List
 *     teacherTables - Faculty Table List
 *     dodList - DOD List
 *    
 *   Column Indices for Students:
 *     "Student " + column name
 *
 *   Column Indices for Teachers:
 *     tFNameColumn - First Name
 *     tLNameColumn - Last Name
 *     tLunchDayColumn - Lunch Day
 *     tLunchTimeColumn - Lunch Time
 *     tTableColumn - Table Assignment
 *     tHouseColumn - Teacher House
 *
 *     tLunchPreferenceColumn;
 *     tCommentsColumn;
 *     tSectionColumn;
 
 *     "Teacher " + column name
 *
 *
 *   Others:
 *     numberOfTables - Number of tables in early lunch
 *     letterDays - A list of the letter days for the school
 *     lunchTimes - A list of the lunch times for the school
 *
 *
 *****************************************************************************************************************/
 
 /**
 * @desc - Sets the document properties for the letter days, lunch times, number of tables, and school days
 * @author - hendersonam
 */
 function setLunchProperties() {
  var letterDays = ["A", "B", "C", "D", "E", "F", "G", "H"];
  var lunchTimes = ["early", "mid", "late"];
  var numberOfTables = 19;
  var schoolDays = { 1 : 'E', 2 : 'G', 3 : 'A', 4 : 'C', 5 : 'F', 6 : 'H', 7 : 'B', 8 : 'D',
                     E1 : 'E', G2 : 'G', A3 : 'A', C4 : 'C', F5 : 'F', H6 : 'H', B7 : 'B', D8 : 'D'};
  
  
  var properties = PropertiesService.getDocumentProperties();
  setLetterDays(letterDays);
  setLunchTimes(lunchTimes);
  //setAssignedLunches([["early", 133]]);
  //setNonAssignedLunches(["mid", "late"]);
  setNumberOfTables(numberOfTables);
  setSchoolDays(schoolDays);
  
}

/**
 * @desc - Sets the document properties for the sheets that will be used throughout the program inlcuding column indices
 * @author - hendersonam
 */
function setSheetProperties(studentSheet) {

  var properties = PropertiesService.getDocumentProperties();

  var teacherChoicesSheet = promptForSettingSheetProperty("Which sheet has the  faculty lunch choices?");
  var dodSheet = promptForSettingSheetProperty("Which sheet has the DOD list?");
  var teacherTableSheet = promptForSettingSheetProperty("Please enter the name of the sheet you would like to save the faculty tables to");
  
  
  setStudentSheet(studentSheet);
  setTeacherChoicesSheet(teacherChoicesSheet);
  setTeacherTableSheet(teacherTableSheet);
  setDODSheet(dodSheet);
  
  //Needs to run after setting sheets
  var studentHeaders = getListOfColumns(
                          SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
                          properties.getProperty("studentData")).getDataRange().getValues());
  var teacherHeaders = getListOfColumns(
                          SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
                          properties.getProperty("teacherChoices")).getDataRange().getValues());
  setStudentColumnIndices(studentHeaders);
  setHeaderColumnNames(studentHeaders);
  setTeacherColumnIndices(teacherHeaders);
}

/**
 * @desc - Sets the document property for the pairing of numbers and letters for school days. Saves it as
 *         a Json.stringify(map)
 * @author - hendersonam
 */
function setSchoolDays(schoolDays) {
  var properties = PropertiesService.getDocumentProperties();
  properties.setProperty('schoolDays', JSON.stringify(schoolDays));
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

/**
 * @desc - Sets the document property for the letter days as a JSON.stringify value
 * @param - Array[] - the letters for each day
 * @author - hendersonam
 */
function setLetterDays(value) {
  PropertiesService.getDocumentProperties().setProperty("letterDays", JSON.stringify(value));
}

/**
 * @desc - Sets the document property for the assigned lunch times as a JSON.stringify value
 * @param - Array[][] - 2D array with the lunch time and the amonut of students for that lunch
 * @author - hendersonam
 */
function setAssignedLunches(value) {
  //PropertiesService.getDocumentProperties().setProperty("letterDays", JSON.stringify(value));
}

/**
 * @desc - Sets the document property for the non-assigned lunch times as a JSON.stringify value
 * @param - Array[] - the lunch times that do not have 
 * @author - hendersonam
 */
function setNonAssignedLunches(value) {
  //PropertiesService.getDocumentProperties().setProperty("letterDays", JSON.stringify(value));
}

/**
 * @desc - Sets the document property for the lunch times as a JSON.stringify value
 * @param - Array[] - the letters for each day
 * @author - hendersonam
 */
function setLunchTimes(value) {
  PropertiesService.getDocumentProperties().setProperty("lunchTimes", JSON.stringify(value));
}

/**
 * @desc - Sets the document property for the number of table as an int
 * @param - Int - the number of tables
 * @author - hendersonam
 */
function setNumberOfTables(value) {
  PropertiesService.getDocumentProperties().setProperty("numberOfTables", value);
}

/**
 * @desc - Sets the document property for the student data sheet as the sheet name
 * @param - sheet - the student data sheet
 * @author - hendersonam
 */
function setStudentSheet(sheet) {
  var value = sheet.getName();
  PropertiesService.getDocumentProperties().setProperty("studentData", value);
}

/**
 * @desc - Sets the document property for the teacher lunch choices sheet as the sheet name
 * @param - sheet - the teacher choices sheet
 * @author - hendersonam
 */
function setTeacherChoicesSheet(sheet) {
  var value = sheet.getName();
  PropertiesService.getDocumentProperties().setProperty("teacherChoices", value);
}

/**
 * @desc - Sets the document property for the taecher table sheet as the sheet name
 * @param - sheet - the teacher tables sheet
 * @author - hendersonam
 */
function setTeacherTableSheet(sheet) {
  var value = sheet.getName();
  PropertiesService.getDocumentProperties().setProperty("teacherTables", value);
}

/**
 * @desc - Sets the document property for the DOD list sheet as the sheet name
 * @param - sheet - the DOD list sheet
 * @author - hendersonam
 */
function setDODSheet(sheet) {
  var value = sheet.getName();
  PropertiesService.getDocumentProperties().setProperty("DODList", value);
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

  //Start of sondermanjj-Airtight
  var teacherValues = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName).getDataRange().getValues();
  var tHeaders = getListOfColumns(teacherValues);
   
  var properties = { tFNameColumn : 0,
                     tLNameColumn : 0,
                     tLunchDayColumn : 0,
                     tLunchTimeColumn : 0,
                     tLunchPreferenceColumn : 0,
                     tCommentsColumn : 0,
                     tTableColumn : 0,
                     tHouseColumn : 0,
                     tSectionColumn : 0};
  
  properties.tFNameColumn = getColumnIndex(tHeaders, "First Name");
  properties.tLNameColumn = getColumnIndex(tHeaders, "Last Name");
  properties.tLunchDayColumn = getColumnIndex(tHeaders, "Lunch Day");
  properties.tLunchTimeColumn = getColumnIndex(tHeaders, "Lunch Time");
  properties.tLunchPreferenceColumn = getColumnIndex(tHeaders, "Lunch Preference");
  properties.tCommentsColumn = getColumnIndex(tHeaders, "Comments");
  properties.tTableColumn = getColumnIndex(tHeaders, "Table");
  properties.tHouseColumn = getColumnIndex(tHeaders, "House");
  properties.tSectionColumn = getColumnIndex(tHeaders, "Section");

  PropertiesService.getDocumentProperties().setProperties(properties);
  var properties = PropertiesService.getDocumentProperties();
  
  //Start of hendersan airtight 
  for(var i = 0; i < tHeaders.length; i++) {
    if (tHeaders[i] != "") {
      properties.setProperty("Teacher " + tHeaders[i], i);
    }
  }
}
