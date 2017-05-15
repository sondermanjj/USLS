

function testting() {
  var properties =  PropertiesService.getDocumentProperties()
  properties.deleteAllProperties();
  var schoolDays = { 1 : 'A', 2 : 'B', 3 : 'C', 4 : 'D', 5 : 'E', 6 : 'F', 7 : 'G', 8 : 'H',
                     A1 : 'A', B2 : 'B', C3 : 'C', D4 : 'D', E5 : 'E', F6 : 'F', G7 : 'G', H8 : 'H'};
  
  Logger.log(properties.getProperties());
  
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
 *     pLunchTimeColumn - Lunch Time
 *     pLunchDayColumn - Lunch Day
 *     pSFNameColumn - First Name
 *     pSLNameColumn - Last Name
 *     pTFNameColumn - Faculty First Name
 *     pTLNameColumn - Faculty Last Name
 *     pAdvisorColumn - Advisor
 *     pGenderColumn - Gender
 *     pCourseTitleColumn - Course Title
 *     pCourseCodeColumn - Course Code
 *     pCourseLengthColumn - Course Length
 *     pCourseIDColumn - Course ID
 *     pSectionIDColumn - Section ID
 *     pBlockColumn - Block
 *     pDOBColumn - Date of Birth
 *     pTableHeadColumn - Table Head
 *     pTableColumn - Table
 *     pGradeColumn - Grade
 *     pHouseColumn - House
 *
 *   Column Indices for Teachers:
 *     tFNameColumn - First Name
 *     tLNameColumn - Last Name
 *     tLunchDayColumn - Lunch Day
 *     tLunchTimeColumn - Lunch Assignment (Lunch Time)
 *     tLunchPreferenceColumn;
 *     tCommentsColumn;
 *     tSectionColumn;
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
  var schoolDays = { 1 : 'A', 2 : 'B', 3 : 'C', 4 : 'D', 5 : 'E', 6 : 'F', 7 : 'G', 8 : 'H',
                     A1 : 'A', B2 : 'B', C3 : 'C', D4 : 'D', E5 : 'E', F6 : 'F', G7 : 'G', H8 : 'H'};
  
  
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
function setSheetProperties() {

  var properties = PropertiesService.getDocumentProperties();

  var studentSheet = promptForSettingSheetProperty("Which sheet has the cleaned student data?");
  var teacherChoicesSheet = promptForSettingSheetProperty("Which sheet has the  faculty lunch choices?");
  var teacherTableSheet = promptForSettingSheetProperty("Which sheet has the faculty table data?");
  var dodSheet = promptForSettingSheetProperty("Which sheet has the DOD list?");
  
  setStudentSheet(studentSheet);
  setTeacherChoicesSheet(teacherChoicesSheet);
  setTeacherTableSheet(teacherTableSheet);
  setDODSheet(dodSheet);
  
  //Needs to run after setting sheets
  setStudentColumnIndices(properties.getProperty("studentData"));
  setTeacherColumnIndices(properties.getProperty("teacherChoices"));
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

  var properties = PropertiesService.getDocumentProperties();
  
   
  for(var i = 0; i < tHeaders.length; i++) {
    if (tHeaders[i] != "") {
      properties.setProperty("Teacher " + tHeaders[i], i);
    }
  }
}
