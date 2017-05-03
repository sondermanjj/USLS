

function testting() {
 setLetterDays(["A", "B", "C", "D", "E", "F", "G", "H"]);
 Logger.log(PropertiesService.getDocumentProperties().getProperties());
 setHeaderColumnNames();
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
 * @desc - Sets the properties for the document, cleans the raw file, assigns students, assigns
 *         faculty tables, and scans the data to retrieve statistics and to prepare for schedule changes
 * @author - hendersonam
 */
function initialization() {

  setProperties();
  assignStudentLunchDays();
  addFacultyTables();
  
  var oldData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Scanned Data");
  if (oldData != null ) {
    SpreadsheetApp.getActiveSpreadsheet().deleteSheet(oldData);
  }
  var oldChanges = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Student Schedule Changes");
  if (oldChanges != null ) {
    SpreadsheetApp.getActiveSpreadsheet().deleteSheet(oldChanges);
  }
  
  
}

/**
 * @desc - Sets the document property for the list of header columns in the student data sheet. Saves it as
 *         a Json.stringify(array)
 * @author - hendersonam
 */
function setHeaderColumnNames() {
  var properties = PropertiesService.getDocumentProperties();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var studentSheet = ss.getSheetByName(properties.getProperty("studentData"));
  var data = studentSheet.getDataRange().getValues();
  var headers = getListOfColumns(data);
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
 * @desc - Runs the raw data sheet cleanup and then initializes the document properties with the proper sheet names and studet adn teacher data
 * @author - hendersonam
 */
function setProperties() {
  
  var properties = PropertiesService.getDocumentProperties();
  
  setSheets();
  setStudentColumnIndices(properties.getProperty("studentData"));
  setTeacherColumnIndices(properties.getProperty("teacherChoices"));
  setLetterDays(["A", "B", "C", "D", "E", "F", "G", "H"]);
  setLunchTimes(["early", "mid", "late"]);
  setAssignedLunches([["early", 133]]);
  setNonAssignedLunches(["mid", "late"]);
  setNumberOfTables(19);
  setHeaderColumnNames();
  
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
 * @desc - Sets the document properties for the sheets that will be used throughout the program
 * @author - hendersonam
 */
function setSheets() {

  var studentSheet = sheetCleanupPrompt();
  var teacherChoicesSheet = promptForSettingSheetProperty("Which sheet would you like to use for faculty lunch choices?");
  var teacherTableSheet = promptForSettingSheetProperty("Which sheet would you like to use for faculty table data?");
  var dodSheet = promptForSettingSheetProperty("Which sheet would you like to use for the DOD list?");
  
  setStudentSheet(studentSheet);
  setTeacherChoicesSheet(teacherChoicesSheet);
  setTeacherTableSheet(teacherTableSheet);
  setDODSheet(dodSheet);
 
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
function setStudentColumnIndices(sheetName){
  
  var studentValues = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName).getDataRange().getValues();
  var pHeaders = getListOfColumns(studentValues);

  var properties = { pLunchTimeColumn: 0, 
                     pLunchDayColumn: 0, 
                     pSFNameColumn: 0,
                     pSLNameColumn: 0, 
                     pTFNameColumn: 0, 
                     pTLNameColumn: 0,
                     pAdvisorColumn: 0, 
                     pGenderColumn: 0,
                     pCourseTitleColumn: 0, 
                     pCourseCodeColumn: 0, 
                     pCourseLengthColumn: 0,
                     pCourseIDColumn: 0, 
                     pSectionIDColumn: 0, 
                     pBlockColumn: 0, 
                     pDOBColumn: 0,
                     pTableHeadColumn: 0,
                     pTableColumn: 0, 
                     pGradeColumn: 0,
                     pHouseColumn: 0};
  
  properties.pLunchTimeColumn = getColumnIndex(pHeaders, "Lunch Time");
  properties.pLunchDayColumn = getColumnIndex(pHeaders, "Lunch Day");
  properties.pSFNameColumn = getColumnIndex(pHeaders, "First Name");
  properties.pSLNameColumn = getColumnIndex(pHeaders, "Last Name");
  properties.pTFNameColumn = getColumnIndex(pHeaders, "Faculty First Name");
  properties.pTLNameColumn = getColumnIndex(pHeaders, "Faculty Last Name");
  properties.pAdvisorColumn = getColumnIndex(pHeaders, "Advisor");
  properties.pGenderColumn = getColumnIndex(pHeaders, "Gender");
  properties.pCourseTitleColumn = getColumnIndex(pHeaders, "Course Title");
  properties.pCourseCodeColumn = getColumnIndex(pHeaders, "Course Code");
  properties.pCourseLengthColumn = getColumnIndex(pHeaders, "Course Length");
  properties.pCourseIDColumn = getColumnIndex(pHeaders, "Course ID");
  properties.pSectionIDColumn = getColumnIndex(pHeaders, "Section Identifier");
  properties.pBlockColumn = getColumnIndex(pHeaders, "Block");
  properties.pDOBColumn = getColumnIndex(pHeaders, "Date of Birth");
  properties.pHouseColumn = getColumnIndex(pHeaders, "House");
  properties.pTableHeadColumn = getColumnIndex(pHeaders, "Table Head");
  properties.pTableColumn = getColumnIndex(pHeaders, "Lunch Table");
  properties.pGradeColumn = getColumnIndex(pHeaders, "Grade Level");
  
  PropertiesService.getDocumentProperties().setProperties(properties);
}

/**
 *@desc Sets the documnet properties for the teacher choices column header indices to be used as global variables
 *@params - Object[][] - the array of the Faculty Choices dadta
 *@author - dicksontc, hendersonam
*/
function setTeacherColumnIndices(sheetName) {

  var teacherValues = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName).getDataRange().getValues();
  var tHeaders = getListOfColumns(teacherValues);
   
  var properties = { tFNameColumn : 0,
                     tLNameColumn : 0,
                     tLunchDayColumn : 0,
                     tLunchTimeColumn : 0,
                     tLunchPreferenceColumn : 0,
                     tCommentsColumn : 0,
                     tSectionColumn : 0};
  
  properties.tFNameColumn = getColumnIndex(tHeaders, "First Name");
  properties.tLNameColumn = getColumnIndex(tHeaders, "Last Name");
  properties.tLunchDayColumn = getColumnIndex(tHeaders, "Lunch Day");
  properties.tLunchTimeColumn = getColumnIndex(tHeaders, "Lunch Assignment");
  properties.tLunchPreferenceColumn = getColumnIndex(tHeaders, "Lunch Preference");
  properties.tCommentsColumn = getColumnIndex(tHeaders, "Comments");
  properties.tSectionColumn = getColumnIndex(tHeaders, "Section");
  
  PropertiesService.getDocumentProperties().setProperties(properties);
}
