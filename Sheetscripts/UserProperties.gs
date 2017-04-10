
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
 *   Column Inidices for Students:
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
  setNumberOfTables(19);
  
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
                     tLunchTimeColumn : 0};
  
  properties.tFNameColumn = getColumnIndex(tHeaders, "First Name");
  properties.tLNameColumn = getColumnIndex(tHeaders, "Last Name");
  properties.tLunchDayColumn = getColumnIndex(tHeaders, "Lunch Day");
  properties.tLunchTimeColumn = getColumnIndex(tHeaders, "Lunch Assignment");
  
  PropertiesService.getDocumentProperties().setProperties(properties);
}
