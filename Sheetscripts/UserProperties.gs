function testting() {
 
  Logger.log(PropertiesService.getDocumentProperties().getProperties());
  Logger.log(PropertiesService.getUserProperties().getProperties());
}


/**
 * @desc - Runs the raw data sheet cleanup and then initializes the document properties with the proper sheet names and studet adn teacher data
 * @author - hendersonam
 */
function initilization() {
  
  var studentSheet = sheetCleanupPrompt();
  
  var teacherChoicesSheet = promptForSettingSheetProperty("Which sheet would you like to use for faculty lunch choices?");
  
  var teacherTableSheet = promptForSettingSheetProperty("Which sheet would you like to use for faculty table data?");
  
  var dodSheet = promptForSettingSheetProperty("Which sheet would you like to use for the DOD list?");
  
  var documentProperties = PropertiesService.getDocumentProperties();
  
  setStudentSheet(studentSheet);
  setTeacherChoicesSheet(teacherChoicesSheet);
  setTeacherTableSheet(teacherTableSheet);
  setDODSheet(dodSheet);

  setStudentProperties(studentSheet.getDataRange().getValues());
  setTeacherProperties(teacherChoicesSheet.getDataRange().getValues());
}

/**
 * @desc - Sets the document property for the student data sheet
 * @param - sheet - the student data sheet
 * @author - hendersonam
 */
function setStudentSheet(sheet) {
  var documentProperties = PropertiesService.getDocumentProperties();
  var name = sheet.getName();
  documentProperties.setProperty("studentData", name);
}

/**
 * @desc - Sets the document property for the teacher lunch choices sheet
 * @param - sheet - the teacher choices sheet
 * @author - hendersonam
 */
function setTeacherChoicesSheet(sheet) {
  var documentProperties = PropertiesService.getDocumentProperties();
  var name = sheet.getName();
  documentProperties.setProperty("teacherChoices", name);
}

/**
 * @desc - Sets the document property for the taecher table sheet
 * @param - sheet - the teacher tables sheet
 * @author - hendersonam
 */
function setTeacherTableSheet(sheet) {
  var documentProperties = PropertiesService.getDocumentProperties();
  var name = sheet.getName();
  documentProperties.setProperty("teacherTables", name);
}

/**
 * @desc - Sets the document property for the DOD list sheet
 * @param - sheet - the DOD list sheet
 * @author - hendersonam
 */
function setDODSheet(sheet) {
  var documentProperties = PropertiesService.getDocumentProperties();
  var name = sheet.getName();
  documentProperties.setProperty("DODList", name);
}


/**
 *@desc Sets the documnet properties for the final student data column header indices to be sued as global variables
 *@params - Object[][] - the array of the Final Student Data
 *@author - dicksontc, hendersonam
*/
function setStudentProperties(pValues){

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
                     
  var pHeaders = getListOfColumns(pValues);
  Logger.log(pHeaders);
  
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
function setTeacherProperties(tValues) {

  var properties = { tFNameColumn : 0,
                     tLNameColumn : 0,
                     tLunchDayColumn : 0,
                     tLunchTimeColumn : 0};

  var tHeaders = getListOfColumns(tValues);
  Logger.log(tHeaders);
  
  properties.tFNameColumn = getColumnIndex(tHeaders, "First Name");
  properties.tLNameColumn = getColumnIndex(tHeaders, "Last Name");
  properties.tLunchDayColumn = getColumnIndex(tHeaders, "Lunch Day");
  properties.tLunchTimeColumn = getColumnIndex(tHeaders, "Lunch Assignment");
  
  PropertiesService.getDocumentProperties().setProperties(properties);
}
